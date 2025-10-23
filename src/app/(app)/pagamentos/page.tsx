'use client';

/**
 * Página Formas de Pagamento - Gerenciar métodos de pagamento
 */

import { usePagamentos } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { CreditCard, Trash2, Plus, Star } from 'lucide-react';

export default function PagamentosPage() {
	const { metodos, loading, error, removerMetodo } = usePagamentos();

	const handleRemover = async (id: string) => {
		if (
			confirm('Tem certeza que deseja remover este método de pagamento?')
		) {
			const sucesso = await removerMetodo(id);
			if (sucesso) {
				alert('Método removido com sucesso!');
			} else {
				alert('Erro ao remover método');
			}
		}
	};

	const tipoIcons: Record<string, string> = {
		'cartao-credito': '💳',
		'cartao-debito': '💳',
		pix: '📱',
		dinheiro: '💵',
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			{/* Header */}
			<div className="max-w-4xl mx-auto mb-8">
				<div className="flex items-center gap-3 mb-2">
					<CreditCard className="w-8 h-8 text-indigo-500" />
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Formas de Pagamento
					</h1>
				</div>
				<p className="text-gray-600 dark:text-gray-400">
					Gerencie seus métodos de pagamento
				</p>
			</div>

			{/* Loading State */}
			{loading && <LoadingSpinner />}

			{/* Error State */}
			{error && <ErrorMessage message={error} />}

			{/* Lista de Métodos */}
			{!loading && !error && (
				<div className="max-w-4xl mx-auto space-y-6">
					{/* Botão Adicionar */}
					<button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors">
						<Plus className="w-5 h-5" />
						Adicionar Método de Pagamento
					</button>

					{/* Lista */}
					{metodos.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-600 dark:text-gray-400">
								Nenhum método de pagamento cadastrado
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{metodos.map((metodo) => (
								<div
									key={metodo.id}
									className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-between"
								>
									<div className="flex items-center gap-4">
										{/* Ícone do Tipo */}
										<div className="text-4xl">
											{tipoIcons[metodo.tipo] || '💳'}
										</div>

										{/* Informações */}
										<div>
											<div className="flex items-center gap-2">
												<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
													{metodo.descricao}
												</h3>
												{metodo.principal && (
													<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
												)}
											</div>
											{metodo.numero && (
												<p className="text-sm text-gray-600 dark:text-gray-400">
													•••• {metodo.numero}
												</p>
											)}
											{metodo.validade && (
												<p className="text-sm text-gray-600 dark:text-gray-400">
													Validade: {metodo.validade}
												</p>
											)}
										</div>
									</div>

									{/* Botão Remover */}
									<button
										onClick={() => handleRemover(metodo.id)}
										className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
										aria-label="Remover método"
									>
										<Trash2 className="w-5 h-5" />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
