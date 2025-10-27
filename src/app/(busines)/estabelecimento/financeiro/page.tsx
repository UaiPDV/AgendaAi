'use client';

import { useFinancas } from '@/hooks/useFinancas';
import { useAgendamentos } from '@/hooks/useAgendamentos';

export default function FinanceiroPage() {
	const { data: financas, loading: loadingFinancas } = useFinancas();
	const { agendamentos, loading: loadingAgendamentos } = useAgendamentos({
		autoLoad: true,
	});

	// Filtra apenas agendamentos concluídos para transações
	const transacoes = agendamentos
		.filter((agendamento) => agendamento.status === 'concluido')
		.sort(
			(a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
		);

	const formatarMoeda = (valor: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(valor);
	};

	const formatarData = (data: string) => {
		return new Date(data).toLocaleDateString('pt-BR');
	};

	const formatarDataHora = (data: string) => {
		return new Date(data).toLocaleString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	if (loadingFinancas || loadingAgendamentos) {
		return (
			<div className="animate-fade-in">
				<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
					Financeiro
				</h1>
				<p className="mt-2 text-gray-600 dark:text-gray-400">
					Carregando dados financeiros...
				</p>
			</div>
		);
	}

	if (!financas || financas.tipo !== 'estabelecimento') {
		return (
			<div className="animate-fade-in">
				<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
					Financeiro
				</h1>
				<p className="mt-2 text-red-600">
					Erro ao carregar dados financeiros
				</p>
			</div>
		);
	}

	const mesAtual = new Date().toLocaleDateString('pt-BR', {
		month: 'long',
		year: 'numeric',
	});

	return (
		<div className="animate-fade-in">
			<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
				Financeiro
			</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Acompanhe seus ganhos com serviços.
			</p>

			{/* Cards de Resumo */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
							Ganhos do Mês
						</h3>
						<i className="fas fa-calendar-alt text-blue-500 text-2xl"></i>
					</div>
					<p className="text-3xl font-bold mt-2 text-blue-600">
						{formatarMoeda(financas.ganhosMes)}
					</p>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
						{mesAtual}
					</p>
				</div>

				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
							Ganho Total
						</h3>
						<i className="fas fa-chart-line text-green-500 text-2xl"></i>
					</div>
					<p className="text-3xl font-bold mt-2 text-green-600">
						{formatarMoeda(financas.ganhoTotal)}
					</p>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						Desde o início das operações
					</p>
				</div>
			</div>

			{/* Transações Recentes */}
			<div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
				<h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
					Transações Recentes
				</h3>
				<div className="space-y-3">
					{transacoes.slice(0, 4).length === 0 ? (
						<p className="text-gray-500 dark:text-gray-400 text-sm">
							Nenhuma transação registrada
						</p>
					) : (
						transacoes.slice(0, 4).map((agendamento) => (
							<div
								key={agendamento.id}
								className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
							>
								<div className="flex-1">
									<p className="font-medium text-gray-800 dark:text-gray-200">
										{agendamento.servico_nome_real}
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{agendamento.usuario_nome} -{' '}
										{formatarDataHora(agendamento.data)}
									</p>
								</div>
								<span className="font-semibold text-green-600 self-start sm:self-center">
									{formatarMoeda(agendamento.preco)}
								</span>
							</div>
						))
					)}
				</div>
			</div>

			{/* Histórico Completo */}
			<div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
				<div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
					<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
						Histórico Completo
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						Todos os ganhos com serviços
					</p>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
							<tr>
								<th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Data
								</th>
								<th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Serviço
								</th>
								<th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Cliente
								</th>
								<th className="text-right p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
									Valor
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
							{transacoes.length === 0 ? (
								<tr>
									<td
										colSpan={4}
										className="p-4 text-center text-gray-500 dark:text-gray-400"
									>
										Nenhuma transação registrada
									</td>
								</tr>
							) : (
								transacoes.map((agendamento) => (
									<tr
										key={agendamento.id}
										className="hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										<td className="p-4 text-sm text-gray-800 dark:text-gray-200">
											{formatarData(agendamento.data)}
										</td>
										<td className="p-4 text-sm text-gray-800 dark:text-gray-200">
											{agendamento.servico_nome_real}
										</td>
										<td className="p-4 text-sm text-gray-800 dark:text-gray-200">
											{agendamento.usuario_nome}
										</td>
										<td className="p-4 text-sm text-right font-semibold text-green-600">
											{formatarMoeda(agendamento.preco)}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
