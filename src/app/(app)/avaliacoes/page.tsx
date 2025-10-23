'use client';

/**
 * Página Avaliações - Avaliar serviços recebidos
 */

import { useAvaliacoes } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { Star, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function AvaliacoesPage() {
	const { avaliacoes, loading, error, avaliar } = useAvaliacoes();
	const [avaliacaoAtual, setAvaliacaoAtual] = useState<string | null>(null);
	const [nota, setNota] = useState(0);
	const [comentario, setComentario] = useState('');

	const handleAvaliar = async (id: string) => {
		if (nota === 0) {
			alert('Por favor, selecione uma nota');
			return;
		}

		const sucesso = await avaliar(id, nota, comentario);
		if (sucesso) {
			alert('Avaliação enviada com sucesso!');
			setAvaliacaoAtual(null);
			setNota(0);
			setComentario('');
		} else {
			alert('Erro ao enviar avaliação');
		}
	};

	const formatarData = (dataStr: string) => {
		const [ano, mes, dia] = dataStr.split('-');
		return `${dia}/${mes}/${ano}`;
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			{/* Header */}
			<div className="max-w-4xl mx-auto mb-8">
				<div className="flex items-center gap-3 mb-2">
					<Star className="w-8 h-8 text-amber-500" />
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Avaliações
					</h1>
				</div>
				<p className="text-gray-600 dark:text-gray-400">
					Avalie os serviços que você recebeu
				</p>
			</div>

			{/* Loading State */}
			{loading && <LoadingSpinner />}

			{/* Error State */}
			{error && <ErrorMessage message={error} />}

			{/* Lista de Avaliações */}
			{!loading && !error && (
				<div className="max-w-4xl mx-auto space-y-4">
					{avaliacoes.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-600 dark:text-gray-400">
								Nenhuma avaliação pendente
							</p>
						</div>
					) : (
						avaliacoes.map((avaliacao) => (
							<div
								key={avaliacao.id}
								className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
							>
								{/* Informações do Serviço */}
								<div className="mb-4">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
										{avaliacao.servicoNome}
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Profissional:{' '}
										{avaliacao.profissionalNome}
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Data: {formatarData(avaliacao.data)}
									</p>
								</div>

								{/* Se já foi avaliado */}
								{avaliacao.avaliado ? (
									<div className="border-t border-gray-200 dark:border-gray-700 pt-4">
										<div className="flex items-center gap-1 mb-2">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={`w-5 h-5 ${
														star <=
														(avaliacao.nota || 0)
															? 'fill-amber-400 text-amber-400'
															: 'text-gray-300 dark:text-gray-600'
													}`}
												/>
											))}
										</div>
										{avaliacao.comentario && (
											<p className="text-gray-700 dark:text-gray-300">
												{avaliacao.comentario}
											</p>
										)}
									</div>
								) : avaliacaoAtual === avaliacao.id ? (
									/* Formulário de Avaliação */
									<div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
										{/* Seletor de Estrelas */}
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												Sua Nota
											</label>
											<div className="flex items-center gap-1">
												{[1, 2, 3, 4, 5].map((star) => (
													<button
														key={star}
														type="button"
														onClick={() =>
															setNota(star)
														}
														className="transition-transform hover:scale-110"
													>
														<Star
															className={`w-8 h-8 ${
																star <= nota
																	? 'fill-amber-400 text-amber-400'
																	: 'text-gray-300 dark:text-gray-600'
															}`}
														/>
													</button>
												))}
											</div>
										</div>

										{/* Comentário */}
										<div>
											<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												<MessageSquare className="w-4 h-4" />
												Comentário (opcional)
											</label>
											<textarea
												value={comentario}
												onChange={(e) =>
													setComentario(
														e.target.value
													)
												}
												rows={3}
												className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
												placeholder="Conte-nos sobre sua experiência..."
											/>
										</div>

										{/* Botões */}
										<div className="flex gap-3">
											<button
												onClick={() =>
													handleAvaliar(avaliacao.id)
												}
												className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
											>
												Enviar Avaliação
											</button>
											<button
												onClick={() => {
													setAvaliacaoAtual(null);
													setNota(0);
													setComentario('');
												}}
												className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
											>
												Cancelar
											</button>
										</div>
									</div>
								) : (
									/* Botão Avaliar */
									<div className="border-t border-gray-200 dark:border-gray-700 pt-4">
										<button
											onClick={() =>
												setAvaliacaoAtual(avaliacao.id)
											}
											className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
										>
											Avaliar Agora
										</button>
									</div>
								)}
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
}
