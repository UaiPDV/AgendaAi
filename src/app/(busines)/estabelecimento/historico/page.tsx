'use client';

import { useState, useMemo } from 'react';
import { useAgendamentos } from '@/hooks';
import { Calendar, User, CheckCircle, XCircle } from 'lucide-react';

export default function HistoricoPage() {
	const { agendamentos, loading } = useAgendamentos({ autoLoad: true });

	const [filtroStatus, setFiltroStatus] = useState<
		'todos' | 'concluido' | 'cancelado'
	>('todos');

	// Filtra apenas agendamentos passados (histórico)
	const historico = useMemo(() => {
		const hoje = new Date();
		hoje.setHours(0, 0, 0, 0);

		let agendamentosPassados = agendamentos.filter((a) => {
			const dataAgendamento = new Date(a.data);
			dataAgendamento.setHours(0, 0, 0, 0);
			return (
				dataAgendamento < hoje ||
				a.status === 'concluido' ||
				a.status === 'cancelado'
			);
		});

		// Aplica filtro de status
		if (filtroStatus !== 'todos') {
			agendamentosPassados = agendamentosPassados.filter(
				(a) => a.status === filtroStatus
			);
		}

		// Ordena do mais recente para o mais antigo
		return agendamentosPassados.sort(
			(a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
		);
	}, [agendamentos, filtroStatus]);

	const formatarData = (data: string) => {
		return new Date(data).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		});
	};

	const formatarMoeda = (valor: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(valor);
	};

	// Estatísticas do histórico
	const stats = useMemo(() => {
		const concluidos = historico.filter(
			(a) => a.status === 'concluido'
		).length;
		const cancelados = historico.filter(
			(a) => a.status === 'cancelado'
		).length;
		const totalFaturado = historico
			.filter((a) => a.status === 'concluido')
			.reduce((acc, a) => acc + a.preco, 0);

		return { concluidos, cancelados, totalFaturado };
	}, [historico]);

	if (loading) {
		return (
			<div className="animate-fade-in">
				<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
					Histórico de Agendamentos
				</h1>
				<p className="mt-2 text-gray-600 dark:text-gray-400">
					Carregando histórico...
				</p>
			</div>
		);
	}

	return (
		<div className="animate-fade-in">
			<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
				Histórico de Agendamentos
			</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Visualize todos os agendamentos concluídos e cancelados
			</p>

			{/* Cards de Estatísticas */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Concluídos
							</p>
							<p className="text-2xl font-bold text-green-600 mt-1">
								{stats.concluidos}
							</p>
						</div>
						<CheckCircle className="text-green-500" size={32} />
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Cancelados
							</p>
							<p className="text-2xl font-bold text-red-600 mt-1">
								{stats.cancelados}
							</p>
						</div>
						<XCircle className="text-red-500" size={32} />
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Total Faturado
							</p>
							<p className="text-2xl font-bold text-blue-600 mt-1">
								{formatarMoeda(stats.totalFaturado)}
							</p>
						</div>
						<Calendar className="text-blue-500" size={32} />
					</div>
				</div>
			</div>

			{/* Filtros */}
			<div className="mt-8 flex gap-2">
				<button
					onClick={() => setFiltroStatus('todos')}
					className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
						filtroStatus === 'todos'
							? 'bg-gray-800 dark:bg-gray-600 text-white'
							: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
					}`}
				>
					Todos ({historico.length})
				</button>
				<button
					onClick={() => setFiltroStatus('concluido')}
					className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
						filtroStatus === 'concluido'
							? 'bg-green-600 text-white'
							: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
					}`}
				>
					Concluídos ({stats.concluidos})
				</button>
				<button
					onClick={() => setFiltroStatus('cancelado')}
					className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
						filtroStatus === 'cancelado'
							? 'bg-red-600 text-white'
							: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
					}`}
				>
					Cancelados ({stats.cancelados})
				</button>
			</div>

			{/* Lista de Histórico */}
			<div className="mt-6 space-y-3">
				{historico.length === 0 ? (
					<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
						<Calendar
							size={48}
							className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
						/>
						<p className="text-gray-500 dark:text-gray-400">
							Nenhum agendamento encontrado no histórico
						</p>
					</div>
				) : (
					historico.map((agendamento) => (
						<div
							key={agendamento.id}
							className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
						>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div className="flex-1">
									<div className="flex items-start justify-between mb-2">
										<div>
											<h4 className="font-semibold text-gray-800 dark:text-gray-100">
												{agendamento.servico_nome_real}
											</h4>
											<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
												<Calendar size={14} />
												{formatarData(
													agendamento.data
												)}{' '}
												às {agendamento.horario || '—'}
											</p>
										</div>
										<span
											className={`px-2 py-1 text-xs rounded-full font-medium ${
												agendamento.status ===
												'concluido'
													? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
													: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
											}`}
										>
											{agendamento.status === 'concluido'
												? 'Concluído'
												: 'Cancelado'}
										</span>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mt-3">
										<p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
											<User size={14} />
											<span className="font-medium">
												Profissional:
											</span>{' '}
											{agendamento.profissional_nome_real}
										</p>
										<p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
											<User size={14} />
											<span className="font-medium">
												Cliente:
											</span>{' '}
											{agendamento.usuario_nome}
										</p>
									</div>
								</div>

								<div className="text-right">
									<p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
										{formatarMoeda(agendamento.preco)}
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
