/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102A43",
        navy: "#143D59",
        teal: "#0E8A8A",
        cyan: "#37B7C3",
        green: "#62B47A",
        amber: "#F2B84B",
        coral: "#E7665A",
        paper: "#FFFEFA",
        mint: "#DDF7EF",
        pale: "#EEF6F4",
        line: "#C8D8D4",
        slate: "#577185",
      },
      boxShadow: {
        voithos: "0 18px 45px rgba(20, 61, 89, 0.1)",
      },
      fontFamily: {
        sans: ["Avenir", "Aptos", "Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
