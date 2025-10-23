'use client';

/**
 * Página Meus Agendamentos - Lista todos os agendamentos do usuário
 */

import { useAgendamentos } from '@/hooks';
import { AgendamentoCard, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { useState, useEffect } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function AgendamentosPage() {
	const searchParams = useSearchParams();
	const sucesso = searchParams.get('sucesso');

	const { agendamentos, loading, error, cancelarAgendamento } =
		useAgendamentos();
	const [filter, setFilter] = useState<
		'todos' | 'pendente' | 'confirmado' | 'concluido' | 'cancelado'
	>('todos');
	const [mostrarSucesso, setMostrarSucesso] = useState(false);

	useEffect(() => {
		if (sucesso === 'true') {
			setMostrarSucesso(true);
			// Ocultar mensagem após 5 segundos
			const timer = setTimeout(() => {
				setMostrarSucesso(false);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [sucesso]);

	// Filtrar agendamentos por status
	const agendamentosFiltrados = agendamentos.filter((agend) =>
		filter === 'todos' ? true : agend.status === filter
	);

	const handleCancelar = async (id: string) => {
		if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
			const sucesso = await cancelarAgendamento(id);
			if (sucesso) {
				alert('Agendamento cancelado com sucesso!');
			} else {
				alert('Erro ao cancelar agendamento');
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			{/* Mensagem de Sucesso */}
			{mostrarSucesso && (
				<div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
					<CheckCircle className="w-6 h-6" />
					<div>
						<p className="font-semibold">
							Agendamento confirmado com sucesso!
						</p>
						<p className="text-sm">
							Você receberá uma notificação antes do horário.
						</p>
					</div>
					<button
						onClick={() => setMostrarSucesso(false)}
						className="ml-4 text-white hover:text-gray-200"
					>
						×
					</button>
				</div>
			)}

			{/* Header */}
			<div className="max-w-7xl mx-auto mb-8">
				<div className="flex items-center gap-3 mb-2">
					<Calendar className="w-8 h-8 text-blue-500" />
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Meus Agendamentos
					</h1>
				</div>
				<p className="text-gray-600 dark:text-gray-400">
					Gerencie seus agendamentos
				</p>
			</div>

			{/* Filtros */}
			<div className="max-w-7xl mx-auto mb-6">
				<div className="flex gap-2 overflow-x-auto pb-2">
					{[
						{ value: 'todos', label: 'Todos' },
						{ value: 'pendente', label: 'Pendentes' },
						{ value: 'confirmado', label: 'Confirmados' },
						{ value: 'concluido', label: 'Concluídos' },
						{ value: 'cancelado', label: 'Cancelados' },
					].map((item) => (
						<button
							key={item.value}
							onClick={() =>
								setFilter(item.value as typeof filter)
							}
							className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
								filter === item.value
									? 'bg-blue-500 text-white'
									: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
							}`}
						>
							{item.label}
						</button>
					))}
				</div>
			</div>

			{/* Loading State */}
			{loading && <LoadingSpinner />}

			{/* Error State */}
			{error && <ErrorMessage message={error} />}

			{/* Lista de Agendamentos */}
			{!loading && !error && (
				<div className="max-w-7xl mx-auto">
					{agendamentosFiltrados.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-600 dark:text-gray-400">
								Nenhum agendamento encontrado
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{agendamentosFiltrados.map((agendamento) => (
								<AgendamentoCard
									key={agendamento.id}
									agendamento={agendamento}
									onCancel={handleCancelar}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
