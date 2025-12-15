/**
 * Hook para gerenciar dados do usuário
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import { getAuthToken, getUserData } from '@/lib/utils/auth';
import type { DadosUsuario, PreferenciasNotificacao } from '@/types';

const normalizeDados = (dados: Partial<DadosUsuario> & { data_nascimento?: string }): DadosUsuario => ({
	id: dados.id,
	nome: dados.nome ?? '',
	cpf: dados.cpf ?? '',
	email: dados.email ?? '',
	telefone: dados.telefone ?? '',
	dataNascimento: dados.dataNascimento ?? dados.data_nascimento ?? '',
});

export function useUsuario() {
	const [dados, setDados] = useState<DadosUsuario | null>(null);
	const [preferenciasNotificacao, setPreferenciasNotificacao] =
		useState<PreferenciasNotificacao | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchDados = useCallback(async () => {
		const token = getAuthToken();
		const user = getUserData();

		if (!token || !user?.id) {
			setError('Usuário não autenticado');
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const dadosUsuario = await apiRequest<DadosUsuario>(
				API_ENDPOINTS.USUARIO_ME,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const preferencias: PreferenciasNotificacao = {
				lembretes: Boolean(
					(dadosUsuario as any).notif_lembretes ?? true
				),
				promocoes: Boolean(
					(dadosUsuario as any).notif_promocoes ?? true
				),
				confirmacoes: true,
			};

			setDados(normalizeDados(dadosUsuario));
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
		const token = getAuthToken();
		if (!token) return false;
		try {
			const dadosAtualizados = await apiRequest<DadosUsuario>(
				API_ENDPOINTS.USUARIO_ME,
				{
					method: 'PUT',
					body: JSON.stringify(novosDados),
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setDados(normalizeDados(dadosAtualizados));
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}, []);

	const atualizarPreferencias = useCallback(
		async (novasPreferencias: PreferenciasNotificacao) => {
			const token = getAuthToken();
			if (!token) return false;
			try {
				const atualizadas = await apiRequest<DadosUsuario>(
					API_ENDPOINTS.USUARIO_ME,
					{
						method: 'PUT',
						body: JSON.stringify({
							notif_lembretes: novasPreferencias.lembretes,
							notif_promocoes: novasPreferencias.promocoes,
						}),
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				setPreferenciasNotificacao({
					lembretes: Boolean(
						(atualizadas as any).notif_lembretes ?? true
					),
					promocoes: Boolean(
						(atualizadas as any).notif_promocoes ?? true
					),
					confirmacoes: true,
				});
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
