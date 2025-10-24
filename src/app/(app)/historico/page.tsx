'use client';

/**
 * Página Histórico - Lista agendamentos passados
 * Refatorada com Clean Architecture
 */

import { useAgendamentos } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { PageContainer, PageHeader } from '@/components/ui/app';
import { AgendamentosList } from '@/components/features/agendamentos';
import { History } from 'lucide-react';
import { useMemo } from 'react';

export default function HistoricoPage() {
	const { agendamentos, loading, error } = useAgendamentos();

	// Filtrar apenas agendamentos concluídos ou cancelados
	const historico = useMemo(
		() =>
			agendamentos.filter(
				(agend) =>
					agend.status === 'concluido' || agend.status === 'cancelado'
			),
		[agendamentos]
	);

	return (
		<PageContainer>
			<PageHeader
				icon={History}
				title="Histórico"
				description="Seus agendamentos anteriores"
				iconColor="text-purple-500"
			/>

			{loading && <LoadingSpinner />}
			{error && <ErrorMessage message={error} />}

			{!loading && !error && (
				<AgendamentosList
					agendamentos={historico}
					emptyMessage="Nenhum agendamento no histórico"
				/>
			)}
		</PageContainer>
	);
}
