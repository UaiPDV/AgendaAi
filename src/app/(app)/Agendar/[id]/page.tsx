'use client';

/**
 * Página de Serviços do Estabelecimento
 * Lista todos os serviços disponíveis de um estabelecimento
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Clock, DollarSign } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type { Estabelecimento, Servico } from '@/types';

export default function ServicosEstabelecimento() {
	const router = useRouter();
	const params = useParams();
	const estabelecimentoId = params.id as string;

	const [estabelecimento, setEstabelecimento] =
		useState<Estabelecimento | null>(null);
	const [servicos, setServicos] = useState<Servico[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				setError(null);

				// Buscar dados do estabelecimento
				const estabelecimentoData = await apiRequest<Estabelecimento>(
					API_ENDPOINTS.ESTABELECIMENTO_BY_ID(
						Number(estabelecimentoId)
					)
				);
				setEstabelecimento(estabelecimentoData);

				// Buscar serviços do estabelecimento
				const servicosData = await apiRequest<Servico[]>(
					API_ENDPOINTS.ESTABELECIMENTO_SERVICOS(
						Number(estabelecimentoId)
					)
				);
				setServicos(servicosData);
			} catch (err) {
				setError('Erro ao carregar dados do estabelecimento');
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [estabelecimentoId]);

	const handleServicoClick = (servico: Servico) => {
		// Navegar para o fluxo de agendamento
		router.push(
			`/Agendar/${estabelecimentoId}/agendar?servicoId=${servico.id}`
		);
	};

	if (loading) return <LoadingSpinner />;
	if (error) return <ErrorMessage message={error} />;
	if (!estabelecimento)
		return <ErrorMessage message="Estabelecimento não encontrado" />;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			{/* Header */}
			<div className="max-w-7xl mx-auto mb-8">
				<button
					onClick={() => router.push('/Agendar')}
					className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
				>
					<ArrowLeft className="w-5 h-5" />
					<span>Voltar para estabelecimentos</span>
				</button>

				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							{estabelecimento.nome}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Escolha um serviço para agendar seu horário
						</p>
					</div>
				</div>
			</div>

			{/* Lista de Serviços */}
			<div className="max-w-7xl mx-auto">
				{servicos.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-gray-600 dark:text-gray-400">
							Nenhum serviço disponível
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{servicos.map((servico) => (
							<div
								key={servico.id}
								className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
							>
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
											{servico.nome}
										</h3>
										{servico.descricao && (
											<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
												{servico.descricao}
											</p>
										)}
										<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
											<div className="flex items-center gap-1">
												<Clock className="w-4 h-4" />
												<span>
													{servico.duracao} min
												</span>
											</div>
											<div className="flex items-center gap-1">
												<DollarSign className="w-4 h-4" />
												<span className="text-lg font-bold text-gray-900 dark:text-white">
													R$ {servico.preco}
												</span>
											</div>
										</div>
									</div>
									<button
										onClick={() =>
											handleServicoClick(servico)
										}
										className="w-full sm:w-auto bg-gray-800 dark:bg-gray-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
									>
										Reservar
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
