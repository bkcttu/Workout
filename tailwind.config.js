/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-glow': 'var(--bg-glow)',
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        raised: 'var(--surface-raised)',
        border: 'var(--hairline)',
        hairline: 'var(--hairline)',
        text: 'var(--text)',
        ink: 'var(--text)',
        muted: 'var(--text-2)',
        ink2: 'var(--text-2)',
        dim: 'var(--text-dim)',
        accent: 'var(--accent)',
        'accent-bright': 'var(--accent-hot)',
        hot: 'var(--accent-hot)',
        brass: 'var(--brass)',
        care: 'var(--care)',
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        ctl: '12px',
      },
      boxShadow: {
        lift: '0 6px 20px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04)',
        ring: '0 4px 16px rgba(0,0,0,.3)',
      },
    },
  },
  plugins: [],
}
