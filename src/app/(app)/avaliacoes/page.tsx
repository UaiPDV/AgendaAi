'use client';

/**
 * Página Avaliações - Avaliar serviços recebidos
 * Refatorada com Clean Architecture
 */

import { useAvaliacoes } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { PageContainer, PageHeader, EmptyState } from '@/components/ui/app';
import { AvaliacaoItem } from '@/components/features/avaliacoes';
import { Star } from 'lucide-react';
import { useState } from 'react';

export default function AvaliacoesPage() {
	const { avaliacoes, loading, error, avaliar } = useAvaliacoes();
	const [avaliacaoAtual, setAvaliacaoAtual] = useState<string | null>(null);
	const [nota, setNota] = useState(0);
	const [comentario, setComentario] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const handleAvaliar = async (id: string) => {
		if (nota === 0) {
			alert('Por favor, selecione uma nota');
			return;
		}

		setSubmitting(true);
		const sucesso = await avaliar(id, nota, comentario);
		setSubmitting(false);

		if (sucesso) {
			alert('Avaliação enviada com sucesso!');
			resetForm();
		} else {
			alert('Erro ao enviar avaliação');
		}
	};

	const resetForm = () => {
		setAvaliacaoAtual(null);
		setNota(0);
		setComentario('');
	};

	return (
		<PageContainer>
			<PageHeader
				icon={Star}
				title="Avaliações"
				description="Avalie os serviços que você recebeu"
				iconColor="text-amber-500"
			/>

			{loading && <LoadingSpinner />}
			{error && <ErrorMessage message={error} />}

			{!loading && !error && (
				<div className="max-w-4xl mx-auto space-y-4">
					{avaliacoes.length === 0 ? (
						<EmptyState message="Nenhuma avaliação pendente" />
					) : (
						avaliacoes.map((avaliacao) => (
							<AvaliacaoItem
								key={avaliacao.id}
								avaliacao={avaliacao}
								isEditing={avaliacaoAtual === avaliacao.id}
								nota={nota}
								comentario={comentario}
								onNotaChange={setNota}
								onComentarioChange={setComentario}
								onStartEdit={() =>
									setAvaliacaoAtual(avaliacao.id)
								}
								onSubmit={() => handleAvaliar(avaliacao.id)}
								onCancel={resetForm}
								loading={submitting}
							/>
						))
					)}
				</div>
			)}
		</PageContainer>
	);
}
