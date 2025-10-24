/**
 * Tipos relacionados à autenticação
 */

/**
 * Tipo de usuário no sistema
 */
export type UserType = 'cliente' | 'estabelecimento';

/**
 * Representa um usuário cliente autenticado
 */
export interface Cliente {
	id: string;
	nome: string;
	email: string;
	telefone?: string;
	cpf?: string;
	data_nascimento?: string;
	tipo: 'cliente';
}

/**
 * Representa um estabelecimento autenticado
 */
export interface Estabelecimento {
	id: number;
	nome: string;
	email: string;
	telefone?: string;
	endereco?: string;
	imagem?: string;
	avaliacao?: number;
	total_avaliacoes?: number;
	horario_funcionamento?: string;
	tipo: 'estabelecimento';
}

/**
 * União de tipos de usuário
 */
export type User = Cliente | Estabelecimento;

/**
 * Estado de autenticação
 */
export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
	userType: UserType | null;
}

/**
 * Credenciais de login
 */
export interface LoginCredentials {
	email: string;
	senha: string;
}

/**
 * Dados para registro de cliente
 */
export interface RegisterClienteData {
	nome: string;
	email: string;
	senha: string;
	telefone?: string;
	cpf?: string;
	data_nascimento?: string;
}

/**
 * Dados para registro de estabelecimento
 */
export interface RegisterEstabelecimentoData {
	nome: string;
	email: string;
	senha: string;
	telefone?: string;
	endereco?: string;
}

/**
 * Resposta de autenticação da API
 */
export interface AuthResponse {
	token: string;
	user: User;
}

/**
 * Erro de autenticação
 */
export interface AuthError {
	message: string;
	field?: string;
}
