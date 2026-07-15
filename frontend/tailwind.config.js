/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sunny: { DEFAULT: "#FFD93D", dark: "#F5B700" },
        bubblegum: { DEFAULT: "#FF6B9D", dark: "#E8447A" },
        sky: { DEFAULT: "#4EA8DE", dark: "#2E86C1" },
        lime: { DEFAULT: "#B8E62D", dark: "#96C11F" },
        cream: "#FFFDF7",
        ink: "#16151A"
      },
      fontFamily: {
        display: ["Fredoka", "sans-serif"],
        body: ["Poppins", "sans-serif"]
      },
      boxShadow: {
        hard: "6px 6px 0px #16151A",
        "hard-sm": "3px 3px 0px #16151A",
        "hard-lg": "8px 8px 0px #16151A"
      }
    },
  },
  plugins: [],
}

