/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#0F5237',     // Verde escuro principal (Botões/Destaques)
          primary: '#168054',  // Verde esmeralda padrão
          light: '#EAF8F2',    // Fundo sutil de sucesso
        },
        neutral: {
          darkest: '#0F172A',  // Texto principal / Títulos
          dark: '#334155',     // Subtítulos e labels
          medium: '#94A3B8',   // Placeholders e ícones secundários
          light: '#E2E8F0',    // Bordas de inputs padrão
          bg: '#F8FAFC',       // Fundo geral da aplicação
        },
        feedback: {
          error: '#EF4444',    // Vermelho de Saída/Erro
          errorLight: '#FEE2E2',
          success: '#22C55E',  // Verde de Entrada
          successLight: '#DCFCE7',
        },
        // Mapeamento de cores para as Tags de Categorias do Figma
        tag: {
          blue: { text: '#2563EB', bg: '#EFF6FF' },
          purple: { text: '#7C3AED', bg: '#F5F3FF' },
          pink: { text: '#DB2777', bg: '#FDF2F8' },
          orange: { text: '#EA580C', bg: '#FFF7ED' },
          yellow: { text: '#CA8A04', bg: '#FEF9C3' },
        }
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
}