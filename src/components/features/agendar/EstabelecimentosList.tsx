import { EstabelecimentoCard } from '@/components/ui';
import { GridContainer, EmptyState } from '@/components/ui/app';
import type { Estabelecimento } from '@/types';

interface EstabelecimentosListProps {
	estabelecimentos: Estabelecimento[];
	searchQuery?: string;
}

export function EstabelecimentosList({
	estabelecimentos,
	searchQuery = '',
}: EstabelecimentosListProps) {
	if (estabelecimentos.length === 0) {
		const message = searchQuery
			? 'Nenhum estabelecimento encontrado'
			: 'Nenhum estabelecimento disponível';
		return <EmptyState message={message} />;
	}

	return (
		<GridContainer columns={3}>
			{estabelecimentos.map((estabelecimento) => (
				<EstabelecimentoCard
					key={estabelecimento.id}
					estabelecimento={estabelecimento}
				/>
			))}
		</GridContainer>
	);
}
