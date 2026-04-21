import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Filters } from '@/components/ui/filters';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import { getUserProjects } from '@/api/authApi';
import { FolderOpen, FilterX } from 'lucide-react';

const DEFAULT_FILTERS = { category: 'All', tag: 'All' };

export const ProjectList = () => {
  const { currentUser } = useAuth();
  const { refreshKey } = useProjects();

  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const firstName = currentUser?.fullName?.trim().split(' ')[0] || 'there';

  useEffect(() => {
    setLoading(true);
    setError('');

    const fetchProjects = async () => {
      try {
        const res = await getUserProjects();
        setProjects(res.data);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [refreshKey]);

  const handleFilterChange = (section, value) => {
    setFilters((prev) => ({ ...prev, [section]: value }));
  };

  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
  };

  const hasActiveFilters =
    (filters.category && filters.category !== 'All') ||
    (filters.tag && filters.tag !== 'All') ||
    searchQuery.trim().length > 0;

  const filteredProjects = useMemo(() => {
    let result = projects;

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      result = result.filter(
        (project) =>
          project.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply tag filter
    if (filters.tag && filters.tag !== 'All') {
      result = result.filter((project) =>
        project.tags?.some(
          (tag) => tag.toLowerCase() === filters.tag.toLowerCase()
        )
      );
    }

    // Apply search query
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (normalizedQuery) {
      result = result.filter((project) =>
        project.name.toLowerCase().includes(normalizedQuery)
      );
    }

    return result;
  }, [projects, filters, searchQuery]);

  const activeFilterSummary = [
    filters.category !== 'All' && filters.category,
    filters.tag !== 'All' && filters.tag,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <section className="w-full">
      <div className="px-6 py-6">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here are all the projects you're part of.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm text-muted-foreground">
              {loading
                ? 'Loading...'
                : `${filteredProjects.length} of ${projects.length} project${projects.length !== 1 ? 's' : ''}`}
            </p>
            {activeFilterSummary && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterSummary}
              </Badge>
            )}
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:items-center">
            <div className="relative w-full md:w-[320px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Filters filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 rounded-xl border bg-muted animate-pulse" />
            ))}
          </div>

        ) : error ? (
          <div className="mt-8 rounded-xl border border-destructive/40 bg-destructive/5 p-8 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>

        ) : projects.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed p-12 text-center flex flex-col items-center gap-3">
            <FolderOpen className="h-10 w-10 text-muted-foreground/50" />
            <div>
              <h2 className="text-base font-medium">No projects yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You're not part of any projects yet. Create one using the + button above.
              </p>
            </div>
          </div>

        ) : filteredProjects.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed p-10 text-center flex flex-col items-center gap-4">
            <FilterX className="h-10 w-10 text-muted-foreground/50" />
            <div>
              <h2 className="text-base font-medium">No projects match your filters</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeFilterSummary
                  ? `No projects found for "${activeFilterSummary}"${searchQuery ? ` matching "${searchQuery}"` : ''}.`
                  : `No projects match "${searchQuery}".`}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear all filters
            </Button>
          </div>

        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-6">
                      {project.name}
                    </CardTitle>
                    {project.category && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        {project.category}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description || 'No description provided.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <Badge key={`${project.id}-${tag}`} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};