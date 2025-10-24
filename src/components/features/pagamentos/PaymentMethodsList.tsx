import { EmptyState } from '@/components/ui/app';
import { PaymentMethodCard } from './PaymentMethodCard';
import type { MetodoPagamento } from '@/types';

interface PaymentMethodsListProps {
	metodos: MetodoPagamento[];
	onRemove: (id: string) => void;
}

export function PaymentMethodsList({
	metodos,
	onRemove,
}: PaymentMethodsListProps) {
	if (metodos.length === 0) {
		return <EmptyState message="Nenhum método de pagamento cadastrado" />;
	}

	return (
		<div className="space-y-4">
			{metodos.map((metodo) => (
				<PaymentMethodCard
					key={metodo.id}
					metodo={metodo}
					onRemove={onRemove}
				/>
			))}
		</div>
	);
}
