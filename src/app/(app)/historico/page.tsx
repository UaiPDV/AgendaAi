'use client';

/**
 * Página Histórico - Lista agendamentos passados
 */

import { useAgendamentos } from '@/hooks';
import { AgendamentoCard, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { History } from 'lucide-react';

export default function HistoricoPage() {
	const { agendamentos, loading, error } = useAgendamentos();

	// Filtrar apenas agendamentos concluídos ou cancelados
	const historico = agendamentos.filter(
		(agend) => agend.status === 'concluido' || agend.status === 'cancelado'
	);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			{/* Header */}
			<div className="max-w-7xl mx-auto mb-8">
				<div className="flex items-center gap-3 mb-2">
					<History className="w-8 h-8 text-purple-500" />
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Histórico
					</h1>
				</div>
				<p className="text-gray-600 dark:text-gray-400">
					Seus agendamentos anteriores
				</p>
			</div>

			{/* Loading State */}
			{loading && <LoadingSpinner />}

			{/* Error State */}
			{error && <ErrorMessage message={error} />}

			{/* Lista de Histórico */}
			{!loading && !error && (
				<div className="max-w-7xl mx-auto">
					{historico.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-600 dark:text-gray-400">
								Nenhum agendamento no histórico
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{historico.map((agendamento) => (
								<AgendamentoCard
									key={agendamento.id}
									agendamento={agendamento}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
