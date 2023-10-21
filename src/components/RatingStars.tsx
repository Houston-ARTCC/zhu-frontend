import React from 'react';
import { LuStar } from 'react-icons/lu';
import classNames from 'classnames';

interface RatingStarsProps {
    rating: number;
    size?: number;
    className?: string
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = 20, className }) => (
    <div className={classNames('flex items-center gap-2', className)}>
        {[...Array(5)].map((_, i) => (
            i >= rating
                ? <LuStar key={i} size={size} className="" />
                : <LuStar key={i} size={size} className="fill-black" />
        ))}
    </div>
);
