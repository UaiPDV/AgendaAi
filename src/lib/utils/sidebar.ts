import { STORAGE_KEYS, SIDEBAR_COLLAPSED_CLASS } from '@/constants';

/**
 * Utilitários para gerenciamento da sidebar
 */

/**
 * Obtém o estado colapsado da sidebar do localStorage
 */
export function getSidebarCollapsed(): boolean {
	if (typeof window === 'undefined') return false;

	try {
		const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
		return saved === 'true';
	} catch {
		return false;
	}
}

/**
 * Salva o estado colapsado da sidebar no localStorage
 */
export function saveSidebarCollapsed(collapsed: boolean): void {
	try {
		localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(collapsed));
	} catch {
		// Silenciosamente falha se localStorage não estiver disponível
	}
}

/**
 * Aplica a classe de sidebar colapsada ao documento
 */
export function applySidebarCollapsed(collapsed: boolean): void {
	if (typeof document === 'undefined') return;

	if (collapsed) {
		document.documentElement.classList.add(SIDEBAR_COLLAPSED_CLASS);
	} else {
		document.documentElement.classList.remove(SIDEBAR_COLLAPSED_CLASS);
	}
}
