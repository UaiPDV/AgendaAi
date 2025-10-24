import { Trash2, Star } from 'lucide-react';
import { TIPO_PAGAMENTO_ICONS } from '@/constants/app';
import type { MetodoPagamento } from '@/types';

interface PaymentMethodCardProps {
	metodo: MetodoPagamento;
	onRemove: (id: string) => void;
}

export function PaymentMethodCard({
	metodo,
	onRemove,
}: PaymentMethodCardProps) {
	const icon =
		TIPO_PAGAMENTO_ICONS[
			metodo.tipo as keyof typeof TIPO_PAGAMENTO_ICONS
		] || '💳';

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-between">
			<div className="flex items-center gap-4">
				{/* Ícone do Tipo */}
				<div className="text-4xl">{icon}</div>

				{/* Informações */}
				<div>
					<div className="flex items-center gap-2">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							{metodo.descricao}
						</h3>
						{metodo.principal && (
							<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
						)}
					</div>
					{metodo.numero && (
						<p className="text-sm text-gray-600 dark:text-gray-400">
							•••• {metodo.numero}
						</p>
					)}
					{metodo.validade && (
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Validade: {metodo.validade}
						</p>
					)}
				</div>
			</div>

			{/* Botão Remover */}
			<button
				onClick={() => onRemove(metodo.id)}
				className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
				aria-label="Remover método"
			>
				<Trash2 className="w-5 h-5" />
			</button>
		</div>
	);
}
