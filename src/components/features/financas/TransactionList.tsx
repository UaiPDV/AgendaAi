import { EmptyState } from '@/components/ui/app';
import { TransactionItem } from './TransactionItem';
import type { Transacao } from '@/types';

interface TransactionListProps {
	transacoes: Transacao[];
}

export function TransactionList({ transacoes }: TransactionListProps) {
	if (transacoes.length === 0) {
		return <EmptyState message="Nenhuma transação encontrada" />;
	}

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
				Histórico de Transações
			</h2>

			<div className="space-y-4">
				{transacoes.map((transacao) => (
					<TransactionItem key={transacao.id} transacao={transacao} />
				))}
			</div>
		</div>
	);
}
