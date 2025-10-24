import { useState, useMemo } from 'react';

/**
 * Hook para gerenciar pesquisa em lista
 */
export function useSearch<T>(
	data: T[],
	searchKey: keyof T
): {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	filteredData: T[];
} {
	const [searchQuery, setSearchQuery] = useState('');

	const filteredData = useMemo(() => {
		if (!searchQuery) return data;

		return data.filter((item) => {
			const value = item[searchKey];
			if (typeof value === 'string') {
				return value.toLowerCase().includes(searchQuery.toLowerCase());
			}
			return false;
		});
	}, [data, searchQuery, searchKey]);

	return {
		searchQuery,
		setSearchQuery,
		filteredData,
	};
}
