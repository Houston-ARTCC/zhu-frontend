'use client';

import React from 'react';
import Image from 'next/image';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';

export const HomepageBanner = () => (
    <ParallaxProvider>
        <div className="relative h-screen overflow-hidden">
            <Parallax speed={-30}>
                <div className="h-screen">
                    <Image
                        className="-z-10 object-cover"
                        src="/img/homepage-bg.jpg"
                        alt="Homepage banner background"
                        fill
                    />
                </div>
            </Parallax>
            <div className="absolute top-0 flex h-screen w-screen flex-col items-center justify-center mix-blend-overlay backdrop-blur-sm">
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
