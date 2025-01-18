/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{svelte,js,ts,jsx,tsx}",
    ],
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1600px",
        },
      },
      extend: {
        fontFamily: {
          geist: ["Geist"],
          "gesit-mono": ["Geist Mono"],
        },
        backgroundImage: {
          "hero-gradient":
            "radial-gradient(ellipse 50% 80% at 20% 40%,rgba(93,52,221,0.1),transparent), radial-gradient(ellipse 50% 80% at 80% 50%,rgba(120,119,198,0.15),transparent)",
          "hero-glow":
            "conic-gradient(from 230.29deg at 51.63% 52.16%, #6836c9 0deg, #a770e2 67.5deg, #e6a9fa 198.75deg, #6836c9 251.25deg, #eed4f4 301.88deg, #ff99d7 360deg)",
        },
        colors: {
          background: {
            "100": "hsl(var(--ds-background-100))",
            "200": "hsl(var(--ds-background-200))",
            DEFAULT: "hsl(var(--background))",
          },
          foreground: "hsl(var(--foreground))",
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          chart: {
            "1": "hsl(var(--chart-1))",
            "2": "hsl(var(--chart-2))",
            "3": "hsl(var(--chart-3))",
            "4": "hsl(var(--chart-4))",
            "5": "hsl(var(--chart-5))",
          },
          sidebar: {
            DEFAULT: "hsl(var(--ds-background-200))",
            foreground: "hsl(var(--sidebar-foreground))",
            primary: "hsl(var(--sidebar-primary))",
            "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
            accent: "hsl(var(--sidebar-accent))",
            "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
            border: "hsl(var(--sidebar-border))",
            ring: "hsl(var(--sidebar-ring))",
          },
          contrast: "hsl(var(--ds-contrast-fg))",
          success: {
            DEFAULT: "var(--geist-success)",
            lighter: "var(--geist-success-lighter)",
            light: "var(--geist-success-light)",
            dark: "var(--geist-success-dark)",
          },
          accents: {
            "1": "var(--accents-1)",
            "2": "var(--accents-2)",
            "3": "var(--accents-3)",
            "4": "var(--accents-4)",
            "5": "var(--accents-5)",
            "6": "var(--accents-6)",
            "7": "var(--accents-7)",
            "8": "var(--accents-8)",
          },
          gray: {
            "100": "hsl(var(--ds-gray-100))",
            "200": "hsl(var(--ds-gray-200))",
            "300": "hsl(var(--ds-gray-300))",
            "400": "hsl(var(--ds-gray-400))",
            "500": "hsl(var(--ds-gray-500))",
            "600": "hsl(var(--ds-gray-600))",
            "700": "hsl(var(--ds-gray-700))",
            "800": "hsl(var(--ds-gray-800))",
            "900": "hsl(var(--ds-gray-900))",
            "1000": "hsl(var(--ds-gray-1000))",
          },
          "gray-alpha": {
            "100": "var(--ds-gray-alpha-100)",
            "200": "var(--ds-gray-alpha-200)",
            "300": "var(--ds-gray-alpha-300)",
            "400": "var(--ds-gray-alpha-400)",
            "500": "var(--ds-gray-alpha-500)",
            "600": "var(--ds-gray-alpha-600)",
            "700": "var(--ds-gray-alpha-700)",
            "800": "var(--ds-gray-alpha-800)",
            "900": "var(--ds-gray-alpha-900)",
            "1000": "var(--ds-gray-alpha-1000)",
          },
          blue: {
            "100": "hsl(var(--ds-blue-100))",
            "200": "hsl(var(--ds-blue-200))",
            "300": "hsl(var(--ds-blue-300))",
            "400": "hsl(var(--ds-blue-400))",
            "500": "hsl(var(--ds-blue-500))",
            "600": "hsl(var(--ds-blue-600))",
            "700": "hsl(var(--ds-blue-700))",
            "800": "hsl(var(--ds-blue-800))",
            "900": "hsl(var(--ds-blue-900))",
            "1000": "hsl(var(--ds-blue-1000))",
          },
          red: {
            "100": "hsl(var(--ds-red-100))",
            "200": "hsl(var(--ds-red-200))",
            "300": "hsl(var(--ds-red-300))",
            "400": "hsl(var(--ds-red-400))",
            "500": "hsl(var(--ds-red-500))",
            "600": "hsl(var(--ds-red-600))",
            "700": "hsl(var(--ds-red-700))",
            "800": "hsl(var(--ds-red-800))",
            "900": "hsl(var(--ds-red-900))",
            "1000": "hsl(var(--ds-red-1000))",
          },
          amber: {
            "100": "hsl(var(--ds-amber-100))",
            "200": "hsl(var(--ds-amber-200))",
            "300": "hsl(var(--ds-amber-300))",
            "400": "hsl(var(--ds-amber-400))",
            "500": "hsl(var(--ds-amber-500))",
            "600": "hsl(var(--ds-amber-600))",
            "700": "hsl(var(--ds-amber-700))",
            "800": "hsl(var(--ds-amber-800))",
            "900": "hsl(var(--ds-amber-900))",
            "1000": "hsl(var(--ds-amber-1000))",
          },
          green: {
            "100": "hsl(var(--ds-green-100))",
            "200": "hsl(var(--ds-green-200))",
            "300": "hsl(var(--ds-green-300))",
            "400": "hsl(var(--ds-green-400))",
            "500": "hsl(var(--ds-green-500))",
            "600": "hsl(var(--ds-green-600))",
            "700": "hsl(var(--ds-green-700))",
            "800": "hsl(var(--ds-green-800))",
            "900": "hsl(var(--ds-green-900))",
            "1000": "hsl(var(--ds-green-1000))",
          },
          teal: {
            "100": "hsl(var(--ds-teal-100))",
            "200": "hsl(var(--ds-teal-200))",
            "300": "hsl(var(--ds-teal-300))",
            "400": "hsl(var(--ds-teal-400))",
            "500": "hsl(var(--ds-teal-500))",
            "600": "hsl(var(--ds-teal-600))",
            "700": "hsl(var(--ds-teal-700))",
            "800": "hsl(var(--ds-teal-800))",
            "900": "hsl(var(--ds-teal-900))",
            "1000": "hsl(var(--ds-teal-1000))",
          },
          purple: {
            "100": "hsl(var(--ds-purple-100))",
            "200": "hsl(var(--ds-purple-200))",
            "300": "hsl(var(--ds-purple-300))",
            "400": "hsl(var(--ds-purple-400))",
            "500": "hsl(var(--ds-purple-500))",
            "600": "hsl(var(--ds-purple-600))",
            "700": "hsl(var(--ds-purple-700))",
            "800": "hsl(var(--ds-purple-800))",
            "900": "hsl(var(--ds-purple-900))",
            "1000": "hsl(var(--ds-purple-1000))",
          },
          pink: {
            "100": "hsl(var(--ds-pink-100))",
            "200": "hsl(var(--ds-pink-200))",
            "300": "hsl(var(--ds-pink-300))",
            "400": "hsl(var(--ds-pink-400))",
            "500": "hsl(var(--ds-pink-500))",
            "600": "hsl(var(--ds-pink-600))",
            "700": "hsl(var(--ds-pink-700))",
            "800": "hsl(var(--ds-pink-800))",
            "900": "hsl(var(--ds-pink-900))",
            "1000": "hsl(var(--ds-pink-1000))",
          },
          "color-1": "hsl(var(--color-1))",
          "color-2": "hsl(var(--color-2))",
          "color-3": "hsl(var(--color-3))",
          "color-4": "hsl(var(--color-4))",
          "color-5": "hsl(var(--color-5))",
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        boxShadow: {
          inner: "var(--ds-shadow-inset)",
          border: "var(--ds-shadow-border)",
          small: "var(--ds-shadow-small)",
          ["border-small"]: "var(--ds-shadow-border-small)",
          ["input-ring"]: "var(--ds-shadow-input-ring)",
          medium: "var(--ds-shadow-medium)",
          large: "var(--ds-shadow-large)",
          ["border-large"]: "var(--ds-shadow-border-large)",
          tooltip: "var(--ds-shadow-tooltip)",
          menu: "var(--ds-shadow-menu)",
          modal: "var(--ds-shadow-modal)",
          fullscreen: "var(--ds-shadow-fullscreen)",
        },
        animation: {
          gradient: "gradient 8s linear infinite",
          "fade-in": "fade-in 1000ms var(--animation-delay, 0ms) ease forwards",
          "fade-up": "fade-up 0.5s var(--animation-delay, 0ms) ease forwards",
          "shiny-text": "shiny-text 8s infinite",
          "image-glow": "image-glow 4100ms 600ms ease-out forwards",
          rainbow: "rainbow var(--speed, 2s) infinite linear",
          marquee: "marquee var(--duration) infinite linear",
          "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
          shine: "shine var(--duration) infinite linear",
          orbit: "orbit calc(var(--duration)*1s) linear infinite",
        },
        keyframes: {
          gradient: {
            to: {
              backgroundPosition: "var(--bg-size) 0",
            },
          },
          "shiny-text": {
            "0%, 90%, 100%": {
              "background-position": "calc(-100% - var(--shiny-width)) 0",
            },
            "30%, 60%": {
              "background-position": "calc(100% + var(--shiny-width)) 0",
            },
          },
          "image-glow": {
            "0%": {
              opacity: "0",
              "animation-timing-function": "cubic-bezier(0.74,0.25,0.76,1)",
            },
            "10%": {
              opacity: "1",
              "animation-timing-function": "cubic-bezier(0.12,0.01,0.08,0.99)",
            },
            "100%": {
              opacity: "0.2",
            },
          },
          "fade-up": {
            "0%": {
              opacity: "0",
              transform: "translateY(10px)",
            },
            "80%": {
              opacity: "0.6",
            },
            "100%": {
              opacity: "1",
              transform: "translateY(0px)",
            },
          },
          marquee: {
            from: {
              transform: "translateX(0)",
            },
            to: {
              transform: "translateX(calc(-100% - var(--gap)))",
            },
          },
          "marquee-vertical": {
            from: {
              transform: "translateY(0)",
            },
            to: {
              transform: "translateY(calc(-100% - var(--gap)))",
            },
          },
          shine: {
            "0%": {
              "background-position": "0% 0%",
            },
            "50%": {
              "background-position": "100% 100%",
            },
            to: {
              "background-position": "0% 0%",
            },
          },
          "fade-in": {
            from: {
              opacity: "0",
              transform: "translateY(-10px)",
            },
            to: {
              opacity: "1",
              transform: "none",
            },
          },
          rainbow: {
            "0%": {
              "background-position": "0%",
            },
            "100%": {
              "background-position": "200%",
            },
          },
          orbit: {
            "0%": {
              transform:
                "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
            },
            "100%": {
              transform:
                "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
            },
          },
        },
      },
    },
    plugins: [
      require("tailwindcss-animate"),
    ],
}

