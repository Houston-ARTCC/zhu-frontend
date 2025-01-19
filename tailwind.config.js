/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'selector',
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        fontFamily: {
            sans: ['"Montserrat"', 'sans-serif'],
            mono: ['monospace'],
        },
        extend: {
            colors: {
                zinc: {
                    850: '#202023',
                },
                heatmap: {
                    900: '#334d6e',
                    800: '#3e6184',
                    700: '#497599',
                    600: '#558bad',
                    500: '#6c9eb8',
                    400: '#82b0c2',
                    300: '#98c0cc',
                    200: '#aed0d7',
                    100: '#c4dee1',
                    50: '#daebec',
                },
            },
            boxShadow: {
                sm: '0 4px 10px rgba(203, 203, 203, 0.25)',
                DEFAULT: '2px 2px 20px rgba(203, 203, 203, 0.25)',
                lg: '2px 2px 20px rgba(4px 4px 30px, 0.25)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
