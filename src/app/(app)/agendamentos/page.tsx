'use client';

/**
 * Página Meus Agendamentos - Lista todos os agendamentos do usuário
 * Refatorada com Clean Architecture
 */

import { useAgendamentos } from '@/hooks';
import { useSuccessToast } from '@/hooks/useSuccessToast';
import { useFilter, useFilteredData } from '@/hooks/useFilter';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { PageContainer, PageHeader, SuccessToast } from '@/components/ui/app';
import {
	AgendamentosFilters,
	AgendamentosList,
} from '@/components/features/agendamentos';
import { Calendar } from 'lucide-react';
import { AGENDAMENTO_STATUS } from '@/constants/app';

export default function AgendamentosPage() {
	const { agendamentos, loading, error, cancelarAgendamento } =
		useAgendamentos();
	const { mostrarSucesso, setMostrarSucesso } = useSuccessToast();
	const { filter, setFilter } = useFilter(AGENDAMENTO_STATUS.TODOS);
	const agendamentosFiltrados = useFilteredData(agendamentos, filter);

	const handleCancelar = async (id: string) => {
		if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
			const sucesso = await cancelarAgendamento(id);
			if (sucesso) {
				alert('Agendamento cancelado com sucesso!');
			} else {
				alert('Erro ao cancelar agendamento');
			}
		}
	};

	return (
		<PageContainer>
			<SuccessToast
				show={mostrarSucesso}
				title="Agendamento confirmado com sucesso!"
				message="Você receberá uma notificação antes do horário."
				onClose={() => setMostrarSucesso(false)}
			/>

			<PageHeader
				icon={Calendar}
				title="Meus Agendamentos"
				description="Gerencie seus agendamentos"
				iconColor="text-blue-500"
			/>

			<AgendamentosFilters
				activeFilter={filter}
				onFilterChange={setFilter}
			/>

			{loading && <LoadingSpinner />}
			{error && <ErrorMessage message={error} />}

			{!loading && !error && (
				<AgendamentosList
					agendamentos={agendamentosFiltrados}
					onCancel={handleCancelar}
				/>
			)}
		</PageContainer>
	);
}
