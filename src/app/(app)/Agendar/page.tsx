'use client';

/**
 * Página de Agendamento - Lista estabelecimentos disponíveis
 */

import { useEstabelecimentos } from '@/hooks';
import {
	EstabelecimentoCard,
	LoadingSpinner,
	ErrorMessage,
} from '@/components/ui';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Agendar() {
	const { estabelecimentos, loading, error } = useEstabelecimentos();
	const [searchQuery, setSearchQuery] = useState('');

	// Filtrar estabelecimentos pela pesquisa
	const estabelecimentosFiltrados = estabelecimentos.filter((est) =>
		est.nome.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			{/* Header */}
			<div className="max-w-7xl mx-auto mb-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					Agendar Serviço
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Escolha um estabelecimento para começar
				</p>
			</div>

			{/* Barra de Pesquisa */}
			<div className="max-w-7xl mx-auto mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Buscar estabelecimentos..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			{/* Loading State */}
			{loading && <LoadingSpinner />}

			{/* Error State */}
			{error && <ErrorMessage message={error} />}

			{/* Lista de Estabelecimentos */}
			{!loading && !error && (
				<div className="max-w-7xl mx-auto">
					{estabelecimentosFiltrados.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-600 dark:text-gray-400">
								{searchQuery
									? 'Nenhum estabelecimento encontrado'
									: 'Nenhum estabelecimento disponível'}
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{estabelecimentosFiltrados.map(
								(estabelecimento) => (
									<EstabelecimentoCard
										key={estabelecimento.id}
										estabelecimento={estabelecimento}
									/>
								)
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
