import type { TimelineItem } from '@/types/timeline';
import { type FC } from 'react'

interface TimelineProps {
    items: TimelineItem[];
}

const Timeline: FC<TimelineProps> = ({ items }) => {
    return (
        <div className='my-8'>
            <div className='flex items-center mb-4'>
                {items.map((item: TimelineItem, index: number) => (
                    <>
                        <div key={`text-${index}`} className='text-center' style={{ flex: '0 0 auto' }}>
                            <div className='text-white text-sm font-medium whitespace-nowrap'>
                                {item.label}
                            </div>
                            <div className='text-gray text-sm mt-1 whitespace-nowrap'>
                                {item.sub_label}
                            </div>
                        </div>

                        {!item.is_last && (
                            <div key={`spacer-${index}`} className='flex-1' />
                        )}
                    </>
                ))}
            </div>

            <div className='flex items-center'>
                {items.map((item: TimelineItem, index: number) => (
                    <>
                        <div key={`square-${index}`} className='flex justify-center' style={{ flex: '0 0 auto' }}>
                            <div className='w-5 h-5 rounded bg-white' />
                        </div>

                        {!item.is_last && (
                            <div key={`line-${index}`} className='h-0.5 bg-white flex-1' />
                        )}
                    </>
                ))}
            </div>
        </div>
    )
}

export default Timeline