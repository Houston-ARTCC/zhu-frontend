import React from 'react';
import { LuAlertCircle } from 'react-icons/lu';

export const Disclaimer: React.FC = () => (
    <div className="container mx-auto">
        <div className="mx-8 mb-16 rounded-md bg-sky-500/10 p-5 text-sky-500 md:mx-16 md:pl-7 md:pr-10 lg:mx-64">
            <div className="flex gap-3">
                <div className="pt-1">
                    <LuAlertCircle size={25} />
                </div>
                <div>
                    <h4 className="mb-0.5 text-2xl font-medium">Disclaimer!</h4>
                    <p>
                        All information on this website is for flight simulation use only and is not to be used for real
                        world navigation or flight. This site is not affiliated with ICAO, the FAA, the actual Houston
                        ARTCC, or any other real world aerospace entity.
                    </p>
                </div>
            </div>
        </div>
    </div>
);
