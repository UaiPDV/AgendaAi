import { MessageSquare } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { ActionButton } from '@/components/ui/app';

interface AvaliacaoFormProps {
	nota: number;
	comentario: string;
	onNotaChange: (nota: number) => void;
	onComentarioChange: (comentario: string) => void;
	onSubmit: () => void;
	onCancel: () => void;
	loading?: boolean;
}

export function AvaliacaoForm({
	nota,
	comentario,
	onNotaChange,
	onComentarioChange,
	onSubmit,
	onCancel,
	loading = false,
}: AvaliacaoFormProps) {
	return (
		<div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
			{/* Seletor de Estrelas */}
			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Sua Nota
				</label>
				<RatingStars
					rating={nota}
					onRatingChange={onNotaChange}
					size="lg"
				/>
			</div>

			{/* Comentário */}
			<div>
				<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					<MessageSquare className="w-4 h-4" />
					Comentário (opcional)
				</label>
				<textarea
					value={comentario}
					onChange={(e) => onComentarioChange(e.target.value)}
					rows={3}
					className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
					placeholder="Conte-nos sobre sua experiência..."
				/>
			</div>

			{/* Botões */}
			<div className="flex gap-3">
				<ActionButton
					onClick={onSubmit}
					variant="primary"
					fullWidth
					loading={loading}
					className="bg-amber-500 hover:bg-amber-600"
				>
					Enviar Avaliação
				</ActionButton>
				<ActionButton onClick={onCancel} variant="secondary">
					Cancelar
				</ActionButton>
			</div>
		</div>
	);
}
