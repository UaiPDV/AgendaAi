'use client';

/**
 * Página de Agendamento - Lista estabelecimentos disponíveis
 * Refatorada com Clean Architecture
 */

import { useEstabelecimentos } from '@/hooks';
import { useSearch } from '@/hooks/useSearch';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { PageContainer, PageHeader, SearchBar } from '@/components/ui/app';
import { EstabelecimentosList } from '@/components/features/agendar';
import { Calendar } from 'lucide-react';

export default function Agendar() {
	const { estabelecimentos, loading, error } = useEstabelecimentos();
	const { searchQuery, setSearchQuery, filteredData } = useSearch(
		estabelecimentos,
		'nome'
	);

	return (
		<PageContainer>
			<PageHeader
				icon={Calendar}
				title="Agendar Serviço"
				description="Escolha um estabelecimento para começar"
				iconColor="text-blue-500"
			/>

			<SearchBar
				placeholder="Buscar estabelecimentos..."
				value={searchQuery}
				onChange={setSearchQuery}
			/>

			{loading && <LoadingSpinner />}
			{error && <ErrorMessage message={error} />}

			{!loading && !error && (
				<EstabelecimentosList
					estabelecimentos={filteredData}
					searchQuery={searchQuery}
				/>
			)}
		</PageContainer>
	);
}
