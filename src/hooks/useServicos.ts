/**
 * Hook para gerenciamento de serviços
 */

import { useState, useEffect, useCallback } from 'react';
import {
	getServicosDoEstabelecimento,
	createServico,
	updateServico,
	deleteServico,
} from '@/lib/services/servico.service';
import { getUserData } from '@/lib/utils/auth';
import type { NovoServicoForm } from '@/types/estabelecimento';
import type { Servico } from '@/types';

interface UseServicosReturn {
	servicos: Servico[];
	loading: boolean;
	error: string | null;
	criarServico: (data: NovoServicoForm) => Promise<void>;
	atualizarServico: (
		id: string,
		data: Partial<NovoServicoForm>
	) => Promise<void>;
	excluirServico: (id: string) => Promise<void>;
	recarregar: () => Promise<void>;
}

export function useServicos(estabelecimentoId?: number): UseServicosReturn {
	const [servicos, setServicos] = useState<Servico[]>([]);
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
				setServicos([]);
				setLoading(false);
				return;
			}
		}

		try {
			setLoading(true);
			setError(null);
			const data = await getServicosDoEstabelecimento(estabId);
			setServicos(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Erro ao carregar serviços'
			);
			console.error('Erro ao carregar serviços:', err);
		} finally {
			setLoading(false);
		}
	}, [estabelecimentoId]);

	useEffect(() => {
		carregar();
	}, [carregar]);

	const criarServico = async (data: NovoServicoForm) => {
		try {
			await createServico({
				nome: data.nome,
				descricao: data.descricao,
				duracao: data.duracao,
				preco: data.preco,
				categoria: data.categoria,
			});
			await carregar();
		} catch (err) {
			throw new Error(
				err instanceof Error ? err.message : 'Erro ao criar serviço'
			);
		}
	};

	const atualizarServico = async (
		id: string,
		data: Partial<NovoServicoForm>
	) => {
		try {
			await updateServico(id, {
				nome: data.nome,
				descricao: data.descricao,
				duracao: data.duracao,
				preco: data.preco,
				categoria: data.categoria,
			});
			await carregar();
		} catch (err) {
			throw new Error(
				err instanceof Error ? err.message : 'Erro ao atualizar serviço'
			);
		}
	};

	const excluirServico = async (id: string) => {
		try {
			await deleteServico(id);
			await carregar();
		} catch (err) {
			throw new Error(
				err instanceof Error ? err.message : 'Erro ao excluir serviço'
			);
		}
	};

	return {
		servicos,
		loading,
		error,
		criarServico,
		atualizarServico,
		excluirServico,
		recarregar: carregar,
	};
}
