/**
 * Configuração da API
 */

export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
	// Autenticação
	AUTH_LOGIN: '/api/auth/login',
	AUTH_REGISTER: '/api/auth/register',

	// Estabelecimentos
	ESTABELECIMENTOS: '/api/estabelecimentos',
	ESTABELECIMENTO_BY_ID: (id: number) => `/api/estabelecimentos/${id}`,
	ESTABELECIMENTO_SERVICOS: (id: number) =>
		`/api/estabelecimentos/${id}/servicos`,
	ESTABELECIMENTO_PROFISSIONAIS: (id: number) =>
		`/api/estabelecimentos/${id}/profissionais`,

	// Agendamentos
	AGENDAMENTOS: '/api/agendamentos',
	AGENDAMENTO_BY_ID: (id: string) => `/api/agendamentos/${id}`,

	// Usuários
	USUARIO_BY_ID: (id: string) => `/api/usuarios/${id}`,
	USUARIOS: '/api/usuarios',

	// Transações
	TRANSACOES: '/api/transacoes',

	// Métodos de Pagamento
	METODOS_PAGAMENTO: '/api/metodos-pagamento',
	METODO_PAGAMENTO_BY_ID: (id: string) => `/api/metodos-pagamento/${id}`,

	// Avaliações
	AVALIACOES: '/api/avaliacoes',

	// Preferências de Notificação
	PREFERENCIAS_NOTIFICACAO: (usuarioId: string) =>
		`/api/preferencias-notificacao/${usuarioId}`,
} as const;

/**
 * Helper para fazer requisições à API
 */
export async function apiRequest<T>(
	endpoint: string,
	options?: RequestInit
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;

	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			...options?.headers,
		},
		...options,
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.statusText}`);
	}

	return response.json();
}
