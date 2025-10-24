/**
 * Hook para gerenciar o estabelecimento logado
 */

import { useState, useEffect } from 'react';
import { getEstabelecimentoLogado } from '@/lib/services/estabelecimento.service';
import type { Estabelecimento } from '@/types';

interface UseEstabelecimentoLogadoReturn {
	estabelecimento: Estabelecimento | null;
	loading: boolean;
	error: string | null;
	recarregar: () => Promise<void>;
}

export function useEstabelecimentoLogado(): UseEstabelecimentoLogadoReturn {
	const [estabelecimento, setEstabelecimento] =
		useState<Estabelecimento | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const carregar = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getEstabelecimentoLogado();
			setEstabelecimento(data);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Erro ao carregar estabelecimento'
			);
			console.error('Erro ao carregar estabelecimento logado:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		carregar();
	}, []);

	return {
		estabelecimento,
		loading,
		error,
		recarregar: carregar,
	};
}
