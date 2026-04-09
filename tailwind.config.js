/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        oasis: {
          cream:     '#F5F0E8',
          sand:      '#E8DFD0',
          bone:      '#D9CDB8',
          warm:      '#C4B49A',
          taupe:     '#A89880',
          bronze:    '#8B7355',
          dark:      '#2A2420',
          darker:    '#1A1614',
        },
        neon: {
          cyan:    '#00F0FF',
          magenta: '#FF0066',
          violet:  '#9D00FF',
          green:   '#00FF88',
          amber:   '#FFBB33',
          orange:  '#FF6600',
          holo1:   '#FF61D8',
          holo2:   '#61FFD8',
          holo3:   '#D861FF',
        },
        holo: {
          pink:    'rgba(255, 97, 216, 0.15)',
          mint:    'rgba(97, 255, 216, 0.15)',
          lilac:   'rgba(216, 97, 255, 0.15)',
        },
      },
      fontFamily: {
        orbitron:  ['Orbitron', 'monospace'],
        sharetm:   ['Share Tech Mono', 'monospace'],
        rajdhani:  ['Rajdhani', 'sans-serif'],
        mono:      ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow':    'pulse-glow 2s ease-in-out infinite',
        'flicker':       'flicker 3s ease-in-out infinite',
        'scanline':      'scanline 8s linear infinite',
        'glitch':        'glitch 0.1s infinite',
        'float':         'float 3s ease-in-out infinite',
        'border-pulse':  'border-pulse 2s infinite',
        'holo-shift':    'holo-shift 6s ease-in-out infinite',
        'fade-in-up':    'fade-in-up 0.5s ease-out forwards',
        'slide-in':      'slide-in 0.4s ease-out forwards',
        'corruption':    'corruption-bar 1s linear infinite',
        'boot-line':     'fade-in-up 0.3s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { textShadow: '0 0 10px currentColor, 0 0 20px currentColor' },
          '50%': { textShadow: '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '33%': { opacity: '0.95' },
          '50%': { opacity: '0.8' },
          '66%': { opacity: '0.85' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        'border-pulse': {
          '0%, 100%': { borderColor: 'rgba(0, 240, 255, 0.3)' },
          '50%': { borderColor: 'rgba(0, 240, 255, 0.8)' },
        },
        'holo-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'corruption-bar': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      backgroundImage: {
        'holo-gradient': 'linear-gradient(135deg, rgba(255,97,216,0.1), rgba(97,255,216,0.1), rgba(216,97,255,0.1))',
        'cream-gradient': 'linear-gradient(180deg, #F5F0E8 0%, #E8DFD0 50%, #D9CDB8 100%)',
      },
    },
  },
  plugins: [],
};
