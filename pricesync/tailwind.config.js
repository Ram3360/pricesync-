/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    950: '#030712', // Enterprise Dark Background
                    900: '#111827', // Section Background
                    800: '#1f2937', // Component Borders
                },
                indigo: {
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                }
            },
            letterSpacing: {
                widest: '.25em',
                tighter: '-.05em',
            },
            animation: {
                'spin-slow': 'spin 10s linear infinite',
            }
        },
    },
    plugins: [],
}
