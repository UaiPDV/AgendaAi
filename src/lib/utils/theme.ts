import { Theme } from '@/types';
import { STORAGE_KEYS } from '@/constants';

/**
 * Utilitários para gerenciamento do tema
 */

/**
 * Obtém o tema salvo no localStorage
 */
export function getSavedTheme(): Theme | null {
	if (typeof window === 'undefined') return null;

	try {
		const saved = localStorage.getItem(STORAGE_KEYS.THEME);
		return saved as Theme | null;
	} catch {
		return null;
	}
}

/**
 * Salva o tema no localStorage
 */
export function saveTheme(theme: Theme): void {
	try {
		localStorage.setItem(STORAGE_KEYS.THEME, theme);
	} catch {
		// Silenciosamente falha se localStorage não estiver disponível
	}
}

/**
 * Verifica se o usuário prefere o tema escuro baseado na configuração do sistema
 */
export function getSystemThemePreference(): Theme {
	if (typeof window === 'undefined') return 'light';

	try {
		const prefersDark =
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches;
		return prefersDark ? 'dark' : 'light';
	} catch {
		return 'light';
	}
}

/**
 * Obtém o tema inicial (salvo ou preferência do sistema)
 */
export function getInitialTheme(): Theme {
	const saved = getSavedTheme();
	if (saved) return saved;

	return getSystemThemePreference();
}

/**
 * Aplica o tema ao documento
 */
export function applyTheme(theme: Theme): void {
	if (typeof document === 'undefined') return;

	document.documentElement.setAttribute('data-theme', theme);

	if (theme === 'dark') {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
}
