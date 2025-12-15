/**
 * Configuração da API
 */

export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
	// Autenticação
	AUTH_LOGIN: '/api/auth/login',
	AUTH_REGISTER_CLIENTE: '/api/auth/register',
	AUTH_REGISTER_ESTABELECIMENTO: '/api/auth/register/estabelecimento',

	// Usuário logado
	USUARIO_ME: '/api/usuarios/me',

	// Estabelecimentos
	ESTABELECIMENTOS: '/api/estabelecimentos',
	ESTABELECIMENTO_BY_ID: (id: number | string) =>
		`/api/estabelecimentos/${id}`,
	ESTABELECIMENTO_SERVICOS: (id: number | string) =>
		`/api/estabelecimentos/${id}/servicos`,
	ESTABELECIMENTO_PROFISSIONAIS: (id: number | string) =>
		`/api/estabelecimentos/${id}/profissionais`,
	ESTABELECIMENTO_CLIENTES: (id: number | string) =>
		`/api/estabelecimentos/${id}/clientes`,

	// Serviços
	SERVICOS: '/api/servicos',
	SERVICO_BY_ID: (id: string) => `/api/servicos/${id}`,

	// Profissionais
	PROFISSIONAIS: '/api/profissionais',
	PROFISSIONAL_BY_ID: (id: string) => `/api/profissionais/${id}`,

	// Clientes
	CLIENTES: '/api/clientes',
	CLIENTE: (id: string) => `/api/clientes/${id}`,

	// Agendamentos
	AGENDAMENTOS: '/api/agendamentos',
	AGENDAMENTO_BY_ID: (id: string) => `/api/agendamentos/${id}`,

	// Usuários
	USUARIO_BY_ID: (id: string) => `/api/usuarios/${id}`,
	USUARIOS: '/api/usuarios',
	CONFIGURACOES_ME: '/api/configuracoes/me',

	// Transações
	TRANSACOES: '/api/transacoes',

	// Métodos de Pagamento (cliente logado)
	METODOS_PAGAMENTO: '/api/usuarios/me/pagamentos',
	METODO_PAGAMENTO_BY_ID: (id: string) => `/api/usuarios/me/pagamentos/${id}`,

	// Avaliações
	AVALIACOES: '/api/avaliacoes',
	AVALIACOES_ME: '/api/usuarios/me/avaliacoes',

	// Preferências de Notificação
} as const;

/**
 * Opções de requisição API
 */
interface ApiRequestOptions extends RequestInit {
	token?: string;
}

/**
 * Helper para fazer requisições à API
 */
export async function apiRequest<T>(
	endpoint: string,
	options?: ApiRequestOptions
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;
	const { token, ...fetchOptions } = options || {};

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	// Adiciona headers adicionais
	if (fetchOptions?.headers) {
		const additionalHeaders = fetchOptions.headers as Record<
			string,
			string
		>;
		Object.assign(headers, additionalHeaders);
	}

	// Adiciona token de autenticação se fornecido
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(url, {
		...fetchOptions,
		headers,
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: response.statusText,
		}));
		throw new Error(error.message || `API Error: ${response.statusText}`);
	}

	return response.json();
}
