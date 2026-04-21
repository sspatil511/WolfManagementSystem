import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const CATEGORIES = ['All', 'Fullstack', 'Frontend', 'Backend']
const TAGS = ['All', 'React', 'Node.js', 'Python', 'Django', 'Vue.js', 'Angular', 'Flask']

const FilterContent = ({ filters, onFilterChange }) => {
  return (
    <ScrollArea className="space-y-7 h-full max-h-[70vh]">
      <div>
        <h1 className="pb-3 text-gray-400">Category</h1>
        <Separator />
        <RadioGroup
          className="pt-5"
          value={filters.category}
          onValueChange={(value) => onFilterChange('category', value)}
        >
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center gap-3">
              <RadioGroupItem value={category} id={`category-${category}`} />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="pt-9">
        <h1 className="pb-3 text-gray-400">Tags</h1>
        <Separator />
        <div className="pt-5">
          <RadioGroup
            value={filters.tag}
            onValueChange={(value) => onFilterChange('tag', value)}
          >
            {TAGS.map((tag) => (
              <div key={tag} className="flex items-center gap-3">
                <RadioGroupItem value={tag} id={`tag-${tag}`} />
                <Label htmlFor={`tag-${tag}`}>{tag}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </ScrollArea>
  )
}

export const Filters = ({ filters, onFilterChange }) => {
  const hasActiveFilters =
    (filters.category && filters.category !== 'All') ||
    (filters.tag && filters.tag !== 'All')

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative w-10 h-10 border-2 rounded-lg transition-colors ${
            hasActiveFilters
              ? 'border-primary text-primary hover:border-primary/80'
              : 'border-gray-200 hover:border-gray-400'
          }`}
        >
          <MixerHorizontalIcon className="w-6 h-6" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="relative px-5 lg:px-0 lg:flex gap-5 justify-center py-5">
          <section className="w-full">
            <Card className="p-5">
              <CardContent className="mt-5">
                <FilterContent filters={filters} onFilterChange={onFilterChange} />
              </CardContent>
            </Card>
          </section>
        </div>

        {hasActiveFilters && (
          <div className="px-5 lg:px-0">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onFilterChange('category', 'All')
                onFilterChange('tag', 'All')
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}