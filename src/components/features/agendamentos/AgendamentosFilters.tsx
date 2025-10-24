import { FilterButtons } from '@/components/ui/app';
import { AGENDAMENTO_STATUS, AGENDAMENTO_STATUS_LABELS } from '@/constants/app';

interface AgendamentosFiltersProps {
	activeFilter: string;
	onFilterChange: (filter: string) => void;
}

export function AgendamentosFilters({
	activeFilter,
	onFilterChange,
}: AgendamentosFiltersProps) {
	const filterOptions = Object.values(AGENDAMENTO_STATUS).map((status) => ({
		value: status,
		label: AGENDAMENTO_STATUS_LABELS[status],
	}));

	return (
		<FilterButtons
			options={filterOptions}
			activeFilter={activeFilter}
			onFilterChange={onFilterChange}
		/>
	);
}
