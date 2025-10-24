'use client';

/**
 * Página Finanças - Resumo financeiro e transações
 * Refatorada com Clean Architecture
 */

import { useFinancas } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { PageContainer, PageHeader } from '@/components/ui/app';
import { FinancasStats, TransactionList } from '@/components/features/financas';
import { DollarSign } from 'lucide-react';

export default function FinancasPage() {
	const { transacoes, resumo, loading, error } = useFinancas();

	return (
		<PageContainer>
			<PageHeader
				icon={DollarSign}
				title="Minhas Finanças"
				description="Acompanhe seus gastos e pagamentos"
				iconColor="text-emerald-500"
			/>

			{loading && <LoadingSpinner />}
			{error && <ErrorMessage message={error} />}

			{!loading && !error && resumo && (
				<div className="max-w-7xl mx-auto space-y-6">
					<FinancasStats resumo={resumo} />
					<TransactionList transacoes={transacoes} />
				</div>
			)}
		</PageContainer>
	);
}
