/**
 * Hook para gerenciar configurações do estabelecimento
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
	getConfiguracao,
	updateConfiguracao,
} from '@/lib/services/config.service';
import type {
	ConfiguracaoEstabelecimento,
	NovaConfiguracaoForm,
} from '@/types/config';

interface UseConfigReturn {
	config: ConfiguracaoEstabelecimento | null;
	loading: boolean;
	error: string | null;
	atualizarConfig: (
		dados: Partial<NovaConfiguracaoForm>
	) => Promise<ConfiguracaoEstabelecimento | null>;
	recarregar: () => Promise<void>;
}

export function useConfig(): UseConfigReturn {
	const [config, setConfig] = useState<ConfiguracaoEstabelecimento | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	const carregar = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getConfiguracao();
			setConfig(data);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Erro ao carregar configurações'
			);
			console.error('Erro ao carregar configurações:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	const atualizarConfig = useCallback(
		async (
			dados: Partial<NovaConfiguracaoForm>
		): Promise<ConfiguracaoEstabelecimento | null> => {
			try {
				setError(null);

				// Debounce: cancela a chamada anterior se houver
				if (debounceTimerRef.current) {
					clearTimeout(debounceTimerRef.current);
				}

				return new Promise((resolve, reject) => {
					debounceTimerRef.current = setTimeout(async () => {
						try {
							const updated = await updateConfiguracao(dados);
							setConfig(updated);
							resolve(updated);
						} catch (err) {
							const errorMessage =
								err instanceof Error
									? err.message
									: 'Erro ao atualizar configurações';
							setError(errorMessage);
							console.error(
								'Erro ao atualizar configurações:',
								err
							);
							reject(err);
						}
					}, 300); // 300ms de debounce
				});
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: 'Erro ao atualizar configurações'
				);
				console.error('Erro ao atualizar configurações:', err);
				return null;
			}
		},
		[]
	);

	useEffect(() => {
		carregar();

		// Cleanup: cancela debounce ao desmontar
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [carregar]);

	return {
		config,
		loading,
		error,
		atualizarConfig,
		recarregar: carregar,
	};
}
