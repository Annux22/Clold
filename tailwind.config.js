/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "#050505", // Void Black
        foreground: "#FFB000", // Amber Gold Text
        sentinel: {
          gold: "#D4AF37",
          amber: "#FFB000",
          alert: "#990000",
          dim: "#4A3B00"
        }
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "scan-line": "scan 4s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
