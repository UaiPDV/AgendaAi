/**
 * Hook para gerenciamento de profissionais
 */

import { useState, useEffect, useCallback } from 'react';
import {
	getProfissionaisDoEstabelecimento,
	createProfissional,
	updateProfissional,
	deleteProfissional,
} from '@/lib/services/profissional.service';
import { getUserData } from '@/lib/utils/auth';
import type { NovoProfissionalForm } from '@/types/estabelecimento';
import type { Profissional } from '@/types';

interface UseProfissionaisReturn {
	profissionais: Profissional[];
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
	const [profissionais, setProfissionais] = useState<Profissional[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const carregar = useCallback(async () => {
		// Se não tem estabelecimentoId, tenta obter do usuário logado
		let estabId = estabelecimentoId;
		if (!estabId) {
			const user = getUserData();
			if (user && user.tipo === 'estabelecimento') {
				estabId = user.id as number;
			} else {
				setProfissionais([]);
				setLoading(false);
				return;
			}
		}

		try {
			setLoading(true);
			setError(null);
			const data = await getProfissionaisDoEstabelecimento(estabId);
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
			await createProfissional({
				nome: data.nome,
				telefone: data.telefone,
				especialidades: data.especialidades,
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
			await updateProfissional(id, {
				nome: data.nome,
				telefone: data.telefone,
				especialidades: data.especialidades,
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
			await deleteProfissional(id);
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
