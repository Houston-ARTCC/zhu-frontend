'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CgSpinner } from 'react-icons/cg';
import { SelectInput, type SelectOption } from '@/components/Forms';

interface StudentSelectInputProps {
    options: {
        label: string;
        options: SelectOption[];
    }[];
}

export const StudentSelectInput: React.FC<StudentSelectInputProps> = ({ options }) => {
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
                label="Select a Student"
                menuPortalTarget={document.body}
                options={options}
                onChange={(option) => {
                    if (option) {
                        setLoading(true);
                        router.push(`/training/profile/${option.value}`);
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
