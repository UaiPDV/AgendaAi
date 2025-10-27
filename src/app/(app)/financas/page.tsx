'use client';

/**
 * Página Finanças - Resumo financeiro e transações
 * Refatorada com Clean Architecture
 */

import { useFinancas, useAgendamentos } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { PageContainer, PageHeader } from '@/components/ui/app';
import { FinancasStats, TransactionList } from '@/components/features/financas';
import { DollarSign } from 'lucide-react';
import type { ResumoFinanceiro, Transacao } from '@/types';

export default function FinancasPage() {
	const { data, loading, error } = useFinancas();
	const { agendamentos, loading: loadingAgendamentos } = useAgendamentos();

	// Converte agendamentos pagos em transações
	const transacoes: Transacao[] = agendamentos
		.filter((a) => a.status === 'concluido')
		.map((a) => ({
			id: a.id,
			descricao: a.servico,
			valor: parseFloat(a.preco),
			data: a.data,
			status: 'pago' as const,
			servico: a.servico,
		}));

	// Cria resumo financeiro mock se não existir
	const resumo: ResumoFinanceiro =
		data?.tipo === 'cliente'
			? {
					gastoMes: data.gastoMes,
					gastoPendente: data.pagamentosPendentes,
					proximoPagamento: {
						valor: data.pagamentosPendentes,
						data: new Date().toISOString(),
					},
			  }
			: {
					gastoMes: 0,
					gastoPendente: 0,
					proximoPagamento: {
						valor: 0,
						data: new Date().toISOString(),
					},
			  };

	const isLoading = loading || loadingAgendamentos;

	return (
		<PageContainer>
			<PageHeader
				icon={DollarSign}
				title="Minhas Finanças"
				description="Acompanhe seus gastos e pagamentos"
				iconColor="text-emerald-500"
			/>

			{isLoading && <LoadingSpinner />}
			{error && <ErrorMessage message={error} />}

			{!isLoading && !error && data && (
				<div className="max-w-7xl mx-auto space-y-6">
					<FinancasStats resumo={resumo} />
					<TransactionList transacoes={transacoes} />
				</div>
			)}
		</PageContainer>
	);
}
