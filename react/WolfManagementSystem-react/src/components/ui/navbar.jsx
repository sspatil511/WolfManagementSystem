import React, { useState } from 'react';
import { GitHubLogoIcon, PlusIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Filters } from './filters';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Sidebar } from './sidebar';
import { AvatarIcon } from '@radix-ui/react-icons';
import { Avatar } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectTrigger, SelectLabel, SelectItem, SelectValue, SelectGroup } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import { createProject } from '@/api/authApi';

const PRESET_TAGS = [
  'Java', 'Python', 'JavaScript', 'TypeScript', 'Docker',
  'Kubernetes', 'React', 'Node.js', 'Go', 'Rust', 'PostgreSQL', 'MongoDB'
];

const INITIAL_FORM = {
  name: '',
  description: '',
  category: '',
  tags: [],
  customTagInput: '',
};

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { triggerRefresh } = useProjects();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const routes = {
    '/': 'Home',
    '/projects': 'Projects',
    '/profile': 'My Profile',
    '/settings': 'Settings',
  };

  const pageTitle = routes[location.pathname] || 'Page';

  // Validation: name and category are required
  const isFormValid = form.name.trim().length > 0 && form.category.length > 0;

  const handleField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleTagSelect = (tag) => {
    if (!form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleCustomTagKeyDown = (e) => {
    if (e.key === 'Enter' && form.customTagInput.trim()) {
      e.preventDefault();
      const newTag = form.customTagInput.trim();
      if (!form.tags.includes(newTag)) {
        setForm((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
          customTagInput: '',
        }));
      } else {
        setForm((prev) => ({ ...prev, customTagInput: '' }));
      }
    }
  };

  const handleOpenChange = (open) => {
    setDialogOpen(open);
    if (!open) {
      setForm(INITIAL_FORM);
      setSubmitError('');
    }
  };

  const handleCreateProject = async () => {
    if (!isFormValid) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      await createProject({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        tags: form.tags,
      });

      triggerRefresh();
      handleOpenChange(false);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'Failed to create project. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const availablePresetTags = PRESET_TAGS.filter(
    (tag) => !form.tags.includes(tag)
  );

  return (
    <>
      <nav className="w-full border-b bg-background">
        <div className="flex items-center justify-between px-6 py-3">

          <div className="flex items-center gap-3">
            <Sidebar />
            <Avatar className="w-10 h-10 flex items-center justify-center">
              <GitHubLogoIcon className="w-8 h-8" />
            </Avatar>
            <Button
              variant="ghost"
              className="h-10 px-4 hover:border-gray-400 transition-colors text-lg font-semibold text-foreground"
            >
              {pageTitle}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full [&_svg]:size-5">
                  <PlusIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
                    Create new project
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full [&_svg]:size-8">
                  <AvatarIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="text-red-500" onSelect={handleLogout}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
      </nav>

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details below to set up your new project.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 py-2">

            {/* Project name — required */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-name">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="project-name"
                placeholder="Enter project name"
                value={form.name}
                onChange={(e) => handleField('name', e.target.value)}
              />
            </div>

            {/* Description — optional */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-description">
                Description
                <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="project-description"
                placeholder="Describe your project..."
                value={form.description}
                onChange={(e) => handleField('description', e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Category — required */}
            <div className="flex flex-col gap-2">
              <Label>
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.category}
                onValueChange={(val) => handleField('category', val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Fullstack">Fullstack</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Tags — optional */}
            <div className="flex flex-col gap-2">
              <Label>
                Tags
                <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
              </Label>
              <Select onValueChange={handleTagSelect} value="">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Technologies</SelectLabel>
                    {availablePresetTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Input
                placeholder="Or type a custom tag and press Enter..."
                value={form.customTagInput}
                onChange={(e) => handleField('customTagInput', e.target.value)}
                onKeyDown={handleCustomTagKeyDown}
              />

              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {form.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20 transition-colors"
                        aria-label={`Remove ${tag}`}
                      >
                        <Cross2Icon className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Inline error */}
            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}

          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!isFormValid || submitting}
            >
              {submitting ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};