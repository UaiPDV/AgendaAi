'use client';

import { useState } from 'react';
import { useProdutos } from '@/hooks/useProdutos';
import { LoadingSpinner, ConfirmDialog } from '@/components/ui';
import type { Produto } from '@/lib/services/produto.service';
import {
	Package,
	Plus,
	Edit2,
	Trash2,
	DollarSign,
	Tag,
	AlertCircle,
	Box,
} from 'lucide-react';

// Ícones para categorias de produtos
const produtoIcons: Record<string, React.ReactNode> = {
	cosmético: <Package size={24} className="text-white" />,
	acessório: <Tag size={24} className="text-white" />,
	produto: <Box size={24} className="text-white" />,
	default: <Package size={24} className="text-white" />,
};

export default function ProdutosPage() {
	const {
		produtos,
		loading,
		error,
		criarProduto,
		atualizarProduto,
		deletarProduto,
	} = useProdutos();

	const [showModal, setShowModal] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
	const [produtoToDelete, setProdutoToDelete] = useState<number | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const [formData, setFormData] = useState({
		nome: '',
		descricao: '',
		preco: '',
		categoria: 'produto',
		estoque: '',
		ativo: true,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitLoading(true);
		setSubmitError(null);

		try {
			const produtoData = {
				nome: formData.nome,
				descricao: formData.descricao,
				preco: parseFloat(formData.preco),
				categoria: formData.categoria,
				estoque: parseInt(formData.estoque),
				ativo: formData.ativo,
			};

			if (editingProduto) {
				await atualizarProduto(editingProduto.id, produtoData);
			} else {
				await criarProduto(produtoData);
			}
			handleCloseModal();
		} catch (err) {
			setSubmitError(
				err instanceof Error
					? err.message
					: `Erro ao ${
							editingProduto ? 'atualizar' : 'criar'
					  } produto`
			);
		} finally {
			setSubmitLoading(false);
		}
	};

	const handleEdit = (produto: Produto) => {
		setEditingProduto(produto);
		setFormData({
			nome: produto.nome,
			descricao: produto.descricao || '',
			preco: produto.preco.toString(),
			categoria: produto.categoria,
			estoque: produto.estoque.toString(),
			ativo: produto.ativo,
		});
		setShowModal(true);
	};

	const handleDelete = (id: number) => {
		setProdutoToDelete(id);
	};

	const confirmDelete = async () => {
		if (!produtoToDelete) return;

		setDeleteLoading(true);
		try {
			await deletarProduto(produtoToDelete);
			setProdutoToDelete(null);
		} catch (err) {
			alert(
				err instanceof Error ? err.message : 'Erro ao excluir produto'
			);
		} finally {
			setDeleteLoading(false);
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingProduto(null);
		setSubmitError(null);
		setFormData({
			nome: '',
			descricao: '',
			preco: '',
			categoria: 'produto',
			estoque: '',
			ativo: true,
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
						Gerenciar Produtos
					</h2>
					<p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400">
						Crie e gerencie os produtos comercializados
					</p>
				</div>
				<button
					onClick={() => setShowModal(true)}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
				>
					<Plus size={20} />
					Novo Produto
				</button>
			</div>

			{/* Grid de Produtos */}
			{produtos.length === 0 ? (
				<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
					<Package
						size={48}
						className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
					/>
					<p className="text-gray-500 dark:text-gray-400">
						Nenhum produto cadastrado
					</p>
					<button
						onClick={() => setShowModal(true)}
						className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
					>
						<Plus size={20} />
						Adicionar Primeiro Produto
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{produtos.map((produto) => (
						<div
							key={produto.id}
							className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
						>
							<div className="p-6">
								<div className="flex items-start justify-between mb-4">
									<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
										{produtoIcons[
											produto.categoria?.toLowerCase() ||
												'default'
										] || produtoIcons.default}
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => handleEdit(produto)}
											className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 transition-colors"
											title="Editar"
										>
											<Edit2 size={18} />
										</button>
										<button
											onClick={() =>
												handleDelete(produto.id)
											}
											className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors"
											title="Excluir"
										>
											<Trash2 size={18} />
										</button>
									</div>
								</div>

								<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
									{produto.nome}
								</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
									{produto.descricao || 'Sem descrição'}
								</p>

								<div className="space-y-2 mb-4">
									<div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
										<DollarSign
											size={16}
											className="text-gray-400"
										/>
										<span>
											R$ {produto.preco.toFixed(2)}
										</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
										<Box
											size={16}
											className="text-gray-400"
										/>
										<span>
											{produto.estoque}{' '}
											{produto.estoque === 1
												? 'unidade'
												: 'unidades'}
										</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
										<Tag
											size={16}
											className="text-gray-400"
										/>
										<span className="capitalize">
											{produto.categoria}
										</span>
									</div>
								</div>

								<div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
									<span
										className={`px-2 py-1 rounded text-xs font-medium ${
											produto.ativo
												? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
												: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
										}`}
									>
										{produto.ativo ? 'Ativo' : 'Inativo'}
									</span>
									{produto.estoque === 0 && (
										<span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
											Sem Estoque
										</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Modal de Criar/Editar */}
			{showModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
						<h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
							{editingProduto ? 'Editar' : 'Novo'} Produto
						</h3>

						{submitError && (
							<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-lg mb-4 flex items-center gap-2">
								<AlertCircle size={16} />
								<span className="text-sm">{submitError}</span>
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Nome*
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
									className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
									required
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
									className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
									rows={3}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Preço (R$)*
									</label>
									<input
										type="number"
										step="0.01"
										value={formData.preco}
										onChange={(e) =>
											setFormData({
												...formData,
												preco: e.target.value,
											})
										}
										className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Estoque*
									</label>
									<input
										type="number"
										value={formData.estoque}
										onChange={(e) =>
											setFormData({
												...formData,
												estoque: e.target.value,
											})
										}
										className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
										required
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Categoria*
								</label>
								<select
									value={formData.categoria}
									onChange={(e) =>
										setFormData({
											...formData,
											categoria: e.target.value,
										})
									}
									className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
									required
								>
									<option value="produto">Produto</option>
									<option value="cosmético">Cosmético</option>
									<option value="acessório">Acessório</option>
									<option value="outro">Outro</option>
								</select>
							</div>

							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="ativo"
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
									htmlFor="ativo"
									className="text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Produto ativo
								</label>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={handleCloseModal}
									disabled={submitLoading}
									className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={submitLoading}
									className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
								>
									{submitLoading ? (
										<>
											<LoadingSpinner />
											<span>Salvando...</span>
										</>
									) : (
										<span>
											{editingProduto
												? 'Atualizar'
												: 'Criar'}
										</span>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Dialog de Confirmação de Exclusão */}
			<ConfirmDialog
				isOpen={produtoToDelete !== null}
				title="Excluir Produto"
				message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
				confirmText="Excluir"
				cancelText="Cancelar"
				onConfirm={confirmDelete}
				onClose={() => setProdutoToDelete(null)}
				isLoading={deleteLoading}
				type="danger"
			/>
		</div>
	);
}
