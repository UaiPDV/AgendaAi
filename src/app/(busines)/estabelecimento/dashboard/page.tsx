/**
 * Dashboard do Estabelecimento
 * Visão geral com métricas, gráficos e próximos agendamentos
 */

'use client';

import {
	useDashboardMetrics,
	useServicos,
	useProfissionais,
	useClientes,
} from '@/hooks';
import { LoadingSpinner } from '@/components/ui';
import {
	Calendar,
	CalendarCheck,
	DollarSign,
	TrendingDown,
	Briefcase,
	Users,
	UserCheck,
	ChartBar,
	CalendarX,
} from 'lucide-react';

export default function DashboardPage() {
	// Hooks para buscar dados reais da API
	const {
		metrics,
		proximosAgendamentos,
		loading: loadingMetrics,
		error: errorMetrics,
	} = useDashboardMetrics();
	const { servicos, loading: loadingServicos } = useServicos();
	const { profissionais, loading: loadingProfissionais } = useProfissionais();
	const { clientes, loading: loadingClientes } = useClientes();

	const loading =
		loadingMetrics ||
		loadingServicos ||
		loadingProfissionais ||
		loadingClientes;

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<LoadingSpinner />
			</div>
		);
	}

	if (errorMetrics) {
		return (
			<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
				<i className="fas fa-exclamation-circle mr-2"></i>
				{errorMetrics}
			</div>
		);
	}

	// Total de serviços
	const servicosAtivos = servicos.length;

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* Cabeçalho */}
			<div>
				<h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
					Dashboard do Estabelecimento
				</h2>
				<p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400">
					Visão geral do seu negócio
				</p>
			</div>

			{/* Cards de Métricas */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{/* Agendamentos Hoje */}
				<div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Agendamentos Hoje
							</p>
							<h4 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">
								{metrics.agendamentosHoje}
							</h4>
							<p className="text-xs text-gray-400 mt-1">
								Confirmados
							</p>
						</div>
						<div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-lg flex items-center justify-center">
							<CalendarCheck className="text-white" size={24} />
						</div>
					</div>
				</div>

				{/* Agendamentos Semana */}
				<div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Agendamentos Semana
							</p>
							<h4 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">
								{metrics.agendamentosSemana}
							</h4>
							<p className="text-xs text-green-600 dark:text-green-400 mt-1">
								Esta semana
							</p>
						</div>
						<div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-lg flex items-center justify-center">
							<Calendar className="text-white" size={24} />
						</div>
					</div>
				</div>

				{/* Receita do Mês */}
				<div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Receita do Mês
							</p>
							<h4 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">
								R$ {metrics.receitaMes.toFixed(2)}
							</h4>
							<p className="text-xs text-green-600 dark:text-green-400 mt-1">
								Mês atual
							</p>
						</div>
						<div className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-500 rounded-lg flex items-center justify-center">
							<DollarSign className="text-white" size={24} />
						</div>
					</div>
				</div>

				{/* Taxa de Cancelamento */}
				<div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Taxa Cancelamento
							</p>
							<h4 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">
								{metrics.taxaCancelamento.toFixed(1)}%
							</h4>
							<p className="text-xs text-gray-400 mt-1">
								Últimos 30 dias
							</p>
						</div>
						<div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-lg flex items-center justify-center">
							<TrendingDown className="text-white" size={24} />
						</div>
					</div>
				</div>
			</div>

			{/* Seção de Gráficos e Listas */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Gráfico de Receita Mensal */}
				<div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
						<ChartBar size={20} />
						Receita Mensal
					</h3>
					<div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
						<div className="text-center">
							<ChartBar
								size={48}
								className="mx-auto mb-3 opacity-50"
							/>
							<p className="text-sm">
								Gráfico disponível em breve
							</p>
							<p className="text-xs mt-1">
								Visualização de receita dos últimos 6 meses
							</p>
						</div>
					</div>
				</div>

				{/* Próximos Agendamentos */}
				<div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
						<Calendar size={20} />
						Próximos Agendamentos
					</h3>
					<div className="space-y-3 max-h-80 overflow-y-auto">
						{proximosAgendamentos.length === 0 ? (
							<div className="text-center text-gray-400 dark:text-gray-500 py-8">
								<CalendarX
									size={48}
									className="mx-auto mb-3 opacity-50"
								/>
								<p className="text-sm">
									Nenhum agendamento próximo
								</p>
							</div>
						) : (
							proximosAgendamentos.map((agendamento) => (
								<div
									key={agendamento.id}
									className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
								>
									<div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
										<Calendar
											className="text-white"
											size={20}
										/>
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-gray-800 dark:text-gray-100 truncate">
											{agendamento.servico}
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{new Date(
												agendamento.data
											).toLocaleDateString('pt-BR')}{' '}
											{agendamento.horario &&
												`às ${agendamento.horario}`}
										</p>
										<p className="text-xs text-gray-400 dark:text-gray-500 truncate">
											Cliente:{' '}
											{agendamento.clienteNome || 'N/A'}
										</p>
									</div>
									<span
										className={`px-2 py-1 text-xs rounded-full font-medium ${
											agendamento.status === 'confirmado'
												? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
												: agendamento.status ===
												  'pendente'
												? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
												: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
										}`}
									>
										{agendamento.status}
									</span>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Estatísticas Adicionais */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Serviços Ativos
							</p>
							<h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
								{servicosAtivos}
							</h4>
							<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
								Disponíveis para agendamento
							</p>
						</div>
						<div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
							<Briefcase className="text-white" size={24} />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Profissionais
							</p>
							<h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
								{profissionais.length}
							</h4>
							<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
								Cadastrados
							</p>
						</div>
						<div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
							<Users className="text-white" size={24} />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Total Clientes
							</p>
							<h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
								{clientes.length}
							</h4>
							<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
								Cadastrados
							</p>
						</div>
						<div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
							<UserCheck className="text-white" size={24} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
