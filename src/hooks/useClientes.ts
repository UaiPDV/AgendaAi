/**
 * Hook useClientes
 *
 * Gerencia o estado e operações relacionadas aos clientes do estabelecimento logado.
 * Automaticamente busca os clientes do estabelecimento usando o token JWT.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Cliente } from '@/types';
import {
	getClientesDoEstabelecimento,
	createCliente,
	updateCliente,
	deleteCliente,
	type NovoClienteForm,
	type AtualizarClienteForm,
} from '@/lib/services';

export function useClientes() {
	const [clientes, setClientes] = useState<Cliente[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Busca os clientes do estabelecimento
	 */
	const fetchClientes = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getClientesDoEstabelecimento();
			setClientes(data);
		} catch (err) {
			console.error('Erro ao buscar clientes:', err);
			setError(
				err instanceof Error ? err.message : 'Erro ao carregar clientes'
			);
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Carrega os clientes na montagem do componente
	 */
	useEffect(() => {
		fetchClientes();
	}, [fetchClientes]);

	/**
	 * Cria um novo cliente
	 */
	const criarCliente = async (
		clienteData: NovoClienteForm
	): Promise<Cliente> => {
		const cliente = await createCliente(clienteData);
		await fetchClientes(); // Recarrega a lista
		return cliente;
	};

	/**
	 * Atualiza um cliente existente
	 */
	const atualizarCliente = async (
		id: string,
		clienteData: AtualizarClienteForm
	): Promise<Cliente> => {
		const cliente = await updateCliente(id, clienteData);
		await fetchClientes(); // Recarrega a lista
		return cliente;
	};

	/**
	 * Exclui um cliente
	 */
	const excluirCliente = async (id: string): Promise<void> => {
		await deleteCliente(id);
		await fetchClientes(); // Recarrega a lista
	};

	/**
	 * Recarrega a lista de clientes
	 */
	const recarregar = useCallback(() => {
		return fetchClientes();
	}, [fetchClientes]);

	return {
		clientes,
		loading,
		error,
		criarCliente,
		atualizarCliente,
		excluirCliente,
		recarregar,
	};
}
