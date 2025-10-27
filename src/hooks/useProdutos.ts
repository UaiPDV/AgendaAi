import { useState, useEffect, useCallback } from 'react';
import {
	getProdutosDoEstabelecimento,
	createProduto,
	updateProduto,
	deleteProduto,
	Produto,
} from '@/lib/services/produto.service';

interface UseProdutosReturn {
	produtos: Produto[];
	loading: boolean;
	error: string | null;
	criarProduto: (
		produto: Omit<
			Produto,
			'id' | 'estabelecimento_id' | 'created_at' | 'updated_at'
		>
	) => Promise<void>;
	atualizarProduto: (id: number, produto: Partial<Produto>) => Promise<void>;
	deletarProduto: (id: number) => Promise<void>;
	recarregar: () => Promise<void>;
}

export function useProdutos(): UseProdutosReturn {
	const [produtos, setProdutos] = useState<Produto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const carregarProdutos = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getProdutosDoEstabelecimento();
			setProdutos(data || []);
		} catch (err) {
			console.error('Erro ao carregar produtos:', err);
			const error = err as Error;
			setError(error.message || 'Erro ao carregar produtos');
			setProdutos([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		carregarProdutos();
	}, [carregarProdutos]);

	const criarProduto = async (
		produtoData: Omit<
			Produto,
			'id' | 'estabelecimento_id' | 'created_at' | 'updated_at'
		>
	) => {
		try {
			setError(null);
			await createProduto(produtoData);
			await carregarProdutos();
		} catch (err) {
			console.error('Erro ao criar produto:', err);
			const error = err as Error;
			const errorMessage = error.message || 'Erro ao criar produto';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	};

	const atualizarProduto = async (
		id: number,
		produtoData: Partial<Produto>
	) => {
		try {
			setError(null);
			await updateProduto(id, produtoData);
			await carregarProdutos();
		} catch (err) {
			console.error('Erro ao atualizar produto:', err);
			const error = err as Error;
			const errorMessage = error.message || 'Erro ao atualizar produto';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	};

	const deletarProduto = async (id: number) => {
		try {
			setError(null);
			await deleteProduto(id);
			await carregarProdutos();
		} catch (err) {
			console.error('Erro ao deletar produto:', err);
			const error = err as Error;
			const errorMessage = error.message || 'Erro ao deletar produto';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	};

	return {
		produtos,
		loading,
		error,
		criarProduto,
		atualizarProduto,
		deletarProduto,
		recarregar: carregarProdutos,
	};
}
