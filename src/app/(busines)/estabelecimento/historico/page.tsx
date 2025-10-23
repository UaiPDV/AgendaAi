'use client';

import { useEffect, useState } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type { Agendamento } from '@/types/cliente';
import type { DadosUsuario } from '@/types';

export default function HistoricoPage() {
	const [historico, setHistorico] = useState<Agendamento[]>([]);
	const [usuariosMap, setUsuariosMap] = useState<
		Record<string, DadosUsuario>
	>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetch() {
			try {
				const [agendamentos, usuarios] = await Promise.all([
					apiRequest<Agendamento[]>(API_ENDPOINTS.AGENDAMENTOS),
					apiRequest<DadosUsuario[]>(API_ENDPOINTS.USUARIOS),
				]);

				const now = new Date();
				const passed = agendamentos.filter(
					(a) => new Date(a.data) < now
				);

				const map: Record<string, DadosUsuario> = {};
				usuarios.forEach((u) => {
					if (u.id) map[u.id] = u;
				});

				setUsuariosMap(map);
				setHistorico(passed);
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
				Histórico de Agendamentos
			</h1>

			<div className="mt-6 space-y-4">
				{loading ? (
					<p className="text-sm text-gray-500">
						Carregando histórico...
					</p>
				) : historico.length === 0 ? (
					<p className="text-sm text-gray-500">
						Nenhum agendamento concluído encontrado.
					</p>
				) : (
					historico.map((h) => (
						<div
							key={h.id}
							className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm"
						>
							<div className="flex justify-between">
								<div>
									<p className="font-medium text-gray-900 dark:text-white">
										{h.servico || 'Serviço'}
									</p>
									<p className="text-xs text-gray-500">
										Cliente:{' '}
										{h.usuarioId
											? usuariosMap[h.usuarioId as string]
													?.nome || h.usuarioId
											: '—'}
									</p>
								</div>
								<div className="text-right text-sm text-gray-500">
									<p>{new Date(h.data).toLocaleString()}</p>
									<p className="mt-1">
										Status: {h.status || 'concluído'}
									</p>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
