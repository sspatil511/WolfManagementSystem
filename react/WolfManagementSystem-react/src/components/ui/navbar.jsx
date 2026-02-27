import React from 'react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Filters }  from './filters';
import { useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { AvatarIcon } from '@radix-ui/react-icons';
import { Avatar } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

export const Navbar = () => {

    const location = useLocation();

    const routes = {
        '/': 'Home',
        '/projects': 'Projects',
        '/profile': 'My Profile',
        '/settings': 'Settings'
    }

    const pageTitle = routes[location.pathname] || 'Page';

    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    }
    return (

        <nav className='w-full border-b bg-background'>
            <div className='flex items-center justify-between px-6 py-3'>

                <div className='flex items-center gap-3'>
                    <Filters/>
                    <Avatar className='w-10 h-10 flex items-center justify-center'>
                        <GitHubLogoIcon className='w-8 h-8'/>
                    </Avatar>
                    <Button variant='ghost' className='h-10 px-4 hover:border-gray-400 transition-colors text-lg font-semibold text-foreground'>
                        {pageTitle}
                    </Button>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='relative w-64'>
                        <MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none'/>
                        <Input
                            placeholder='Search...'
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className='pl-9'
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='w-10 h-10 rounded-full p-0 flex items-center justify-center'>
                                <AvatarIcon className='w-full h-full scale-150'/>
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
    )
}