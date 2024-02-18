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
        login: "0px 0px 9.3px 6px rgba(156, 197, 213, 0.63)",
        "login-button": "0px 2px 4px rgba(0, 0, 0, 0.70)",
        "login-button-selected": "0px 1px 5px rgba(0, 0, 0, 0.25) inset",
        "login-button-inselectd": "0px 1px 5px rgba(0, 0, 0, 0.25)",
      },
      backgroundImage: {
        "gradient-radial":
          "linear-gradient(180deg, #6b33a0 0%, rgb(69 90 148) 100%)",
        "login-background":
          "linear-gradient(180deg, #FAF9F2 0%, #F0ECE4 13%, #DEE1DC 26%, #CBD9D7 40%, #C0DFE2 67%, #B0D8E1 81%, #83BCCD 100%)",
        "authenfier-button":
          "linear-gradient(180deg, #74BED1 0%, #4E9BB5 100%)",
        "header-radial": `linear-gradient(
          to left, 
          #F1F7FC 0%, 
          #E5F1FA 5.93%, 
          #D5EAF8 13.71%, 
          #AFC9D3 20.42%, 
          #789299 27.44%, 
          #516B74 35.14%, 
          #566D78 42.02%, 
          #526C76 48.44%, 
          #526C75 55.51%, 
          #566E76 62.22%, 
          #58727B 69.91%, 
          #66828A 75.44%, 
          #8AA5B3 79.30%, 
          #9FBDCA 81.57%, 
          #CAE3F1 87.49%, 
          #E2F2FD 92.81%, 
          #F3F9FE 100%
        )`,
      },
      borderRadius: {
        custom: "10px",
        "5px": "5px",
        login: "51px",
      },
      scale: {
        600: "6",
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
