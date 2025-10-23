/**
 * Card de Serviço
 */

import { Clock, DollarSign } from 'lucide-react';
import type { Servico } from '@/types';

interface ServicoCardProps {
	servico: Servico;
	onClick?: (servico: Servico) => void;
}

export function ServicoCard({ servico, onClick }: ServicoCardProps) {
	const { nome, descricao, preco, duracao } = servico;

	return (
		<div
			onClick={() => onClick?.(servico)}
			className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
		>
			{/* Nome e Descrição */}
			<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
				{nome}
			</h3>
			{descricao && (
				<p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
					{descricao}
				</p>
			)}

			{/* Informações */}
			<div className="flex items-center justify-between">
				{/* Duração */}
				<div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
					<Clock className="w-4 h-4 text-gray-500" />
					<span>{duracao} min</span>
				</div>

				{/* Preço */}
				<div className="flex items-center gap-1 text-lg font-bold text-gray-900 dark:text-white">
					<DollarSign className="w-5 h-5" />
					<span>R$ {parseFloat(preco).toFixed(2)}</span>
				</div>
			</div>
		</div>
	);
}
