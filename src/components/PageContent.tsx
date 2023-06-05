import React, { type PropsWithChildren } from 'react';
import { LuAlertCircle } from 'react-icons/lu';

export const PageContent: React.FC<PropsWithChildren> = ({ children }) => (
    <main className="container mx-auto px-20 py-16">
        {children}
        <div className="mx-64 mt-16 rounded-md bg-sky-500/10 py-5 pl-7 pr-10 text-sky-500">
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
    </main>
);
