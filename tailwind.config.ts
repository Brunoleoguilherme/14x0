import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        creme: '#f6ead2',
        vermelho: '#b8322a',
        verdeCampo: '#1e6f43',
        verdeEscuro: '#12492f',
        ouro: '#d8a928'
      }
    }
  },
  plugins: []
}
export default config

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vermelho: "#C62828",
        creme: "#F6E7C8",
        ouro: "#F6C343",
        verdeCampo: "#1F7A3A",
        verdeEscuro: "#083B1E",
      },
      boxShadow: {
        card: "0 14px 35px rgba(0,0,0,0.16)",
      },
    },
  },
  plugins: [],
};
