/**
 * Card de Serviço
 */

import type { ServicoDetalhado } from '@/types/estabelecimento';

interface ServiceCardProps {
	servico: ServicoDetalhado;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

export function ServiceCard({ servico, onEdit, onDelete }: ServiceCardProps) {
	return (
		<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-4 flex-1">
					<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
						<i
							className={`${
								servico.icone || 'fas fa-concierge-bell'
							} text-blue-600 text-xl`}
						></i>
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-gray-800">
							{servico.nome}
						</h3>
						<p className="text-sm text-gray-500 mt-1">
							{servico.descricao}
						</p>
						<div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
							<span className="flex items-center gap-1">
								<i className="fas fa-clock"></i>
								{servico.duracao} min
							</span>
							<span className="flex items-center gap-1">
								<i className="fas fa-money-bill-wave"></i>
								R$ {servico.preco}
							</span>
							{servico.categoria && (
								<span className="px-2 py-1 bg-gray-100 rounded text-xs">
									{servico.categoria}
								</span>
							)}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{servico.ativo !== false && (
						<span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
							Ativo
						</span>
					)}
					<button
						onClick={() => onEdit(servico.id)}
						className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
						title="Editar"
					>
						<i className="fas fa-edit"></i>
					</button>
					<button
						onClick={() => onDelete(servico.id)}
						className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
						title="Excluir"
					>
						<i className="fas fa-trash"></i>
					</button>
				</div>
			</div>
		</div>
	);
}
