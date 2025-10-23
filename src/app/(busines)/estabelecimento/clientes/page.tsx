'use client';

import { useEffect, useState } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type { DadosUsuario } from '@/types';

export default function ClientesPage() {
	const [clientes, setClientes] = useState<DadosUsuario[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetch() {
			try {
				const data = await apiRequest<DadosUsuario[]>(
					API_ENDPOINTS.USUARIOS
				);
				setClientes(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		fetch();
	}, []);

	return (
		<div className="animate-fade-in">
			<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
				Clientes
			</h1>

			<div className="mt-6 space-y-3">
				{loading ? (
					<p className="text-sm text-gray-500">Carregando...</p>
				) : clientes.length === 0 ? (
					<p className="text-sm text-gray-500">
						Nenhum cliente encontrado.
					</p>
				) : (
					clientes.map((c) => (
						<div
							key={c.email}
							className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm"
						>
							<p className="font-medium text-gray-900 dark:text-white">
								{c.nome}
							</p>
							<p className="text-xs text-gray-500">
								{c.email} — {c.telefone}
							</p>
						</div>
					))
				)}
			</div>
		</div>
	);
}
