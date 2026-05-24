/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        'blue-deep':  '#0B3D91',
        'blue-main':  '#1565C0',
        'blue-mid':   '#1E88E5',
        'blue-light': '#42A5F5',
        'blue-pale':  '#E3F2FD',
        'blue-ultra': '#EFF6FF',
      },
      borderRadius: {
        'xl2': '18px',
        'xl3': '28px',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatBubble: {
          '0%':   { transform: 'translateY(110vh) scale(0.8)', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '1' },
          '100%': { transform: 'translateY(-20vh) scale(1.2)', opacity: '0' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '25%':     { transform: 'translateX(-8px)' },
          '75%':     { transform: 'translateX(8px)' },
        },
        toastFadeOut: {
          'to': { opacity: '0', transform: 'translateY(-10px)' },
        },
        bounceScale: {
          '0%,100%': { transform: 'scale(1)' },
          '50%':     { transform: 'scale(1.25)' },
        },
      },
      animation: {
        'fade-in-up':  'fadeInUp 0.4s ease',
        'scale-in':    'scaleIn 0.3s ease',
        'slide-up':    'slideUp 0.3s ease',
        'float':       'floatBubble linear infinite',
        'shake':       'shake 0.4s ease',
        'toast-out':   'toastFadeOut 0.3s ease 2.7s forwards',
        'bounce-scale':'bounceScale 0.3s ease',
      },
      boxShadow: {
        'blue-sm': '0 2px 8px rgba(21,101,192,0.08)',
        'blue-md': '0 4px 20px rgba(21,101,192,0.14)',
        'blue-lg': '0 8px 40px rgba(21,101,192,0.18)',
        'blue-xl': '0 24px 80px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
}
