import localFont from 'next/font/local';

export const ceraPro = localFont({
    src: [
        {
            path: './CeraPro-Light.woff2',
            weight: '300',
            style: 'normal',
        },
        {
            path: './CeraPro-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './CeraPro-RegularItalic.woff2',
            weight: '400',
            style: 'italic',
        },
        {
            path: './CeraPro-Medium.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: './CeraPro-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: './CeraPro-BoldItalic.woff2',
            weight: '700',
            style: 'italic',
        },
    ],
    variable: '--font-cera-pro',
});
