/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'glass-lg': '0 20px 64px rgba(0, 0, 0, 0.4)',
        'blue-glow': '0 8px 32px rgba(59, 130, 246, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'slide-in-up': 'slideInUp 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideInUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        pulseGlow: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.8' } },
      },
    },
  },
  plugins: [],
};
