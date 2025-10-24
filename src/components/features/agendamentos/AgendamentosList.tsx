import { AgendamentoCard } from '@/components/ui';
import { GridContainer, EmptyState } from '@/components/ui/app';
import type { Agendamento } from '@/types';

interface AgendamentosListProps {
	agendamentos: Agendamento[];
	onCancel?: (id: string) => void;
	emptyMessage?: string;
}

export function AgendamentosList({
	agendamentos,
	onCancel,
	emptyMessage = 'Nenhum agendamento encontrado',
}: AgendamentosListProps) {
	if (agendamentos.length === 0) {
		return <EmptyState message={emptyMessage} />;
	}

	return (
		<GridContainer columns={3}>
			{agendamentos.map((agendamento) => (
				<AgendamentoCard
					key={agendamento.id}
					agendamento={agendamento}
					onCancel={onCancel}
				/>
			))}
		</GridContainer>
	);
}
