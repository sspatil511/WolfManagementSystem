import React from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'

export const ProjectList = () => {
  return (
    <>
        <div className='relative px-5 lg:px-0 lg:flex gap-5 justify-center py-5'>
            <section className='filterSection'>
                <Card className='p-5 sticky top-10'>
                    <CardHeader className='flex-row items-center justify-between space-y-0'>
                        <CardTitle>filters</CardTitle>
                            <Button variant='ghost' size='icon'>
                                <MixerHorizontalIcon/>
                            </Button>
                    </CardHeader>
                </Card>
            </section>
            <section className='projectListSection'>

            </section>
        </div>
    </>
  )
}
