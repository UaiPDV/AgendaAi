import { Plus } from 'lucide-react';
import { ActionButton } from '@/components/ui/app';

interface AddPaymentButtonProps {
	onClick: () => void;
}

export function AddPaymentButton({ onClick }: AddPaymentButtonProps) {
	return (
		<ActionButton
			onClick={onClick}
			icon={Plus}
			variant="primary"
			fullWidth
			className="bg-indigo-500 hover:bg-indigo-600"
		>
			Adicionar Método de Pagamento
		</ActionButton>
	);
}
