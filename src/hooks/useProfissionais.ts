/**
 * Hook para gerenciamento de profissionais
 */

import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type {
	ProfissionalDetalhado,
	NovoProfissionalForm,
} from '@/types/estabelecimento';

interface UseProfissionaisReturn {
	profissionais: ProfissionalDetalhado[];
	loading: boolean;
	error: string | null;
	criarProfissional: (data: NovoProfissionalForm) => Promise<void>;
	atualizarProfissional: (
		id: string,
		data: Partial<NovoProfissionalForm>
	) => Promise<void>;
	excluirProfissional: (id: string) => Promise<void>;
	recarregar: () => Promise<void>;
}

export function useProfissionais(
	estabelecimentoId?: number
): UseProfissionaisReturn {
	const [profissionais, setProfissionais] = useState<ProfissionalDetalhado[]>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const carregar = useCallback(async () => {
		if (!estabelecimentoId) {
			setProfissionais([]);
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const data = await apiRequest<ProfissionalDetalhado[]>(
				API_ENDPOINTS.ESTABELECIMENTO_PROFISSIONAIS(estabelecimentoId)
			);
			setProfissionais(data);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Erro ao carregar profissionais'
			);
			console.error('Erro ao carregar profissionais:', err);
		} finally {
			setLoading(false);
		}
	}, [estabelecimentoId]);

	useEffect(() => {
		carregar();
	}, [carregar]);

	const criarProfissional = async (data: NovoProfissionalForm) => {
		try {
			await apiRequest('/api/profissionais', {
				method: 'POST',
				body: JSON.stringify({
					...data,
					estabelecimentoId,
				}),
			});
			await carregar();
		} catch (err) {
			throw new Error(
				err instanceof Error
					? err.message
					: 'Erro ao criar profissional'
			);
		}
	};

	const atualizarProfissional = async (
		id: string,
		data: Partial<NovoProfissionalForm>
	) => {
		try {
			await apiRequest(`/api/profissionais/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			});
			await carregar();
		} catch (err) {
			throw new Error(
				err instanceof Error
					? err.message
					: 'Erro ao atualizar profissional'
			);
		}
	};

	const excluirProfissional = async (id: string) => {
		try {
			await apiRequest(`/api/profissionais/${id}`, {
				method: 'DELETE',
			});
			await carregar();
		} catch (err) {
			throw new Error(
				err instanceof Error
					? err.message
					: 'Erro ao excluir profissional'
			);
		}
	};

	return {
		profissionais,
		loading,
		error,
		criarProfissional,
		atualizarProfissional,
		excluirProfissional,
		recarregar: carregar,
	};
}
