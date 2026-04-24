/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 全部走 CSS 变量（在 src/index.css 的 :root 和 html.dark 下定义）
        body: "var(--bg-body)",
        card: "var(--card-bg)",
        navbar: "var(--navbar-bg)",
        hover: "var(--hover-bg)",
        line: "var(--border-color)",
        accent: "var(--primary-color)",
        fg: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          quaternary: "var(--text-quaternary)",
        },
        tl: {
          bg: "var(--timeline-body-bg)",
          border: "var(--timeline-body-border)",
          line: "var(--timeline-line)",
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Consolas', '"SF Mono"', 'Menlo', 'monospace'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [],
}
