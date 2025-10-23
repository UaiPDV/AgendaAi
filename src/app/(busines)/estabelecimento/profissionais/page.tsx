'use client';

import { useEffect, useState } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type { Profissional } from '@/types';

export default function ProfissionaisPage() {
	const [profissionais, setProfissionais] = useState<Profissional[]>([]);
	const [novoNome, setNovoNome] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetch() {
			try {
				const data = await apiRequest<Profissional[]>(
					API_ENDPOINTS.ESTABELECIMENTO_PROFISSIONAIS(1)
				);
				setProfissionais(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		fetch();
	}, []);

	const criar = async () => {
		if (!novoNome) return;
		try {
			await apiRequest(
				API_ENDPOINTS.ESTABELECIMENTO_PROFISSIONAIS(1).replace(
					'/estabelecimentos/1/profissionais',
					'/profissionais'
				),
				{
					method: 'POST',
					body: JSON.stringify({
						estabelecimentoId: 1,
						nome: novoNome,
					}),
				}
			);
			const data = await apiRequest<Profissional[]>(
				API_ENDPOINTS.ESTABELECIMENTO_PROFISSIONAIS(1)
			);
			setProfissionais(data);
			setNovoNome('');
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="animate-fade-in">
			<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
				Profissionais
			</h1>

			<div className="mt-4 flex gap-2">
				<input
					value={novoNome}
					onChange={(e) => setNovoNome(e.target.value)}
					placeholder="Nome do profissional"
					className="px-3 py-2 rounded border bg-white dark:bg-gray-800"
				/>
				<button
					onClick={criar}
					className="px-4 py-2 bg-teal-600 text-white rounded"
				>
					Adicionar
				</button>
			</div>

			<div className="mt-6 space-y-3">
				{loading ? (
					<p className="text-sm text-gray-500">Carregando...</p>
				) : profissionais.length === 0 ? (
					<p className="text-sm text-gray-500">
						Nenhum profissional cadastrado.
					</p>
				) : (
					profissionais.map((p) => (
						<div
							key={p.id}
							className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm flex justify-between items-center"
						>
							<div>
								<p className="font-medium text-gray-900 dark:text-white">
									{p.nome}
								</p>
								<p className="text-xs text-gray-500">
									{p.especialidades?.join(', ') || '—'}
								</p>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
