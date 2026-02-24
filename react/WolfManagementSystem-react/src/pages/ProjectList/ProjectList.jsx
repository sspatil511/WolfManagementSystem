import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea} from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'

const tags = ['All', 'React', 'Node.js', 'Python', 'Django', 'Vue.js', 'Angular', 'Flask']

const FilterContent = ({ onFilterChange }) => {

    return (

        <ScrollArea className='space-y-7 h-[60vh] lg:h-[70vh]'>
            <div>
                <h1 className='pb-3 text-gray-400'>
                    Category
                </h1>
                <Separator/>
                <RadioGroup className='pt-5' defaultValue='All' onValueChange={(value) =>
                    onFilterChange('category', value)
                }>
                    <div className='flex items-center gap-3'>
                        <RadioGroupItem value='All' id='category-All'/>
                        <Label htmlFor='category-All'>All</Label>
                    </div>
                    <div className='flex items-center gap-3'>
                        <RadioGroupItem value='Fullstack' id='category-Fullstack'/>
                        <Label htmlFor='category-Fullstack'>Fullstack</Label>
                    </div>
                    <div className='flex items-center gap-3'>
                        <RadioGroupItem value='Frontend' id='category-Frontend'/>
                        <Label htmlFor='category-Frontend'>Frontend</Label>
                    </div>
                    <div className='flex items-center gap-3'>
                        <RadioGroupItem value='Backend' id='category-Backend'/>
                        <Label htmlFor='category-Backend'>Backend</Label>
                    </div>
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
                            <RadioGroupItem value={tag} id={tag}/>
                            <Label htmlFor={tag}>{tag}</Label>
                        </div>)}
                    </RadioGroup>
                </div>
            </div>
        </ScrollArea>
    )
}

export const ProjectList = () => {

    const handleFilterChange = React.useCallback((section, value) => {
        console.log(`Filter changed: ${section} - ${value}`);
    }, [])

  return (
    <>
        <div className='relative px-5 lg:px-0 lg:flex gap-5 justify-center py-5'>
            <section className='filterSection'>
                <Card className='p-5 sticky top-10'>
                    <CardHeader className='flex-row items-center justify-between lg:w-[20rem]'>
                        <CardTitle>filters</CardTitle>
                            <Button variant='ghost' size='icon'>
                                <MixerHorizontalIcon/>
                            </Button>
                    </CardHeader>
                    <CardContent className='mt-5'>
                        <FilterContent onFilterChange={handleFilterChange}/>
                    </CardContent>
                </Card>
            </section>
            <section className='projectListSection w-full lg:w-[48rem]'>

            </section>
        </div>
    </>
  )
}
