/**
 * Hook para gerenciar dados do usuário
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type { DadosUsuario, PreferenciasNotificacao } from '@/types';

export function useUsuario() {
	const [dados, setDados] = useState<DadosUsuario | null>(null);
	const [preferenciasNotificacao, setPreferenciasNotificacao] =
		useState<PreferenciasNotificacao | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchDados = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// TODO: Pegar ID do usuário logado do contexto de autenticação
			const usuarioId = 'user-1';

			const [dadosUsuario, preferencias] = await Promise.all([
				apiRequest<DadosUsuario>(API_ENDPOINTS.USUARIO_BY_ID(usuarioId)),
				apiRequest<PreferenciasNotificacao>(
					API_ENDPOINTS.PREFERENCIAS_NOTIFICACAO(usuarioId)
				),
			]);

			setDados(dadosUsuario);
			setPreferenciasNotificacao(preferencias);
		} catch (err) {
			setError('Erro ao carregar dados do usuário');
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchDados();
	}, [fetchDados]);

	const atualizarDados = useCallback(async (novosDados: DadosUsuario) => {
		try {
			// TODO: Pegar ID do usuário logado do contexto de autenticação
			const usuarioId = 'user-1';

			const dadosAtualizados = await apiRequest<DadosUsuario>(
				API_ENDPOINTS.USUARIO_BY_ID(usuarioId),
				{
					method: 'PUT',
					body: JSON.stringify(novosDados),
				}
			);
			setDados(dadosAtualizados);
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}, []);

	const atualizarPreferencias = useCallback(
		async (novasPreferencias: PreferenciasNotificacao) => {
			try {
				// TODO: Pegar ID do usuário logado do contexto de autenticação
				const usuarioId = 'user-1';

				const preferenciasAtualizadas =
					await apiRequest<PreferenciasNotificacao>(
						API_ENDPOINTS.PREFERENCIAS_NOTIFICACAO(usuarioId),
						{
							method: 'PUT',
							body: JSON.stringify(novasPreferencias),
						}
					);
				setPreferenciasNotificacao(preferenciasAtualizadas);
				return true;
			} catch (err) {
				console.error(err);
				return false;
			}
		},
		[]
	);

	return {
		dados,
		preferenciasNotificacao,
		loading,
		error,
		atualizarDados,
		atualizarPreferencias,
		refetch: fetchDados,
	};
}
