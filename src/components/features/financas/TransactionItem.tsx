import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatarMoeda, formatarData } from '@/lib/utils/formatters';
import type { Transacao } from '@/types';

interface TransactionItemProps {
	transacao: Transacao;
}

const statusIcons = {
	pago: <CheckCircle className="w-5 h-5 text-green-500" />,
	pendente: <Clock className="w-5 h-5 text-yellow-500" />,
	cancelado: <XCircle className="w-5 h-5 text-red-500" />,
};

export function TransactionItem({ transacao }: TransactionItemProps) {
	return (
		<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
			<div className="flex items-center gap-4">
				{statusIcons[transacao.status]}
				<div>
					<p className="font-medium text-gray-900 dark:text-white">
						{transacao.descricao}
					</p>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{formatarData(transacao.data)}
					</p>
				</div>
			</div>
			<div className="text-right">
				<p className="text-lg font-bold text-gray-900 dark:text-white">
					{formatarMoeda(transacao.valor)}
				</p>
				<p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
					{transacao.status}
				</p>
			</div>
		</div>
	);
}
