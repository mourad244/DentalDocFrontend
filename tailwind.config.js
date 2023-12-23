/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-blue": "#455a94",
        "grey-c0": "#c0c0c0",
        "grey-ea": "#eaeaea",
        "blue-40": "#406aa1",
      },
      boxShadow: {
        xs: "0 0 0 1px rgba(0, 0, 0, 0.05)",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        default:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        inner: "inset 0 4px 4px rgba(0, 0, 0, 0.25)",
        outline: "0 0 0 3px rgba(66, 153, 225, 0.5)",
        focus: "0 0 0 3px rgba(66, 153, 225, 0.5)",
        none: "none",
        custom: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        component: "6px 13px 9px rgb(0 0 0 / 25%)",
        dayFull: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
        daySelected: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      },
      backgroundImage: {
        "gradient-radial":
          "linear-gradient(180deg, #6b33a0 0%, rgb(69 90 148) 100%)",
      },
      borderRadius: {
        custom: "10px",
        "5px": "5px",
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["responsive", "hover", "focus"],
    },
  },
  plugins: [],
};
