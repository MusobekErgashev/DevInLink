/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B192C",
        secondary: "#E5A93B",
        tertiary: "#271501",
        natural: "#777778",
        background: "#0B0F1A",
      },
      fontFamily: {
        hanken: ["var(--font-hanken)", "sans-serif"],
        satoshi: ["var(--font-satoshi)", "sans-serif"],
        geist: ["var(--font-geist-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};