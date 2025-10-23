/**
 * Tipos relacionados à autenticação
 */

/**
 * Representa um usuário autenticado
 */
export interface User {
	id: string;
	email: string;
	name: string;
	// Adicione outros campos conforme necessário
}

/**
 * Estado de autenticação
 */
export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
}

/**
 * Credenciais de login
 */
export interface LoginCredentials {
	email: string;
	password: string;
}

/**
 * Resposta de autenticação
 */
export interface AuthResponse {
	token: string;
	user: User;
}
