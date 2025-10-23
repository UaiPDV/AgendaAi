/**
 * Modal para criar/editar serviço
 */

'use client';

import { useState, useEffect } from 'react';
import type { NovoServicoForm } from '@/types/estabelecimento';

interface NovoServicoModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: NovoServicoForm) => Promise<void>;
	servicoInicial?: Partial<NovoServicoForm>;
	titulo?: string;
}

export function NovoServicoModal({
	isOpen,
	onClose,
	onSave,
	servicoInicial,
	titulo = 'Novo Serviço',
}: NovoServicoModalProps) {
	const [formData, setFormData] = useState<NovoServicoForm>({
		nome: '',
		descricao: '',
		duracao: '60',
		preco: '',
		categoria: 'Beleza',
		icone: 'fas fa-cut',
		ativo: true,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (servicoInicial) {
			setFormData((prev) => ({ ...prev, ...servicoInicial }));
		}
	}, [servicoInicial]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			await onSave(formData);
			handleClose();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Erro ao salvar serviço'
			);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setFormData({
			nome: '',
			descricao: '',
			duracao: '60',
			preco: '',
			categoria: 'Beleza',
			icone: 'fas fa-cut',
			ativo: true,
		});
		setError(null);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="fixed inset-0 bg-black opacity-50"
				onClick={handleClose}
			></div>
			<div className="bg-white w-full max-w-lg mx-auto rounded-lg shadow-lg z-50 overflow-y-auto max-h-[90vh]">
				<div className="p-6">
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-xl font-bold text-gray-800">
							{titulo}
						</h3>
						<button
							onClick={handleClose}
							className="text-gray-400 hover:text-gray-600"
							type="button"
						>
							<i className="fas fa-times text-xl"></i>
						</button>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Nome do Serviço*
							</label>
							<input
								type="text"
								required
								value={formData.nome}
								onChange={(e) =>
									setFormData({
										...formData,
										nome: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Ex: Corte de Cabelo"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Descrição
							</label>
							<textarea
								rows={3}
								value={formData.descricao}
								onChange={(e) =>
									setFormData({
										...formData,
										descricao: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Descreva o serviço..."
							></textarea>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Duração (min)*
								</label>
								<input
									type="number"
									required
									min="1"
									value={formData.duracao}
									onChange={(e) =>
										setFormData({
											...formData,
											duracao: e.target.value,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Preço (R$)*
								</label>
								<input
									type="number"
									required
									min="0"
									step="0.01"
									value={formData.preco}
									onChange={(e) =>
										setFormData({
											...formData,
											preco: e.target.value,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Categoria
								</label>
								<select
									value={formData.categoria}
									onChange={(e) =>
										setFormData({
											...formData,
											categoria: e.target.value,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="Beleza">Beleza</option>
									<option value="Estética">Estética</option>
									<option value="Barbearia">Barbearia</option>
									<option value="Massagem">Massagem</option>
									<option value="Outros">Outros</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Ícone
								</label>
								<select
									value={formData.icone}
									onChange={(e) =>
										setFormData({
											...formData,
											icone: e.target.value,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="fas fa-cut">
										✂️ Tesoura
									</option>
									<option value="fas fa-paint-brush">
										🖌️ Pincel
									</option>
									<option value="fas fa-spa">💆 Spa</option>
									<option value="fas fa-hands">
										👐 Mãos
									</option>
									<option value="fas fa-concierge-bell">
										🔔 Sino
									</option>
								</select>
							</div>
						</div>

						<div className="flex items-center">
							<input
								type="checkbox"
								id="servico-ativo"
								checked={formData.ativo}
								onChange={(e) =>
									setFormData({
										...formData,
										ativo: e.target.checked,
									})
								}
								className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
							/>
							<label
								htmlFor="servico-ativo"
								className="ml-2 text-sm text-gray-700"
							>
								Serviço ativo
							</label>
						</div>

						<div className="flex gap-3 pt-4">
							<button
								type="button"
								onClick={handleClose}
								className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
								disabled={loading}
							>
								Cancelar
							</button>
							<button
								type="submit"
								className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
								disabled={loading}
							>
								{loading ? 'Salvando...' : 'Salvar'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
