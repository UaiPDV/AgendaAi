'use client';

import { useState } from 'react';
import { useContasPagar } from '@/hooks/useContasPagar';
import { LoadingSpinner, ConfirmDialog } from '@/components/ui';
import type { ContaPagar } from '@/lib/services/contas-pagar.service';
import {
	TrendingDown,
	Plus,
	Edit2,
	Trash2,
	DollarSign,
	AlertCircle,
	Calendar,
	CheckCircle,
	Clock,
	AlertTriangle,
} from 'lucide-react';

export default function ContasPagarPage() {
	const {
		contas,
		resumo,
		loading,
		error,
		criarConta,
		atualizarConta,
		marcarComoPaga,
		deletarConta,
		filtrar,
	} = useContasPagar();

	const [showModal, setShowModal] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [editingConta, setEditingConta] = useState<ContaPagar | null>(null);
	const [contaToDelete, setContaToDelete] = useState<number | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [filtroStatus, setFiltroStatus] = useState<string>('todos');

	const [formData, setFormData] = useState({
		descricao: '',
		valor: '',
		data_vencimento: '',
		categoria: 'fornecedor',
		observacoes: '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitLoading(true);
		setSubmitError(null);

		try {
			const contaData = {
				descricao: formData.descricao,
				valor: parseFloat(formData.valor),
				data_vencimento: formData.data_vencimento,
				categoria: formData.categoria,
				observacoes: formData.observacoes,
			};

			if (editingConta) {
				await atualizarConta(editingConta.id, contaData);
			} else {
				await criarConta(contaData);
			}
			handleCloseModal();
		} catch (err) {
			setSubmitError(
				err instanceof Error
					? err.message
					: `Erro ao ${editingConta ? 'atualizar' : 'criar'} conta`
			);
		} finally {
			setSubmitLoading(false);
		}
	};

	const handleEdit = (conta: ContaPagar) => {
		setEditingConta(conta);
		setFormData({
			descricao: conta.descricao,
			valor: conta.valor.toString(),
			data_vencimento: conta.data_vencimento.split('T')[0],
			categoria: conta.categoria,
			observacoes: conta.observacoes || '',
		});
		setShowModal(true);
	};

	const handlePagar = async (id: number) => {
		try {
			await marcarComoPaga(id);
		} catch (err) {
			alert(
				err instanceof Error
					? err.message
					: 'Erro ao marcar conta como paga'
			);
		}
	};

	const handleDelete = (id: number) => {
		setContaToDelete(id);
	};

	const confirmDelete = async () => {
		if (!contaToDelete) return;

		setDeleteLoading(true);
		try {
			await deletarConta(contaToDelete);
			setContaToDelete(null);
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Erro ao excluir conta');
		} finally {
			setDeleteLoading(false);
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingConta(null);
		setSubmitError(null);
		setFormData({
			descricao: '',
			valor: '',
			data_vencimento: '',
			categoria: 'fornecedor',
			observacoes: '',
		});
	};

	const handleFiltrar = async (status: string) => {
		setFiltroStatus(status);
		if (status === 'todos') {
			await filtrar({});
		} else {
			await filtrar({ status });
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'pago':
				return (
					<span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
						<CheckCircle size={12} />
						Pago
					</span>
				);
			case 'vencido':
				return (
					<span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
						<AlertTriangle size={12} />
						Vencido
					</span>
				);
			default:
				return (
					<span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
						<Clock size={12} />
						Pendente
					</span>
				);
		}
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
						Contas a Pagar
					</h2>
					<p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400">
						Gerencie suas contas e despesas
					</p>
				</div>
				<button
					onClick={() => setShowModal(true)}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
				>
					<Plus size={20} />
					Nova Conta
				</button>
			</div>

			{/* Resumo */}
			{resumo && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Total Pendente
								</p>
								<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
									R$ {resumo.totalPendente.toFixed(2)}
								</p>
							</div>
							<DollarSign className="text-yellow-500" size={32} />
						</div>
					</div>

					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Total Vencido
								</p>
								<p className="text-2xl font-bold text-red-600 dark:text-red-400">
									R$ {resumo.totalVencido.toFixed(2)}
								</p>
							</div>
							<AlertTriangle className="text-red-500" size={32} />
						</div>
					</div>

					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Pago Este Mês
								</p>
								<p className="text-2xl font-bold text-green-600 dark:text-green-400">
									R$ {resumo.totalPagoMes.toFixed(2)}
								</p>
							</div>
							<CheckCircle className="text-green-500" size={32} />
						</div>
					</div>
				</div>
			)}

			{/* Filtros */}
			<div className="flex gap-2 flex-wrap">
				<button
					onClick={() => handleFiltrar('todos')}
					className={`px-4 py-2 rounded-lg font-medium transition-colors ${
						filtroStatus === 'todos'
							? 'bg-blue-600 text-white'
							: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
					}`}
				>
					Todas
				</button>
				<button
					onClick={() => handleFiltrar('pendente')}
					className={`px-4 py-2 rounded-lg font-medium transition-colors ${
						filtroStatus === 'pendente'
							? 'bg-blue-600 text-white'
							: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
					}`}
				>
					Pendentes
				</button>
				<button
					onClick={() => handleFiltrar('vencido')}
					className={`px-4 py-2 rounded-lg font-medium transition-colors ${
						filtroStatus === 'vencido'
							? 'bg-blue-600 text-white'
							: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
					}`}
				>
					Vencidas
				</button>
				<button
					onClick={() => handleFiltrar('pago')}
					className={`px-4 py-2 rounded-lg font-medium transition-colors ${
						filtroStatus === 'pago'
							? 'bg-blue-600 text-white'
							: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
					}`}
				>
					Pagas
				</button>
			</div>

			{/* Lista de Contas */}
			{contas.length === 0 ? (
				<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
					<TrendingDown
						size={48}
						className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
					/>
					<p className="text-gray-500 dark:text-gray-400">
						Nenhuma conta cadastrada
					</p>
					<button
						onClick={() => setShowModal(true)}
						className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
					>
						<Plus size={20} />
						Adicionar Primeira Conta
					</button>
				</div>
			) : (
				<div className="space-y-3">
					{contas.map((conta) => (
						<div
							key={conta.id}
							className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-2">
										<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
											{conta.descricao}
										</h3>
										{getStatusBadge(conta.status)}
									</div>

									<div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
										<div className="flex items-center gap-2">
											<DollarSign size={14} />
											<span className="font-medium text-gray-900 dark:text-gray-100">
												R$ {conta.valor.toFixed(2)}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Calendar size={14} />
											<span>
												Vencimento:{' '}
												{new Date(
													conta.data_vencimento
												).toLocaleDateString('pt-BR')}
											</span>
										</div>
										{conta.data_pagamento && (
											<div className="flex items-center gap-2">
												<CheckCircle size={14} />
												<span>
													Pago em:{' '}
													{new Date(
														conta.data_pagamento
													).toLocaleDateString(
														'pt-BR'
													)}
												</span>
											</div>
										)}
										{conta.observacoes && (
											<p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
												{conta.observacoes}
											</p>
										)}
									</div>
								</div>

								<div className="flex gap-2 flex-shrink-0">
									{conta.status !== 'pago' && (
										<button
											onClick={() =>
												handlePagar(conta.id)
											}
											className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-2 transition-colors"
											title="Marcar como paga"
										>
											<CheckCircle size={18} />
										</button>
									)}
									<button
										onClick={() => handleEdit(conta)}
										className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 transition-colors"
										title="Editar"
									>
										<Edit2 size={18} />
									</button>
									<button
										onClick={() => handleDelete(conta.id)}
										className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 transition-colors"
										title="Excluir"
									>
										<Trash2 size={18} />
									</button>
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
							{editingConta ? 'Editar' : 'Nova'} Conta a Pagar
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
									Descrição*
								</label>
								<input
									type="text"
									value={formData.descricao}
									onChange={(e) =>
										setFormData({
											...formData,
											descricao: e.target.value,
										})
									}
									className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Valor (R$)*
									</label>
									<input
										type="number"
										step="0.01"
										value={formData.valor}
										onChange={(e) =>
											setFormData({
												...formData,
												valor: e.target.value,
											})
										}
										className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Vencimento*
									</label>
									<input
										type="date"
										value={formData.data_vencimento}
										onChange={(e) =>
											setFormData({
												...formData,
												data_vencimento: e.target.value,
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
									<option value="fornecedor">
										Fornecedor
									</option>
									<option value="aluguel">Aluguel</option>
									<option value="salario">Salário</option>
									<option value="imposto">Imposto</option>
									<option value="outro">Outro</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Observações
								</label>
								<textarea
									value={formData.observacoes}
									onChange={(e) =>
										setFormData({
											...formData,
											observacoes: e.target.value,
										})
									}
									className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
									rows={3}
								/>
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
											{editingConta
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
				isOpen={contaToDelete !== null}
				title="Excluir Conta"
				message="Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita."
				confirmText="Excluir"
				cancelText="Cancelar"
				onConfirm={confirmDelete}
				onClose={() => setContaToDelete(null)}
				isLoading={deleteLoading}
				type="danger"
			/>
		</div>
	);
}
