/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f3ff",
          100: "#bfdeff",
          200: "#99c9ff",
          300: "#73b4ff",
          400: "#4d9fff",
          500: "#007BFF", // Base primary color
          600: "#0062cc",
          700: "#004a99",
          800: "#003166",
          900: "#001933",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        success: {
          100: "#d4edda",
          500: "#28a745",
          700: "#1e7e34",
        },
        warning: {
          100: "#fff3cd",
          500: "#ffc107",
          700: "#d39e00",
        },
        danger: {
          100: "#f8d7da",
          500: "#dc3545",
          700: "#bd2130",
        },
      },
      boxShadow: {
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
