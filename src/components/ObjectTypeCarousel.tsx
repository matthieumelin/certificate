import ObjectEligibility from '@/components/Dashboard/Cards/ObjectEligibility';
import { useObjectTypes } from '@/hooks/useSupabase';
import { useEffect, useRef, useState, type FC } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ObjectTypeCarousel: FC = () => {
    const { objectTypes } = useObjectTypes();

    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false)
    const [canScrollRight, setCanScrollRight] = useState<boolean>(true)

    const carouselRef = useRef<HTMLDivElement | null>(null)
    const scrollIntervalRef = useRef<number | null>(null)
    const pauseTimeoutRef = useRef<number | null>(null);

    const SCROLL_AMOUNT = 360

    const sortedObjectTypes = objectTypes.sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
    const duplicatedItems = [...sortedObjectTypes, ...sortedObjectTypes, ...sortedObjectTypes];

    const resetScrollPosition = () => {
        if (!carouselRef.current) return;

        const scrollWidth = carouselRef.current.scrollWidth;
        const singleSetWidth = scrollWidth / 3;
        const currentScroll = carouselRef.current.scrollLeft;

        if (currentScroll >= singleSetWidth * 2) {
            carouselRef.current.scrollLeft = currentScroll - singleSetWidth;
        }
        else if (currentScroll <= singleSetWidth * 0.1) {
            carouselRef.current.scrollLeft = currentScroll + singleSetWidth;
        }
    };

    useEffect(() => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current)
            scrollIntervalRef.current = null
        }

        if (!carouselRef.current || isPaused || objectTypes.length === 0) {
            return
        }

        scrollIntervalRef.current = setInterval(() => {
            if (carouselRef.current && !isPaused) {
                carouselRef.current.scrollLeft += 1;
                resetScrollPosition();
            }
        }, 20);

        return () => {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current)
                scrollIntervalRef.current = null
            }
        }
    }, [isPaused, objectTypes.length]);

    useEffect(() => {
        if (carouselRef.current && objectTypes.length > 0) {
            const singleSetWidth = carouselRef.current.scrollWidth / 3;
            carouselRef.current.scrollLeft = singleSetWidth;
        }
    }, [objectTypes.length]);

    const updateScrollButtons = () => {
        if (!carouselRef.current) return

        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5)
    }

    const handlePause = (pause: boolean) => {
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current)
            pauseTimeoutRef.current = null
        }

        setIsPaused(pause)
    }

    const scrollLeftAction = () => {
        handlePause(true)

        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: -SCROLL_AMOUNT,
                behavior: 'smooth',
            })

            setTimeout(() => {
                resetScrollPosition();
            }, 300);
        }

        pauseTimeoutRef.current = setTimeout(() => handlePause(false), 2000)
    }

    const scrollRightAction = () => {
        handlePause(true)

        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: SCROLL_AMOUNT,
                behavior: 'smooth',
            })

            setTimeout(() => {
                resetScrollPosition();
            }, 300);
        }

        pauseTimeoutRef.current = setTimeout(() => handlePause(false), 2000)
    }

    useEffect(() => {
        updateScrollButtons()
    }, [objectTypes])

    useEffect(() => {
        return () => {
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current)
            }
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current)
            }
        }
    }, [])

    return (
        <div>
            <div className="max-w-[1440px] mx-auto mb-12 flex justify-between items-end gap-2 px-6 lg:px-0">
                <div className='space-y-2'>
                    <h2 className="text-4xl font-light text-white">
                        Solution <span className='text-emerald-500'>multi-actifs</span>
                    </h2>
                    <p className="text-neutral-400 italic">Une seule plateforme pour tous vos objets</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={scrollLeftAction}
                        disabled={!canScrollLeft}
                        className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all
          ${canScrollLeft
                                ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-500/10'
                                : 'border-emerald-900 text-emerald-800 cursor-not-allowed'
                            }`}
                    >
                        <IoIosArrowBack />
                    </button>

                    <button
                        onClick={scrollRightAction}
                        disabled={!canScrollRight}
                        className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all
          ${canScrollRight
                                ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-500/10'
                                : 'border-emerald-900 text-emerald-800 cursor-not-allowed'
                            }`}
                    >
                        <IoIosArrowForward />
                    </button>
                </div>
            </div>

            <div
                ref={carouselRef}
                onScroll={updateScrollButtons}
                onMouseEnter={() => handlePause(true)}
                onMouseLeave={() => handlePause(false)}
                className="overflow-x-auto no-scrollbar px-6 lg:px-0 flex gap-6 pb-8 lg:max-w-[1440px] lg:mx-auto scroll-smooth"
            >
                {duplicatedItems.map((objectType, index) => (
                    <ObjectEligibility
                        key={`${objectType.id}-${index}`}
                        title={objectType.label}
                        description={objectType.description}
                        thumbnail={objectType.thumbnail}
                        link='https://tally.so/r/meJ6Px'
                    />
                ))}
            </div>
        </div>
    )
}

export default ObjectTypeCarousel