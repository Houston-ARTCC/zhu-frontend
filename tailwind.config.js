/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'selector',
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        fontFamily: {
            sans: ['"Cera Pro"', 'sans-serif'],
            mono: ['monospace'],
        },
        extend: {
            colors: {
                darkblue: '#334d6e',
                zinc: {
                    850: '#202023',
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
