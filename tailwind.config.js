/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: { fontFamily: { sans: ['Recursive Variable', "sans-serif"] } },
  },
  daisyui: { themes: ["night", "winter"], darkTheme: "night" },
  plugins: [
    require('@tailwindcss/typography'),
    require("daisyui")],
};
