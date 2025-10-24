/**
 * Serviço de Configurações do Estabelecimento
 * Gerencia as configurações de funcionamento (horários, feriados, bloqueios, etc.)
 */

import { apiRequest } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';
import type {
	ConfiguracaoEstabelecimento,
	NovaConfiguracaoForm,
} from '@/types/config';

/**
 * Busca as configurações do estabelecimento logado
 */
export const getConfiguracao =
	async (): Promise<ConfiguracaoEstabelecimento> => {
		const token = getAuthToken();
		return apiRequest<ConfiguracaoEstabelecimento>(
			'/api/configuracoes/me',
			{
				token: token || undefined,
			}
		);
	};

/**
 * Atualiza as configurações do estabelecimento logado
 */
export const updateConfiguracao = async (
	configuracao: Partial<NovaConfiguracaoForm>
): Promise<ConfiguracaoEstabelecimento> => {
	const token = getAuthToken();
	return apiRequest<ConfiguracaoEstabelecimento>('/api/configuracoes/me', {
		method: 'PUT',
		body: JSON.stringify(configuracao),
		token: token || undefined,
	});
};
