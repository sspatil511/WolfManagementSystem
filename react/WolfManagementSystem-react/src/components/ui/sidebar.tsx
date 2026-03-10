import * as React from 'react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  HamburgerMenuIcon,
  HomeIcon,
  PersonIcon,
  GearIcon,
  DashboardIcon,
  FileTextIcon,
} from '@radix-ui/react-icons'
import { Card, CardContent } from '@/components/ui/card'

const sidebarItems = [
  { name: 'Home', icon: HomeIcon },
  { name: 'Dashboard', icon: DashboardIcon },
  { name: 'Profile', icon: PersonIcon },
  { name: 'Projects', icon: FileTextIcon },
  { name: 'Settings', icon: GearIcon },
]

export const Sidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='w-10 h-10 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-colors'
        >
          <HamburgerMenuIcon className='w-6 h-6' />
        </Button>
      </SheetTrigger>

      <SheetContent side='left'>
        <div className='relative px-5 lg:px-0 lg:flex gap-5 justify-center py-5'>
          <section className='w-full'>
            <Card className='p-5'>
              <CardContent className='mt-5 px-0'>
                <div className='flex flex-col gap-2'>
                  {sidebarItems.map((item) => {
                    const Icon = item.icon

                    return (
                      <Button
                        key={item.name}
                        variant='ghost'
                        className='w-full justify-start gap-3 text-base'
                      >
                        <Icon className='w-5 h-5' />
                        <span>{item.name}</span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}