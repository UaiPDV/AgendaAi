/**
 * Card de Agendamento
 */

import { Calendar, Clock, User, X } from 'lucide-react';
import type { Agendamento } from '@/types';

interface AgendamentoCardProps {
	agendamento: Agendamento;
	onCancel?: (id: string) => void;
}

export function AgendamentoCard({
	agendamento,
	onCancel,
}: AgendamentoCardProps) {
	const {
		id,
		estabelecimento,
		servico,
		profissional,
		data,
		horario,
		preco,
		status,
	} = agendamento;

	const statusColors = {
		pendente:
			'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		confirmado:
			'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		cancelado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
		concluido:
			'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
	};

	const formatarData = (dataStr: string) => {
		const [ano, mes, dia] = dataStr.split('-');
		return `${dia}/${mes}/${ano}`;
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
			{/* Header com Status */}
			<div className="flex items-center justify-between mb-3">
				<span
					className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
				>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</span>
				{status === 'pendente' && onCancel && (
					<button
						onClick={() => onCancel(id)}
						className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
						aria-label="Cancelar agendamento"
					>
						<X className="w-5 h-5" />
					</button>
				)}
			</div>

			{/* Estabelecimento e Serviço */}
			<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
				{estabelecimento || 'Estabelecimento'}
			</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
				{servico}
			</p>

			{/* Informações */}
			<div className="space-y-2">
				{/* Data e Hora */}
				<div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
					<Calendar className="w-4 h-4 text-gray-500" />
					<span>{formatarData(data)}</span>
					<Clock className="w-4 h-4 text-gray-500 ml-2" />
					<span>{horario || '—'}</span>
				</div>

				{/* Profissional */}
				<div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
					<User className="w-4 h-4 text-gray-500" />
					<span>{profissional}</span>
				</div>

				{/* Valor */}
				<div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
					<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
						Valor:
					</span>
					<span className="text-lg font-bold text-gray-900 dark:text-white">
						R$ {parseFloat(preco).toFixed(2)}
					</span>
				</div>
			</div>
		</div>
	);
}
