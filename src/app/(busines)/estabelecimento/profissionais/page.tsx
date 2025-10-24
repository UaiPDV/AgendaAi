'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, AlertCircle, Users } from 'lucide-react';
import { LoadingSpinner, ConfirmDialog } from '@/components/ui';
import { useProfissionais } from '@/hooks';
import type { Profissional } from '@/types';

export default function ProfissionaisPage() {
	const {
		profissionais,
		loading,
		error,
		criarProfissional,
		atualizarProfissional,
		excluirProfissional,
		recarregar,
	} = useProfissionais();

	const [showModal, setShowModal] = useState(false);
	const [editingProfissional, setEditingProfissional] =
		useState<Profissional | null>(null);
	const [profissionalToDelete, setProfissionalToDelete] = useState<
		string | null
	>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const [formData, setFormData] = useState({
		nome: '',
		telefone: '',
		especialidades: '',
	});

	const [submitLoading, setSubmitLoading] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitError(null);
		setSubmitLoading(true);

		try {
			const especialidadesArray = formData.especialidades
				.split(',')
				.map((e) => e.trim())
				.filter((e) => e.length > 0);

			const profissionalData = {
				nome: formData.nome,
				telefone: formData.telefone || '',
				especialidades:
					especialidadesArray.length > 0 ? especialidadesArray : [],
			};

			if (editingProfissional) {
				// Atualizar profissional existente
				await atualizarProfissional(
					editingProfissional.id,
					profissionalData
				);
			} else {
				// Criar novo profissional
				await criarProfissional(profissionalData);
			}

			handleCloseModal();
			recarregar();
		} catch (error) {
			setSubmitError(
				error instanceof Error
					? error.message
					: 'Erro ao salvar profissional'
			);
		} finally {
			setSubmitLoading(false);
		}
	};

	const handleEdit = (profissional: Profissional) => {
		setEditingProfissional(profissional);
		setFormData({
			nome: profissional.nome,
			telefone: profissional.telefone || '',
			especialidades: profissional.especialidades?.join(', ') || '',
		});
		setShowModal(true);
	};

	const handleDelete = (id: string) => {
		setProfissionalToDelete(id);
	};

	const confirmDelete = async () => {
		if (!profissionalToDelete) return;

		setDeleteLoading(true);
		try {
			await excluirProfissional(profissionalToDelete);
			setProfissionalToDelete(null);
			recarregar();
		} catch (error) {
			console.error('Erro ao excluir profissional:', error);
		} finally {
			setDeleteLoading(false);
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingProfissional(null);
		setSubmitError(null);
		setFormData({
			nome: '',
			telefone: '',
			especialidades: '',
		});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<LoadingSpinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
				{error}
			</div>
		);
	}

	return (
		<div className="animate-fade-in p-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
						Profissionais
					</h1>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
						Gerencie os profissionais do seu estabelecimento
					</p>
				</div>
				<button
					onClick={() => setShowModal(true)}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
				>
					<Plus size={20} />
					Novo Profissional
				</button>
			</div>

			{/* Lista de Profissionais */}
			{profissionais.length === 0 ? (
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
					<div className="flex justify-center mb-4">
						<div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
							<Users
								size={48}
								className="text-gray-400 dark:text-gray-500"
							/>
						</div>
					</div>
					<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
						Nenhum profissional cadastrado
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
						Comece adicionando os profissionais que trabalham no seu
						estabelecimento para gerenciar melhor seus agendamentos.
					</p>
					<button
						onClick={() => setShowModal(true)}
						className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
					>
						<Plus size={20} />
						Adicionar Primeiro Profissional
					</button>
				</div>
			) : (
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
					{/* Tabela Desktop */}
					<div className="hidden md:block overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Nome
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Telefone
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Especialidades
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Ações
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
								{profissionais.map((profissional) => (
									<tr
										key={profissional.id}
										className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900 dark:text-gray-100">
												{profissional.nome}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-600 dark:text-gray-400">
												{profissional.telefone || '—'}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-600 dark:text-gray-400">
												{profissional.especialidades &&
												profissional.especialidades
													.length > 0 ? (
													<div className="flex flex-wrap gap-1">
														{profissional.especialidades.map(
															(esp, idx) => (
																<span
																	key={idx}
																	className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
																>
																	{esp}
																</span>
															)
														)}
													</div>
												) : (
													'—'
												)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<button
												onClick={() =>
													handleEdit(profissional)
												}
												className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
											>
												<Pencil size={18} />
											</button>
											<button
												onClick={() =>
													handleDelete(
														profissional.id
													)
												}
												className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
											>
												<Trash2 size={18} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Cards Mobile */}
					<div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
						{profissionais.map((profissional) => (
							<div
								key={profissional.id}
								className="p-4 space-y-3"
							>
								<div className="flex justify-between items-start">
									<div className="flex-1">
										<h3 className="font-medium text-gray-900 dark:text-gray-100">
											{profissional.nome}
										</h3>
										{profissional.telefone && (
											<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
												{profissional.telefone}
											</p>
										)}
										{profissional.especialidades &&
											profissional.especialidades.length >
												0 && (
												<div className="flex flex-wrap gap-1 mt-2">
													{profissional.especialidades.map(
														(esp, idx) => (
															<span
																key={idx}
																className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
															>
																{esp}
															</span>
														)
													)}
												</div>
											)}
									</div>
									<div className="flex gap-2 ml-4">
										<button
											onClick={() =>
												handleEdit(profissional)
											}
											className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition-colors"
										>
											<Pencil size={18} />
										</button>
										<button
											onClick={() =>
												handleDelete(profissional.id)
											}
											className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded transition-colors"
										>
											<Trash2 size={18} />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Modal Novo/Editar Profissional */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
					<div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
									{editingProfissional
										? 'Editar Profissional'
										: 'Novo Profissional'}
								</h3>
								<button
									onClick={handleCloseModal}
									className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
								>
									<Plus size={24} className="rotate-45" />
								</button>
							</div>

							<form onSubmit={handleSubmit} className="space-y-4">
								{submitError && (
									<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
										<AlertCircle size={16} />
										<span>{submitError}</span>
									</div>
								)}

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Nome Completo *
									</label>
									<input
										type="text"
										value={formData.nome}
										onChange={(e) =>
											setFormData({
												...formData,
												nome: e.target.value,
											})
										}
										required
										disabled={submitLoading}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
										placeholder="Ex: João Silva"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Telefone
									</label>
									<input
										type="tel"
										value={formData.telefone}
										onChange={(e) =>
											setFormData({
												...formData,
												telefone: e.target.value,
											})
										}
										disabled={submitLoading}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
										placeholder="(11) 98888-8888"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Especialidades
									</label>
									<input
										type="text"
										value={formData.especialidades}
										onChange={(e) =>
											setFormData({
												...formData,
												especialidades: e.target.value,
											})
										}
										disabled={submitLoading}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
										placeholder="Ex: Corte, Barba, Coloração (separadas por vírgula)"
									/>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										Separe múltiplas especialidades com
										vírgula
									</p>
								</div>

								<div className="flex gap-3 pt-4">
									<button
										type="button"
										onClick={handleCloseModal}
										disabled={submitLoading}
										className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Cancelar
									</button>
									<button
										type="submit"
										disabled={submitLoading}
										className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									>
										{submitLoading ? (
											<>
												<LoadingSpinner />
												{editingProfissional
													? 'Atualizando...'
													: 'Salvando...'}
											</>
										) : (
											<>
												{editingProfissional
													? 'Atualizar Profissional'
													: 'Salvar Profissional'}
											</>
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{/* Dialog de Confirmação de Exclusão */}
			<ConfirmDialog
				isOpen={profissionalToDelete !== null}
				onClose={() => setProfissionalToDelete(null)}
				onConfirm={confirmDelete}
				title="Excluir Profissional"
				message="Tem certeza que deseja excluir este profissional? Esta ação não pode ser desfeita e removerá todos os agendamentos associados."
				confirmText="Excluir"
				type="danger"
				isLoading={deleteLoading}
			/>
		</div>
	);
}
