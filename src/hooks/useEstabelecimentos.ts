/**
 * Hook para gerenciar estabelecimentos
 */

import { useState, useEffect } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type { Estabelecimento } from '@/types';

export function useEstabelecimentos() {
	const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function fetchEstabelecimentos() {
			try {
				setLoading(true);
				setError(null);
				const data = await apiRequest<Estabelecimento[]>(
					API_ENDPOINTS.ESTABELECIMENTOS
				);
				if (isMounted) {
					setEstabelecimentos(data);
				}
			} catch (err) {
				if (isMounted) {
					setError('Erro ao carregar estabelecimentos');
					console.error(err);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		fetchEstabelecimentos();

		return () => {
			isMounted = false;
		};
	}, []);

	return { estabelecimentos, loading, error };
}

export function useEstabelecimento(id: number) {
	const [estabelecimento, setEstabelecimento] =
		useState<Estabelecimento | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function fetchEstabelecimento() {
			try {
				setLoading(true);
				setError(null);
				const data = await apiRequest<Estabelecimento>(
					API_ENDPOINTS.ESTABELECIMENTO_BY_ID(id)
				);
				if (isMounted) {
					setEstabelecimento(data);
				}
			} catch (err) {
				if (isMounted) {
					setError('Erro ao carregar estabelecimento');
					console.error(err);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		fetchEstabelecimento();

		return () => {
			isMounted = false;
		};
	}, [id]);

	return { estabelecimento, loading, error };
}
