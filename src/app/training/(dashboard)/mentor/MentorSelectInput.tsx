'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CgSpinner } from 'react-icons/cg';
import { SelectInput, type SelectOption } from '@/components/Forms';

interface MentorSelectInputProps {
    options: {
        label: string;
        options: SelectOption[];
    }[];
}

export const MentorSelectInput: React.FC<MentorSelectInputProps> = ({ options }) => {
    const router = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState<boolean>(false);

    // When the pathname changes, the new data has been loaded and we can remove the spinner.
    useEffect(() => {
        setLoading(false);
    }, [pathname]);

    return (
        <>
            <SelectInput
                label="Select a Mentor"
                options={options}
                onChange={(option) => {
                    if (option) {
                        setLoading(true);
                        router.push(`/training/mentor/${option.value}`);
                    }
                }}
            />
            {loading && (
                <div className="mt-10 flex justify-center">
                    <CgSpinner className="animate-spin text-sky-500" size={50} />
                </div>
            )}
        </>
    );
};
