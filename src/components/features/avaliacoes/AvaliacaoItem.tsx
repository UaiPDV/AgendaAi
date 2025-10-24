import type { Avaliacao } from '@/types';
import { AvaliacaoInfo, AvaliacaoAvaliada } from './AvaliacaoInfo';
import { AvaliacaoForm } from './AvaliacaoForm';
import { ActionButton } from '@/components/ui/app';

interface AvaliacaoItemProps {
	avaliacao: Avaliacao;
	isEditing: boolean;
	nota: number;
	comentario: string;
	onNotaChange: (nota: number) => void;
	onComentarioChange: (comentario: string) => void;
	onStartEdit: () => void;
	onSubmit: () => void;
	onCancel: () => void;
	loading?: boolean;
}

export function AvaliacaoItem({
	avaliacao,
	isEditing,
	nota,
	comentario,
	onNotaChange,
	onComentarioChange,
	onStartEdit,
	onSubmit,
	onCancel,
	loading = false,
}: AvaliacaoItemProps) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<AvaliacaoInfo avaliacao={avaliacao} />

			{avaliacao.avaliado ? (
				<AvaliacaoAvaliada
					nota={avaliacao.nota || 0}
					comentario={avaliacao.comentario}
				/>
			) : isEditing ? (
				<AvaliacaoForm
					nota={nota}
					comentario={comentario}
					onNotaChange={onNotaChange}
					onComentarioChange={onComentarioChange}
					onSubmit={onSubmit}
					onCancel={onCancel}
					loading={loading}
				/>
			) : (
				<div className="border-t border-gray-200 dark:border-gray-700 pt-4">
					<ActionButton
						onClick={onStartEdit}
						variant="primary"
						fullWidth
						className="bg-amber-500 hover:bg-amber-600"
					>
						Avaliar Agora
					</ActionButton>
				</div>
			)}
		</div>
	);
}
