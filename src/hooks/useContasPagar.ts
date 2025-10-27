import { useState, useEffect, useCallback } from 'react';
import {
	getContasPagar,
	getResumoContasPagar,
	createContaPagar,
	updateContaPagar,
	marcarContaComoPaga,
	deleteContaPagar,
	ContaPagar,
	ResumoContasPagar,
} from '@/lib/services/contas-pagar.service';

interface UseContasPagarReturn {
	contas: ContaPagar[];
	resumo: ResumoContasPagar | null;
	loading: boolean;
	error: string | null;
	criarConta: (
		conta: Omit<
			ContaPagar,
			'id' | 'estabelecimento_id' | 'status' | 'created_at' | 'updated_at'
		>
	) => Promise<void>;
	atualizarConta: (id: number, conta: Partial<ContaPagar>) => Promise<void>;
	marcarComoPaga: (id: number) => Promise<void>;
	deletarConta: (id: number) => Promise<void>;
	filtrar: (filtros: {
		status?: string;
		dataInicio?: string;
		dataFim?: string;
	}) => Promise<void>;
	recarregar: () => Promise<void>;
}

export function useContasPagar(): UseContasPagarReturn {
	const [contas, setContas] = useState<ContaPagar[]>([]);
	const [resumo, setResumo] = useState<ResumoContasPagar | null>(null);
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
					getContasPagar(filtros),
					getResumoContasPagar(),
				]);

				setContas(contasData || []);
				setResumo(resumoData);
			} catch (err) {
				console.error('Erro ao carregar contas a pagar:', err);
				const error = err as Error;
				setError(error.message || 'Erro ao carregar contas a pagar');
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
			ContaPagar,
			'id' | 'estabelecimento_id' | 'status' | 'created_at' | 'updated_at'
		>
	) => {
		try {
			setError(null);
			await createContaPagar(contaData);
			await carregarDados();
		} catch (err) {
			console.error('Erro ao criar conta a pagar:', err);
			const error = err as Error;
			const errorMessage = error.message || 'Erro ao criar conta a pagar';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	};

	const atualizarConta = async (
		id: number,
		contaData: Partial<ContaPagar>
	) => {
		try {
			setError(null);
			await updateContaPagar(id, contaData);
			await carregarDados();
		} catch (err) {
			console.error('Erro ao atualizar conta a pagar:', err);
			const error = err as Error;
			const errorMessage =
				error.message || 'Erro ao atualizar conta a pagar';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	};

	const marcarComoPaga = async (id: number) => {
		try {
			setError(null);
			await marcarContaComoPaga(id);
			await carregarDados();
		} catch (err) {
			console.error('Erro ao marcar conta como paga:', err);
			const error = err as Error;
			const errorMessage =
				error.message || 'Erro ao marcar conta como paga';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	};

	const deletarConta = async (id: number) => {
		try {
			setError(null);
			await deleteContaPagar(id);
			await carregarDados();
		} catch (err) {
			console.error('Erro ao deletar conta a pagar:', err);
			const error = err as Error;
			const errorMessage =
				error.message || 'Erro ao deletar conta a pagar';
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
		marcarComoPaga,
		deletarConta,
		filtrar,
		recarregar: () => carregarDados(),
	};
}
