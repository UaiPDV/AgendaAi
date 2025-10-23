/**
 * Utilitários para autenticação
 */

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean} true se o usuário possui um token válido
 */
export function isAuthenticated(): boolean {
	if (typeof window === 'undefined') {
		return false;
	}

	const token = localStorage.getItem('token');
	return !!token;
}

/**
 * Salva o token de autenticação
 * @param {string} token - Token de autenticação
 */
export function saveAuthToken(token: string): void {
	if (typeof window === 'undefined') {
		return;
	}

	localStorage.setItem('token', token);
}

/**
 * Remove o token de autenticação (logout)
 */
export function removeAuthToken(): void {
	if (typeof window === 'undefined') {
		return;
	}

	localStorage.removeItem('token');
}

/**
 * Obtém o token de autenticação
 * @returns {string | null} Token de autenticação ou null se não existir
 */
export function getAuthToken(): string | null {
	if (typeof window === 'undefined') {
		return null;
	}

	return localStorage.getItem('token');
}
