/**
 * Card de Agendamento na Lista
 */

import type { AgendamentoListItem } from '@/types/estabelecimento';

interface AppointmentCardProps {
	agendamento: AgendamentoListItem;
	onClick?: (id: string) => void;
}

export function AppointmentCard({
	agendamento,
	onClick,
}: AppointmentCardProps) {
	const statusColors = {
		confirmado: 'bg-green-100 text-green-700',
		pendente: 'bg-yellow-100 text-yellow-700',
		cancelado: 'bg-red-100 text-red-700',
		concluido: 'bg-blue-100 text-blue-700',
	};

	const statusLabels = {
		confirmado: 'Confirmado',
		pendente: 'Pendente',
		cancelado: 'Cancelado',
		concluido: 'Concluído',
	};

	const dataFormatada = new Date(agendamento.data).toLocaleDateString(
		'pt-BR',
		{
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		}
	);

	return (
		<div
			className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${
				onClick
					? 'cursor-pointer hover:shadow-md transition-shadow'
					: ''
			}`}
			onClick={() => onClick?.(agendamento.id)}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="flex items-center gap-2">
						<h4 className="font-semibold text-gray-800">
							{agendamento.servico}
						</h4>
						<span
							className={`px-2 py-1 text-xs rounded ${
								statusColors[agendamento.status]
							}`}
						>
							{statusLabels[agendamento.status]}
						</span>
					</div>
					<div className="mt-2 space-y-1 text-sm text-gray-600">
						<div className="flex items-center gap-2">
							<i className="fas fa-user w-4"></i>
							<span>{agendamento.clienteNome || 'Cliente'}</span>
						</div>
						<div className="flex items-center gap-2">
							<i className="fas fa-user-tie w-4"></i>
							<span>{agendamento.profissional}</span>
						</div>
						<div className="flex items-center gap-2">
							<i className="fas fa-calendar w-4"></i>
							<span>
								{dataFormatada} • {agendamento.horario || '—'}
							</span>
						</div>
					</div>
				</div>
				<div className="text-right">
					<div className="text-lg font-semibold text-gray-800">
						R$ {agendamento.preco}
					</div>
				</div>
			</div>
		</div>
	);
}
