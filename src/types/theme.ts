/**
 * Tipos relacionados ao tema da aplicação
 */
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}
