import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Filters } from '@/components/ui/filters';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import { getUserProjects } from '@/api/authApi';
import { FolderOpen } from 'lucide-react';

export const ProjectList = () => {
  const { currentUser } = useAuth();
  const { refreshKey } = useProjects();
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    if (!normalizedQuery) return projects;
    return projects.filter((project) =>
      project.name.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery, projects]);

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
          <p className="text-sm text-muted-foreground">
            {loading
              ? 'Loading...'
              : `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`}
          </p>

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
            <Filters />
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
          <div className="mt-8 rounded-xl border border-dashed p-8 text-center">
            <h2 className="text-base font-medium">No matching projects</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different search term.
            </p>
          </div>

        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base leading-6">
                    {project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description || 'No description provided.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <Badge key={`${project.id}-${tag}`} variant="outline">
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