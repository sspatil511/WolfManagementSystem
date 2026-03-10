import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Filters } from '@/components/ui/filters';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';

const TEMP_PROJECTS = [
  {
    id: "p1",
    title: "Wolf Management System",
    description:
      "A Spring Boot + React app for managing projects, issues, invitations, and team collaboration.",
    tags: ["Fullstack", "Spring Boot", "React", "MySQL"],
  },
  {
    id: "p2",
    title: "Issue Tracker",
    description:
      "Kanban-style workflow for issues with priorities, due dates, and role-based access.",
    tags: ["Backend", "JWT", "REST API"],
  },
  {
    id: "p3",
    title: "Dev Portfolio",
    description:
      "A clean portfolio site to showcase projects with searchable tags and quick filters.",
    tags: ["Frontend", "Vite", "Tailwind"],
  },
];

const TagPill = ({ label }) => (
  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
    {label}
  </span>
);



export const ProjectList = () => {

  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
  }

  return (
    <section className="w-full">
      <div className="px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground">
              {TEMP_PROJECTS.length} total
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:items-center">
            <div className="relative w-full md:w-[320px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                  placeholder='Search projects...'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className='pl-9'
              />
        </div>

        <Filters />
      </div>
    </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMP_PROJECTS.map((project) => (
            <Card key={project.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base leading-6">
                  {project.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <TagPill key={`${project.id}-${t}`} label={t} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};