import React from 'react';
import { LuStar } from 'react-icons/lu';
import classNames from 'classnames';

interface RatingInputProps {
    value: number;
    onChange: (value: number) => void;
}

export const RatingInput: React.FC<RatingInputProps> = React.forwardRef<HTMLDivElement, RatingInputProps>(
    ({ value, onChange }, ref) => (
        <div ref={ref} className="mb-1.5">
            <p className="mb-3 font-medium">Rating</p>
            <div className="flex gap-2">
                {Array(5).fill(undefined)
                    .map((_, i) => (
                        <LuStar
                            key={i}
                            className={
                                classNames(
                                    'stroke-0 cursor-pointer',
                                    {
                                        'fill-neutral-300': i >= value,
                                        'fill-amber-400': i < value,
                                    },
                                )
                            }
                            onClick={() => onChange(i + 1)}
                            size={30}
                        />
                    ))}
            </div>
        </div>
    ),
);

// React.forwardRef does not preserve this information, so we have to set it manually for debugging.
RatingInput.displayName = 'RatingInput';
