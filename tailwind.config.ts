import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Oatly-inspired design system colors
      colors: {
        // Core brand colors - High contrast black/white
        brand: {
          black: '#000000',
          white: '#FFFFFF',
          cream: '#F5F1E8',
          beige: '#E8E4D9',
        },
        // Soft pastel accents (used sparingly)
        pastel: {
          pink: '#FFD6E8',
          blue: '#D6E8FF',
          yellow: '#FFF4D6',
          peach: '#FFE4D6',
          lavender: '#E8D6FF',
          mint: '#D6FFE8',
        },
        // Texture overlays
        texture: {
          'light-grid': '#F0F0F0',
          'dark-overlay': 'rgba(0, 0, 0, 0.05)',
          'vintage': '#2A2A2A',
        },
        // Keep umami colors for backwards compatibility
        umami: {
          50: '#fef7ee',
          100: '#fdeed6',
          200: '#fad9ad',
          300: '#f7c079',
          400: '#f39c43',
          500: '#f0801e',
          600: '#e16314',
          700: '#bb4a13',
          800: '#953a17',
          900: '#783115',
          950: '#411709',
        },
        // Status colors (adjusted for Oatly style)
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      // Oatly-inspired Typography
      fontFamily: {
        // Ultra-bold condensed headlines
        headline: ['Impact', 'Arial Black', 'sans-serif-black', 'sans-serif'],
        // Monospace body text (typewriter aesthetic)
        body: ['Courier New', 'Courier', 'monospace'],
        // Quirky handwritten for accents
        handwritten: ['Caveat', 'Comic Sans MS', 'cursive'],
        // Keep defaults for backwards compatibility
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      fontWeight: {
        hairline: '100',
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
        'ultra-black': '950',
      },
      // Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      // Border radius
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      // Box shadows - Oatly style (bold, strong shadows)
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        // Bold Oatly-style shadows
        'oatly-bold': '8px 8px 0px rgba(0, 0, 0, 1)',
        'oatly-card': '6px 6px 0px rgba(0, 0, 0, 1)',
        'oatly-button': '4px 4px 0px rgba(0, 0, 0, 1)',
      },
      // Border styles - sketch/hand-drawn feel
      borderWidth: {
        DEFAULT: '1px',
        '0': '0px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      // Grid
      gridTemplateColumns: {
        'auto-fit-minmax': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fill-minmax': 'repeat(auto-fill, minmax(250px, 1fr))',
      },
      // Aspect ratio
      aspectRatio: {
        'recipe-card': '4 / 3',
        'recipe-hero': '16 / 9',
        'square': '1 / 1',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
  // Dark mode
  darkMode: 'class',
};

export default config;