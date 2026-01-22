import { useStorage } from '@/hooks/useSupabase';
import { useEffect, useState, type FC } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

interface ObjectEligibilityProps {
    title: string;
    description: string;
    thumbnail: string;
    link: string;
}

const FALLBACK_THUMBNAIL = '/images/thumbnail.png';

const ObjectEligibility: FC<ObjectEligibilityProps> = ({
    title,
    description,
    thumbnail,
    link
}) => {
    const { getPublicUrl } = useStorage();
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(FALLBACK_THUMBNAIL);

    useEffect(() => {
        const loadThumbnail = async () => {
            if (!thumbnail) return setThumbnailUrl(FALLBACK_THUMBNAIL);
            try {
                const imageUrl = await getPublicUrl('object_types', thumbnail);
                setThumbnailUrl(imageUrl || FALLBACK_THUMBNAIL);
            } catch {
                setThumbnailUrl(FALLBACK_THUMBNAIL);
            }
        };
        loadThumbnail();
    }, [thumbnail, getPublicUrl]);

    return (
        <div className="
      min-w-[320px]
      w-[320px]
      flex 
      flex-col 
      bg-[#0a1410] 
      border 
      border-emerald-900/40 
      p-6 
      rounded-3xl 
      hover:border-emerald-500/50 
      transition-colors 
      group
    ">
            <div className="h-48 w-full overflow-hidden rounded-xl">
                <img
                    className="h-full w-full object-cover"
                    src={thumbnailUrl}
                    alt={title}
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_THUMBNAIL;
                    }}
                />
            </div>

            <div className="flex flex-col flex-1 pt-6">
                <h4 className="text-white text-xl font-bold tracking-wide uppercase">
                    {title}
                </h4>

                <p className="text-neutral-400 mt-3 line-clamp-3">
                    {description}
                </p>

                <Link
                    target="_blank"
                    to={link}
                    className="mt-auto pt-6 text-green-400 uppercase flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                    En savoir plus <BsArrowRight />
                </Link>
            </div>
        </div>
    );
};

export default ObjectEligibility;