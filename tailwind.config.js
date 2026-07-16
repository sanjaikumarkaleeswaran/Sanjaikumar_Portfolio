/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#030014",
          card: "rgba(10, 10, 25, 0.5)",
          border: "rgba(255, 255, 255, 0.06)",
          text: "#e2e8f0",
          cyan: "#00f0ff",
          magenta: "#ff007f",
          purple: "#9d4edd",
          green: "#39ff14",
          blue: "#0072ff",
          dark: "#05050f",
        }
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.5)',
        'neon-purple': '0 0 15px rgba(157, 78, 221, 0.5)',
        'neon-green': '0 0 15px rgba(57, 255, 20, 0.5)',
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: 0.8, filter: 'drop-shadow(0 0 2px rgba(0, 240, 255, 0.4))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
