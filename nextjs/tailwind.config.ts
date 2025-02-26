import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/theme';

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(button|input|pagination|select|spinner|table|ripple|form|listbox|divider|popover|scroll-shadow|checkbox|spacer).js"
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        lightgrey: '#373245',
        lightgrey2: '#19191B',
        lightgrey3: '#27262B',
      },
    },
  },
  plugins: [heroui()],
} satisfies Config;
