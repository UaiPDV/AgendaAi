'use client';

import { useState } from 'react';
import { useServicos } from '@/hooks';
import { LoadingSpinner, ConfirmDialog } from '@/components/ui';
import type { Servico } from '@/types';
import {
	Briefcase,
	Plus,
	Edit2,
	Trash2,
	Clock,
	DollarSign,
	Scissors,
	Palette,
	Heart,
	Sparkles,
	AlertCircle,
} from 'lucide-react';

// Ícones para categorias de serviços
const servicoIcons: Record<string, React.ReactNode> = {
	corte: <Scissors size={24} className="text-white" />,
	pintura: <Palette size={24} className="text-white" />,
	beleza: <Sparkles size={24} className="text-white" />,
	tratamento: <Heart size={24} className="text-white" />,
	default: <Briefcase size={24} className="text-white" />,
};

export default function ServicosPage() {
	const {
		servicos,
		loading,
		error,
		criarServico,
		atualizarServico,
		excluirServico,
	} = useServicos();

	const [showModal, setShowModal] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [editingServico, setEditingServico] = useState<Servico | null>(null);
	const [servicoToDelete, setServicoToDelete] = useState<string | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const [formData, setFormData] = useState({
		nome: '',
		descricao: '',
		duracao: '',
		preco: '',
		categoria: 'corte',
		ativo: true,
		icone: 'briefcase',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitLoading(true);
		setSubmitError(null);

		try {
			if (editingServico) {
				// Atualizar serviço existente
				await atualizarServico(editingServico.id, formData);
			} else {
				// Criar novo serviço
				await criarServico(formData);
			}
			setShowModal(false);
			setEditingServico(null);
			setFormData({
				nome: '',
				descricao: '',
				duracao: '',
				preco: '',
				categoria: 'corte',
				ativo: true,
				icone: 'briefcase',
			});
		} catch (err) {
			setSubmitError(
				err instanceof Error
					? err.message
					: `Erro ao ${
							editingServico ? 'atualizar' : 'criar'
					  } serviço`
			);
		} finally {
			setSubmitLoading(false);
		}
	};

	const handleEdit = (servico: Servico) => {
		setEditingServico(servico);
		setFormData({
			nome: servico.nome,
			descricao: servico.descricao || '',
			duracao: servico.duracao || '',
			preco: servico.preco || '',
			categoria: 'corte',
			ativo: true,
			icone: 'briefcase',
		});
		setShowModal(true);
	};

	const handleDelete = (id: string) => {
		setServicoToDelete(id);
	};

	const confirmDelete = async () => {
		if (!servicoToDelete) return;

		setDeleteLoading(true);
		try {
			await excluirServico(servicoToDelete);
			setServicoToDelete(null);
		} catch (err) {
			alert(
				err instanceof Error ? err.message : 'Erro ao excluir serviço'
			);
		} finally {
			setDeleteLoading(false);
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingServico(null);
		setSubmitError(null);
		setFormData({
			nome: '',
			descricao: '',
			duracao: '',
			preco: '',
			categoria: 'corte',
			ativo: true,
			icone: 'briefcase',
		});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<LoadingSpinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
				<AlertCircle size={20} />
				<span>{error}</span>
			</div>
		);
	}

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* Cabeçalho */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
						Gerenciar Serviços
					</h2>
					<p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400">
						Crie e gerencie os serviços oferecidos
					</p>
				</div>
				<button
					onClick={() => setShowModal(true)}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
				>
					<Plus size={20} />
					Novo Serviço
				</button>
			</div>

			{/* Grid de Serviços */}
			{servicos.length === 0 ? (
				<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
					<Briefcase
						size={48}
						className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
					/>
					<p className="text-gray-500 dark:text-gray-400">
						Nenhum serviço cadastrado
					</p>
					<button
						onClick={() => setShowModal(true)}
						className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
					>
						<Plus size={20} />
						Adicionar Primeiro Serviço
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{servicos.map((servico) => (
						<div
							key={servico.id}
							className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
						>
							<div className="p-6">
								<div className="flex items-start justify-between mb-4">
									<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
										{servicoIcons[
											servico.descricao?.toLowerCase() ||
												'default'
										] || servicoIcons.default}
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => handleEdit(servico)}
											className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 transition-colors"
											title="Editar"
										>
											<Edit2 size={18} />
										</button>
										<button
											onClick={() =>
												handleDelete(servico.id)
											}
											className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors"
											title="Excluir"
										>
											<Trash2 size={18} />
										</button>
									</div>
								</div>

								<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
									{servico.nome}
								</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
									{servico.descricao || 'Sem descrição'}
								</p>

								<div className="space-y-2 mb-4">
									<div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
										<Clock
											size={16}
											className="text-gray-400"
										/>
										<span>
											{servico.duracao || '30'} minutos
										</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
										<DollarSign
											size={16}
											className="text-gray-400"
										/>
										<span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
											R${' '}
											{parseFloat(servico.preco).toFixed(
												2
											)}
										</span>
									</div>
								</div>

								<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
										Ativo
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Modal Novo/Editar Serviço */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
					<div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
									{editingServico
										? 'Editar Serviço'
										: 'Novo Serviço'}
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
										Nome do Serviço *
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
										placeholder="Ex: Corte de Cabelo"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Descrição
									</label>
									<textarea
										value={formData.descricao}
										onChange={(e) =>
											setFormData({
												...formData,
												descricao: e.target.value,
											})
										}
										rows={3}
										disabled={submitLoading}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
										placeholder="Descreva o serviço..."
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
											Duração (min) *
										</label>
										<input
											type="number"
											value={formData.duracao}
											onChange={(e) =>
												setFormData({
													...formData,
													duracao: e.target.value,
												})
											}
											required
											min="1"
											disabled={submitLoading}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
											placeholder="30"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
											Preço (R$) *
										</label>
										<input
											type="number"
											value={formData.preco}
											onChange={(e) =>
												setFormData({
													...formData,
													preco: e.target.value,
												})
											}
											required
											min="0"
											step="0.01"
											disabled={submitLoading}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
											placeholder="50.00"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
										disabled={submitLoading}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<option value="corte">Corte</option>
										<option value="pintura">Pintura</option>
										<option value="beleza">Beleza</option>
										<option value="tratamento">
											Tratamento
										</option>
									</select>
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
												{editingServico
													? 'Atualizando...'
													: 'Salvando...'}
											</>
										) : (
											<>
												{editingServico
													? 'Atualizar Serviço'
													: 'Salvar Serviço'}
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
				isOpen={servicoToDelete !== null}
				onClose={() => setServicoToDelete(null)}
				onConfirm={confirmDelete}
				title="Excluir Serviço"
				message="Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita e removerá todos os agendamentos associados."
				confirmText="Excluir"
				type="danger"
				isLoading={deleteLoading}
			/>
		</div>
	);
}
