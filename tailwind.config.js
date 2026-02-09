export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        christBlue: "#0B2C5D", // Navy Blue
        christGold: "#D4AF37", // Gold Accent
        christGray: "#F4F6F8", // Light Gray Background
        success: "#2E7D32",
        warning: "#ED6C02",
        error: "#D32F2F",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Playfair Display', 'serif'], // Optional for headings if needed, stick to Inter for now
      }
    },
  },
  plugins: [],
};
