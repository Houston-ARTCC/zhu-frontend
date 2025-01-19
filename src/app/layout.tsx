import React, { type PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { NextAuthProvider } from '@/components/static/NextAuthProvider';
import { Disclaimer } from '@/components/static/Disclaimer';
import { Footer } from '@/components/static/Footer';
import { Navbar } from '@/components/static/Navbar';
import { Toastify } from '@/components/static/Toastify';
import './fonts';
import './globals.css';

export const metadata = {
    title: 'Houston ARTCC',
    description: 'Welcome to the Virtual Houston ARTCC on VATSIM! Enjoy our friendly ATC services across Texas, Louisiana, Mississippi, and Alabama.',
    metadataBase: new URL('https://houston.center'),
    openGraph: {
        url: 'https://houston.center',
        siteName: 'Houston ARTCC',
        locale: 'en_US',
        type: 'website',
    },
};

export const viewport = {
    themeColor: '#109cf1',
};

const Root = ({ children }: PropsWithChildren) => (
    <html lang="en" className="h-full scroll-pt-36" suppressHydrationWarning>
        <body className="h-full">
            <ThemeProvider attribute="class">
                <NextAuthProvider>
                    <Navbar />
                    <div className="flex min-h-screen flex-col">
                        {children}
                        <div className="mt-auto">
                            <Disclaimer />
                            <Footer />
                        </div>
                    </div>
                </NextAuthProvider>
                <Toastify />
            </ThemeProvider>
        </body>
    </html>
);

export default Root;
