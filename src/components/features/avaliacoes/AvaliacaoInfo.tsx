import { formatarData } from '@/lib/utils/formatters';
import type { Avaliacao } from '@/types';
import { RatingStars } from './RatingStars';

interface AvaliacaoInfoProps {
	avaliacao: Avaliacao;
}

export function AvaliacaoInfo({ avaliacao }: AvaliacaoInfoProps) {
	return (
		<div className="mb-4">
			<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
				{avaliacao.servicoNome}
			</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Profissional: {avaliacao.profissionalNome}
			</p>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Data: {formatarData(avaliacao.data)}
			</p>
		</div>
	);
}

interface AvaliacaoAvaliadaProps {
	nota: number;
	comentario?: string;
}

export function AvaliacaoAvaliada({
	nota,
	comentario,
}: AvaliacaoAvaliadaProps) {
	return (
		<div className="border-t border-gray-200 dark:border-gray-700 pt-4">
			<div className="mb-2">
				<RatingStars rating={nota} readonly />
			</div>
			{comentario && (
				<p className="text-gray-700 dark:text-gray-300">{comentario}</p>
			)}
		</div>
	);
}
