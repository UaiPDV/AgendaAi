/**
 * Linha de Profissional na Tabela
 */

import type { ProfissionalDetalhado } from '@/types/estabelecimento';

interface ProfessionalRowProps {
	profissional: ProfissionalDetalhado;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

export function ProfessionalRow({
	profissional,
	onEdit,
	onDelete,
}: ProfessionalRowProps) {
	return (
		<tr className="hover:bg-gray-50">
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="flex items-center">
					<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
						{profissional.nome.charAt(0).toUpperCase()}
					</div>
					<div className="ml-4">
						<div className="text-sm font-medium text-gray-900">
							{profissional.nome}
						</div>
						{profissional.email && (
							<div className="text-sm text-gray-500">
								{profissional.email}
							</div>
						)}
					</div>
				</div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="text-sm text-gray-900">
					{profissional.telefone || '—'}
				</div>
			</td>
			<td className="px-6 py-4">
				<div className="flex flex-wrap gap-1">
					{profissional.especialidades &&
					profissional.especialidades.length > 0 ? (
						profissional.especialidades.map((esp, index) => (
							<span
								key={index}
								className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
							>
								{esp}
							</span>
						))
					) : (
						<span className="text-sm text-gray-400">Nenhuma</span>
					)}
				</div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				{profissional.ativo !== false ? (
					<span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
						Ativo
					</span>
				) : (
					<span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
						Inativo
					</span>
				)}
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
				<button
					onClick={() => onEdit(profissional.id)}
					className="text-blue-600 hover:text-blue-900 mr-3"
					title="Editar"
				>
					<i className="fas fa-edit"></i>
				</button>
				<button
					onClick={() => onDelete(profissional.id)}
					className="text-red-600 hover:text-red-900"
					title="Excluir"
				>
					<i className="fas fa-trash"></i>
				</button>
			</td>
		</tr>
	);
}
