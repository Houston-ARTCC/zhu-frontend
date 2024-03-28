'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import classNames from 'classnames';
import { useTheme } from 'next-themes';

export const HomepageBanner = () => {
    const { resolvedTheme } = useTheme();

    const src = useMemo(() => {
        switch (resolvedTheme) {
            case 'light': return '/img/homepage-bg.jpg';
            case 'dark': return '/img/homepage-bg-dark.jpg';
            // Empty image for hydration step
            default: return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        }
    }, [resolvedTheme]);

    return (
        <ParallaxProvider>
            <div className="relative h-screen overflow-hidden">
                <Parallax speed={-50}>
                    <div className="relative h-screen">
                        <Image
                            className="-z-10 object-cover"
                            src={src}
                            alt="Homepage banner background"
                            fill
                        />
                    </div>
                </Parallax>
                <div
                    className={classNames(
                        'absolute top-0 flex h-screen w-screen flex-col items-center justify-center backdrop-blur-sm',
                        'mix-blend-overlay dark:mix-blend-normal',
                    )}
                >
                    <h2 className="mb-5 text-3xl font-medium text-white">
                        From longhorns to space ships, we've got it all!
                    </h2>
                    <h1 className="text-center text-8xl font-semibold text-white">
                        Welcome to
                        <br />
                        Houston
                    </h1>
                </div>
            </div>
        </ParallaxProvider>
    );
};
