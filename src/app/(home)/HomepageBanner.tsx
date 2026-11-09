'use client';

import React, { useMemo, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import classNames from 'classnames';
import { useTheme } from 'next-themes';

const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const subscribe = () => () => undefined;

export const HomepageBanner = () => {
    // next-themes knows the theme on the first client render, and React never patches the server's empty src.
    const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
    const { resolvedTheme } = useTheme();

    const src = useMemo(() => {
        if (!hydrated) return EMPTY_IMAGE;
        switch (resolvedTheme) {
            case 'light': return '/img/homepage-bg.jpg';
            case 'dark': return '/img/homepage-bg-dark.jpg';
            default: return EMPTY_IMAGE;
        }
    }, [hydrated, resolvedTheme]);

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
                        'absolute top-0 flex h-screen w-screen flex-col items-center justify-center px-6 backdrop-blur-xs',
                        'mix-blend-overlay dark:mix-blend-normal',
                    )}
                >
                    <h2 className="mb-5 text-center text-xl font-medium text-white md:text-3xl">
                        From longhorns to space ships, we've got it all!
                    </h2>
                    <h1 className="text-center text-5xl font-semibold text-white md:text-8xl">
                        Welcome to
                        <br />
                        Houston
                    </h1>
                </div>
            </div>
        </ParallaxProvider>
    );
};
