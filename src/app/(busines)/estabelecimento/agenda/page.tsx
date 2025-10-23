'use client';

import { useEffect, useState } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type { Agendamento } from '@/types';
import { LoadingSpinner } from '@/components/ui';
import { Calendar, Clock, User, Phone, Check, X } from 'lucide-react';

export default function AgendaPage() {
	const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const ags = await apiRequest<Agendamento[]>(
					API_ENDPOINTS.AGENDAMENTOS
				);
				setAgendamentos(ags);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	// Filtrar agendamentos de hoje
	const hoje = new Date().toISOString().split('T')[0];
	const agendamentosHoje = agendamentos.filter((a) =>
		a.data.startsWith(hoje)
	);

	// Filtrar próximos agendamentos (exceto os de hoje)
	const proximosAgendamentos = agendamentos.filter(
		(a) => !a.data.startsWith(hoje) && new Date(a.data) > new Date()
	);

	const handleConfirm = (id: string) => {
		console.log('Confirmar agendamento:', id);
		// TODO: Implementar confirmação
	};

	const handleCancel = (id: string) => {
		if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
			console.log('Cancelar agendamento:', id);
			// TODO: Implementar cancelamento
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* Cabeçalho */}
			<div>
				<h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
					Agenda
				</h2>
				<p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400">
					Gerencie os agendamentos do seu estabelecimento
				</p>
			</div>

			{/* Agendamentos de Hoje */}
			<div>
				<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
					<Calendar size={20} />
					Agendamentos de Hoje ({agendamentosHoje.length})
				</h3>

				{agendamentosHoje.length === 0 ? (
					<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
						<Calendar
							size={48}
							className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
						/>
						<p className="text-gray-500 dark:text-gray-400">
							Nenhum agendamento para hoje
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{agendamentosHoje.map((agendamento) => (
							<div
								key={agendamento.id}
								className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
							>
								<div className="flex items-start justify-between mb-3">
									<div className="flex-1">
										<h4 className="font-semibold text-gray-800 dark:text-gray-100">
											{agendamento.servico}
										</h4>
										<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
											<Clock size={14} />
											{agendamento.horario || '—'}
										</p>
									</div>
									<span
										className={`px-2 py-1 text-xs rounded-full font-medium ${
											agendamento.status === 'confirmado'
												? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
												: agendamento.status ===
												  'pendente'
												? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
												: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
										}`}
									>
										{agendamento.status}
									</span>
								</div>

								<div className="space-y-2 text-sm">
									<p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
										<User size={14} />
										<span className="font-medium">
											Profissional:
										</span>{' '}
										{agendamento.profissional}
									</p>
									<p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
										<User size={14} />
										<span className="font-medium">
											Cliente:
										</span>{' '}
										Cliente Exemplo
									</p>
									<p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
										<Phone size={14} />
										<span className="font-medium">
											Telefone:
										</span>{' '}
										(11) 98765-4321
									</p>
								</div>

								<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
									<p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
										R${' '}
										{parseFloat(agendamento.preco).toFixed(
											2
										)}
									</p>
								</div>

								{agendamento.status === 'pendente' && (
									<div className="mt-4 flex gap-2">
										<button
											onClick={() =>
												handleConfirm(agendamento.id)
											}
											className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
										>
											<Check size={16} />
											Confirmar
										</button>
										<button
											onClick={() =>
												handleCancel(agendamento.id)
											}
											className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
										>
											<X size={16} />
											Cancelar
										</button>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Próximos Agendamentos */}
			<div>
				<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
					<Calendar size={20} />
					Próximos Agendamentos ({proximosAgendamentos.length})
				</h3>

				{proximosAgendamentos.length === 0 ? (
					<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
						<Calendar
							size={48}
							className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
						/>
						<p className="text-gray-500 dark:text-gray-400">
							Nenhum agendamento próximo
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{proximosAgendamentos.map((agendamento) => (
							<div
								key={agendamento.id}
								className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
							>
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
									<div className="flex-1">
										<div className="flex items-start justify-between mb-2">
											<div>
												<h4 className="font-semibold text-gray-800 dark:text-gray-100">
													{agendamento.servico}
												</h4>
												<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
													<Calendar size={14} />
													{new Date(
														agendamento.data
													).toLocaleDateString(
														'pt-BR'
													)}{' '}
													às{' '}
													{agendamento.horario || '—'}
												</p>
											</div>
											<span
												className={`px-2 py-1 text-xs rounded-full font-medium ${
													agendamento.status ===
													'confirmado'
														? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
														: agendamento.status ===
														  'pendente'
														? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
														: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
												}`}
											>
												{agendamento.status}
											</span>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mt-3">
											<p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
												<User size={14} />
												<span className="font-medium">
													Prof:
												</span>{' '}
												{agendamento.profissional}
											</p>
											<p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
												<User size={14} />
												<span className="font-medium">
													Cliente:
												</span>{' '}
												Cliente Exemplo
											</p>
											<p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
												<Phone size={14} />
												(11) 98765-4321
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
											R${' '}
											{parseFloat(
												agendamento.preco
											).toFixed(2)}
										</p>

										{agendamento.status === 'pendente' && (
											<div className="flex gap-2">
												<button
													onClick={() =>
														handleConfirm(
															agendamento.id
														)
													}
													className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
													title="Confirmar"
												>
													<Check size={16} />
												</button>
												<button
													onClick={() =>
														handleCancel(
															agendamento.id
														)
													}
													className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
													title="Cancelar"
												>
													<X size={16} />
												</button>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
