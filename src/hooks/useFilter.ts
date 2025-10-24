import { useState, useMemo } from 'react';

/**
 * Hook para gerenciar filtros de lista
 */
export function useFilter<T extends string>(defaultFilter: T) {
	const [filter, setFilter] = useState<string>(defaultFilter);

	return {
		filter,
		setFilter: (newFilter: string) => setFilter(newFilter),
	};
}

/**
 * Hook para filtrar dados por status
 */
export function useFilteredData<T extends { status?: string }>(
	data: T[],
	filter: string,
	allFilterValue: string = 'todos'
) {
	return useMemo(() => {
		if (filter === allFilterValue) return data;
		return data.filter((item) => item.status === filter);
	}, [data, filter, allFilterValue]);
}
