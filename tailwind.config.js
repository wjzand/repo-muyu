/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cyber: {
          bg: "#0a0a0f",
          panel: "#12121a",
          border: "#1e1e2e",
          purple: "#a855f7",
          cyan: "#22d3ee",
          pink: "#ec4899",
          green: "#00ff88",
          red: "#ff3366",
          gold: "#ffd700",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        qingke: ["ZCOOL QingKe HuangYou", "sans-serif"],
        pixel: ["Press Start 2P", "monospace"],
      },
      boxShadow: {
        "neon-purple": "0 0 5px #a855f7, 0 0 10px #a855f7, 0 0 20px #a855f7, 0 0 40px #a855f7",
        "neon-cyan": "0 0 5px #22d3ee, 0 0 10px #22d3ee, 0 0 20px #22d3ee, 0 0 40px #22d3ee",
        "neon-pink": "0 0 5px #ec4899, 0 0 10px #ec4899, 0 0 20px #ec4899, 0 0 40px #ec4899",
        "neon-green": "0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 40px #00ff88",
        "neon-gold": "0 0 5px #ffd700, 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 40px #ffd700",
      },
      textShadow: {
        "neon-purple": "0 0 5px #a855f7, 0 0 10px #a855f7, 0 0 20px #a855f7",
        "neon-cyan": "0 0 5px #22d3ee, 0 0 10px #22d3ee, 0 0 20px #22d3ee",
        "neon-pink": "0 0 5px #ec4899, 0 0 10px #ec4899, 0 0 20px #ec4899",
        "neon-green": "0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 20px #00ff88",
        "neon-gold": "0 0 5px #ffd700, 0 0 10px #ffd700, 0 0 20px #ffd700",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        glitch: "glitch 0.5s ease-in-out",
        "scan-line": "scan-line 4s linear infinite",
        float: "float 6s ease-in-out infinite",
        "breath": "breath 3s ease-in-out infinite",
        "ripple": "ripple 0.6s ease-out forwards",
        "level-up": "level-up 2s ease-out forwards",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        breath: {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "level-up": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const textShadows = theme("textShadow", {});
      const utilities = Object.entries(textShadows).map(([key, value]) => ({
        [`.text-shadow-${key}`]: {
          textShadow: value,
        },
      }));
      addUtilities(utilities);
    },
  ],
};
