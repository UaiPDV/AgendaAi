import { useState, useEffect, useCallback } from 'react';
import {
	getContasReceber,
	getResumoContasReceber,
	createContaReceber,
	updateContaReceber,
	marcarContaComoRecebida,
	deleteContaReceber,
	ContaReceber,
	ResumoContasReceber,
} from '@/lib/services/contas-receber.service';

interface UseContasReceberReturn {
	contas: ContaReceber[];
	resumo: ResumoContasReceber | null;
	loading: boolean;
	error: string | null;
	criarConta: (
		conta: Omit<
			ContaReceber,
			'id' | 'estabelecimento_id' | 'status' | 'created_at' | 'updated_at'
		>
	) => Promise<void>;
	atualizarConta: (id: number, conta: Partial<ContaReceber>) => Promise<void>;
	marcarComoRecebida: (id: number) => Promise<void>;
	deletarConta: (id: number) => Promise<void>;
	filtrar: (filtros: {
		status?: string;
		dataInicio?: string;
		dataFim?: string;
	}) => Promise<void>;
	recarregar: () => Promise<void>;
}

export function useContasReceber(): UseContasReceberReturn {
	const [contas, setContas] = useState<ContaReceber[]>([]);
	const [resumo, setResumo] = useState<ResumoContasReceber | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filtrosAtuais, setFiltrosAtuais] = useState<{
		status?: string;
		dataInicio?: string;
		dataFim?: string;
	}>({});

	const carregarDados = useCallback(
		async (filtros = filtrosAtuais) => {
			try {
				setLoading(true);
				setError(null);

				const [contasData, resumoData] = await Promise.all([
					getContasReceber(filtros),
					getResumoContasReceber(),
				]);

				setContas(contasData || []);
				setResumo(resumoData);
			} catch (err) {
				console.error('Erro ao carregar contas a receber:', err);
				const error = err as Error;
				setError(error.message || 'Erro ao carregar contas a receber');
				setContas([]);
				setResumo(null);
			} finally {
				setLoading(false);
			}
		},
		[filtrosAtuais]
	);

	useEffect(() => {
		carregarDados();
	}, [carregarDados]);

	const criarConta = async (
		contaData: Omit<
			ContaReceber,
			'id' | 'estabelecimento_id' | 'status' | 'created_at' | 'updated_at'
		>
	) => {
		try {
			setError(null);
			await createContaReceber(contaData);
			await carregarDados();
		} catch (err) {
			console.error('Erro ao criar conta a receber:', err);
			const error = err as Error;
			const errorMessage =
				error.message || 'Erro ao criar conta a receber';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	};

	const atualizarConta = async (
		id: number,
		contaData: Partial<ContaReceber>
	) => {
		try {
			setError(null);
			await updateContaReceber(id, contaData);
			await carregarDados();
		} catch (err) {
			console.error('Erro ao atualizar conta a receber:', err);
			const error = err as Error;
			const errorMessage =
				error.message || 'Erro ao atualizar conta a receber';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	};

	const marcarComoRecebida = async (id: number) => {
		try {
			setError(null);
			await marcarContaComoRecebida(id);
			await carregarDados();
		} catch (err) {
			console.error('Erro ao marcar conta como recebida:', err);
			const error = err as Error;
			const errorMessage =
				error.message || 'Erro ao marcar conta como recebida';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	};

	const deletarConta = async (id: number) => {
		try {
			setError(null);
			await deleteContaReceber(id);
			await carregarDados();
		} catch (err) {
			console.error('Erro ao deletar conta a receber:', err);
			const error = err as Error;
			const errorMessage =
				error.message || 'Erro ao deletar conta a receber';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	};

	const filtrar = async (filtros: {
		status?: string;
		dataInicio?: string;
		dataFim?: string;
	}) => {
		setFiltrosAtuais(filtros);
		await carregarDados(filtros);
	};

	return {
		contas,
		resumo,
		loading,
		error,
		criarConta,
		atualizarConta,
		marcarComoRecebida,
		deletarConta,
		filtrar,
		recarregar: () => carregarDados(),
	};
}
