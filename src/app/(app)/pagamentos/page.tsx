'use client';

/**
 * Página Formas de Pagamento - Gerenciar métodos de pagamento
 * Refatorada com Clean Architecture
 */

import { usePagamentos } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { PageContainer, PageHeader } from '@/components/ui/app';
import {
	AddPaymentButton,
	PaymentMethodsList,
} from '@/components/features/pagamentos';
import { CreditCard } from 'lucide-react';

export default function PagamentosPage() {
	const { metodos, loading, error, removerMetodo } = usePagamentos();

	const handleRemover = async (id: string) => {
		if (
			confirm('Tem certeza que deseja remover este método de pagamento?')
		) {
			const sucesso = await removerMetodo(id);
			if (sucesso) {
				alert('Método removido com sucesso!');
			} else {
				alert('Erro ao remover método');
			}
		}
	};

	const handleAdicionarMetodo = () => {
		// TODO: Implementar modal/página de adicionar método
		alert('Funcionalidade em desenvolvimento');
	};

	return (
		<PageContainer>
			<PageHeader
				icon={CreditCard}
				title="Formas de Pagamento"
				description="Gerencie seus métodos de pagamento"
				iconColor="text-indigo-500"
			/>

			{loading && <LoadingSpinner />}
			{error && <ErrorMessage message={error} />}

			{!loading && !error && (
				<div className="max-w-4xl mx-auto space-y-6">
					<AddPaymentButton onClick={handleAdicionarMetodo} />
					<PaymentMethodsList
						metodos={metodos}
						onRemove={handleRemover}
					/>
				</div>
			)}
		</PageContainer>
	);
}
