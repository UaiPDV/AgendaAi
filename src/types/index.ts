/**
 * Exportação central de todos os tipos da aplicação
 */
export * from './theme';
export * from './components';
export * from './navigation';
export * from './config';

// Auth types
export type {
	UserType,
	LoginCredentials,
	RegisterClienteData,
	RegisterEstabelecimentoData,
	AuthResponse,
	AuthError,
	User,
	AuthState,
} from './auth';

// Re-exporta Cliente e Estabelecimento de auth com alias para evitar conflito
export type {
	Cliente as ClienteAuth,
	Estabelecimento as EstabelecimentoAuth,
} from './auth';

// Cliente types (área do cliente)
export * from './cliente';

// Estabelecimento types (área do estabelecimento)
export * from './estabelecimento';
