import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea} from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Sheet, 
    SheetTrigger, 
    SheetContent,  
    SheetHeader, 
    SheetTitle} 
from '@/components/ui/sheet'

const catgories = ['All', 'Fullstack', 'Frontend', 'Backend']

const tags = ['All', 'React', 'Node.js', 'Python', 'Django', 'Vue.js', 'Angular', 'Flask']

const FilterContent = ({ onFilterChange }) => {

    return (

        <ScrollArea className='space-y-7 h-full max-h-[70vh]'>
            <div>
                <h1 className='pb-3 text-gray-400'>
                    Category
                </h1>
                <Separator/>
                <RadioGroup className='pt-5' defaultValue='All' onValueChange={(value) =>
                    onFilterChange('category', value)
                }>
                    {catgories.map((category) => (
                        <div key={category} className='flex items-center gap-3'>
                            <RadioGroupItem value={category} id={`category-${category}`}/>
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
            <div className='pt-9'>
                <h1 className='pb-3 text-gray-400'>
                    Tags
                </h1>
                <Separator/>
                <div className='pt-5'>
                    <RadioGroup defaultValue='All' onValueChange={(value) => 
                        onFilterChange('tag', value)
                    } >
                        {tags.map((tag) => <div key={tag} className='flex items-center gap-3'>
                            <RadioGroupItem value={tag} id={`tag-${tag}`}/>
                            <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                        </div>)}
                    </RadioGroup>
                </div>
            </div>
        </ScrollArea>
    )
}

export const Filters = () => {

    const handleFilterChange = React.useCallback((section, value) => {
        console.log(`Filter changed: ${section} - ${value}`);
    }, [])

  return (
    
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className="w-10 h-10 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
                    <MixerHorizontalIcon className='w-6 h-6'/>
                </Button>
            </SheetTrigger>
            <SheetContent side='right'>
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className='relative px-5 lg:px-0 lg:flex gap-5 justify-center py-5'>
                    <section className='w-full'>
                        <Card className='p-5'>
                            <CardContent className='mt-5'>
                                <FilterContent onFilterChange={handleFilterChange}/>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </SheetContent>
        </Sheet>
    
  )
}