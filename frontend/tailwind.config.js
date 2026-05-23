/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "amazon-orange": "#FF9900",
        "amazon-orange-dark": "#E47911",
        "amazon-orange-hover": "#FFB703",
        "amazon-blue": "#131921",
        "amazon-blue-light": "#232F3E",
        "amazon-link": "#007185",
        "amazon-link-hover": "#C45500",
        "amazon-yellow": "#FFD814",
        "amazon-yellow-hover": "#F7CA00",
        "amazon-red": "#CC0C39",
        "amazon-star": "#FF9900",
        "amazon-success": "#007600",
        "amazon-gray": "#F3F3F3",
        "amazon-border": "#D5D9D9",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
}
