import React, { useState } from 'react';
import { GitHubLogoIcon, PlusIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Filters }  from './filters';
import { useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Sidebar } from './sidebar';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { AvatarIcon } from '@radix-ui/react-icons';
import { Avatar } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectTrigger, SelectLabel, SelectItem, SelectValue, SelectGroup } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
const PRESET_TAGS = ['Java', 'Python', 'JavaScript', 'TypeScript', 'Docker', 'Kubernetes', 'React', 'Node.js', 'Go', 'Rust', 'PostgreSQL', 'MongoDB'];


export const Navbar = () => {

    const location = useLocation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [customTagInput, setCustomTagInput] = useState('');

    const routes = {    
        '/': 'Home',
        '/projects': 'Projects',
        '/prsofile': 'My Profile',
        '/settings': 'Settings'
    }

    const pageTitle = routes[location.pathname] || 'Page';

    const handleCreateProject = () => {
        // Handle project creation logic here
        setDialogOpen(false);
        setProjectTitle('');
        setProjectDescription('');
    };

    const handleTagSelect = (tag) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };
 
    const handleRemoveTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };
 
    const handleCustomTagKeyDown = (e) => {
        if (e.key === 'Enter' && customTagInput.trim()) {
            e.preventDefault();
            const newTag = customTagInput.trim();
            if (!selectedTags.includes(newTag)) {
                setSelectedTags([...selectedTags, newTag]);
            }
            setCustomTagInput('');
        }
    };
 
    // Only show tags in the select that haven't been selected yet
    const availablePresetTags = PRESET_TAGS.filter(tag => !selectedTags.includes(tag));

    return (
    
    <>
        <nav className='w-full border-b bg-background'>
            <div className='flex items-center justify-between px-6 py-3'>

                <div className='flex items-center gap-3'>
                    <Sidebar/>
                    <Avatar className='w-10 h-10 flex items-center justify-center'>
                        <GitHubLogoIcon className='w-8 h-8'/>
                    </Avatar>
                    <Button variant='ghost' className='h-10 px-4 hover:border-gray-400 transition-colors text-lg font-semibold text-foreground'>
                        {pageTitle}
                    </Button>
                </div>
                <div className='flex items-center gap-2'>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon' className='rounded-full [&_svg]:size-5'>
                                <PlusIcon/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-48'>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={() => setDialogOpen(true)}>Create new project</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon' className='rounded-full [&_svg]:size-8'>
                                <AvatarIcon/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-48'>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Subscription</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className='text-red-500'>Sign out</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                </div>
            </div>
        </nav>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to set up your new project.
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-5 py-2'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='project-title'>Project Title</Label>
                        <Input
                            id='project-title'
                            placeholder='Enter project title'
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='project-description'>Project Description</Label>
                        <Textarea
                            id='project-description'
                            placeholder='Describe your project...'
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            className='resize-none'
                            rows={4}
                        />
                    </div>
                    <Select>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select project type'/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Project Type</SelectLabel>
                                <SelectItem value='Frontend'>Frontend</SelectItem>
                                <SelectItem value='Backend'>Backend</SelectItem>
                                <SelectItem value='Fullstack'>Fullstack</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <div className='flex flex-col gap-2'>
                        <Label>Tags</Label>
                        <Select onValueChange={handleTagSelect}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select a tag'/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Technologies</SelectLabel>
                                    {availablePresetTags.map(tag => (
                                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder='Or type a custom tag and press Enter...'
                            value={customTagInput}
                            onChange={(e) => setCustomTagInput(e.target.value)}
                            onKeyDown={handleCustomTagKeyDown}
                        />
 
                        {/* Selected tags as badges */}
                        {selectedTags.length > 0 && (
                            <div className='flex flex-wrap gap-2 pt-1'>
                                {selectedTags.map(tag => (
                                    <Badge
                                        key={tag}
                                        variant='secondary'
                                        className='flex items-center gap-1 px-2 py-1'
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className='ml-1 rounded-full hover:bg-muted-foreground/20 transition-colors'
                                            aria-label={`Remove ${tag}`}
                                        >
                                            <Cross2Icon className='w-3 h-3'/>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
                <DialogFooter className='gap-2'>
                    <Button variant='outline' onClick={() => setDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateProject} disabled={!projectTitle.trim()}>
                        Create Project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
    </>

    )
}