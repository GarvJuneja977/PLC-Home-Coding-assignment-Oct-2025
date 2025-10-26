/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // ✅ Required so Tailwind scans all .tsx files
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  