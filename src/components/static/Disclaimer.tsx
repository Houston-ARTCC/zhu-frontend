import React from 'react';
import { LuCircleAlert } from 'react-icons/lu';
import { Alert, AlertTitle } from '@/components/Alert';

export const Disclaimer: React.FC = () => (
    <div className="container mx-auto">
        <Alert color="sky-500" icon={LuCircleAlert} className="mx-8 mb-16 md:mx-16 lg:mx-64">
            <AlertTitle>Disclaimer!</AlertTitle>
            <p>
                All information on this website is for flight simulation use only and is not to be used for real
                world navigation or flight. This site is not affiliated with ICAO, the FAA, the actual Houston
                ARTCC, or any other real world aerospace entity.
            </p>
        </Alert>
    </div>
);
