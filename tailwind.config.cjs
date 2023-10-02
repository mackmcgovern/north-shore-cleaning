/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Jost', 'sans-serif'],
      },
      colors: {
        'light-black': '#171717',
        'teal-main': '#345C72',
        'teal-md': '#254151',
        'teal-dark': '#122028',
        // 'accent-gold': '#E2CD9D',
        'accent-gold': '#d6c091',
        'accent-gold-md': '#C99752',
        'accent-blue': '#D4EAF4',
        tan: '#F7F1E3',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
