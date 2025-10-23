/**
 * Modal para criar/editar profissional
 */

'use client';

import { useState, useEffect } from 'react';
import type { NovoProfissionalForm } from '@/types/estabelecimento';

interface NovoProfissionalModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: NovoProfissionalForm) => Promise<void>;
	profissionalInicial?: Partial<NovoProfissionalForm>;
	titulo?: string;
}

export function NovoProfissionalModal({
	isOpen,
	onClose,
	onSave,
	profissionalInicial,
	titulo = 'Novo Profissional',
}: NovoProfissionalModalProps) {
	const [formData, setFormData] = useState<NovoProfissionalForm>({
		nome: '',
		telefone: '',
		email: '',
		especialidades: [],
	});
	const [especialidadeInput, setEspecialidadeInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (profissionalInicial) {
			setFormData((prev) => ({ ...prev, ...profissionalInicial }));
		}
	}, [profissionalInicial]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			await onSave(formData);
			handleClose();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Erro ao salvar profissional'
			);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setFormData({
			nome: '',
			telefone: '',
			email: '',
			especialidades: [],
		});
		setEspecialidadeInput('');
		setError(null);
		onClose();
	};

	const adicionarEspecialidade = () => {
		if (
			especialidadeInput.trim() &&
			!formData.especialidades.includes(especialidadeInput.trim())
		) {
			setFormData({
				...formData,
				especialidades: [
					...formData.especialidades,
					especialidadeInput.trim(),
				],
			});
			setEspecialidadeInput('');
		}
	};

	const removerEspecialidade = (esp: string) => {
		setFormData({
			...formData,
			especialidades: formData.especialidades.filter((e) => e !== esp),
		});
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
								Nome Completo*
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
								placeholder="Ex: João Silva"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Telefone*
							</label>
							<input
								type="tel"
								required
								value={formData.telefone}
								onChange={(e) =>
									setFormData({
										...formData,
										telefone: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="(11) 99999-9999"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								E-mail
							</label>
							<input
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({
										...formData,
										email: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="joao@exemplo.com"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Especialidades
							</label>
							<div className="flex gap-2">
								<input
									type="text"
									value={especialidadeInput}
									onChange={(e) =>
										setEspecialidadeInput(e.target.value)
									}
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											adicionarEspecialidade();
										}
									}}
									className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Ex: Corte masculino"
								/>
								<button
									type="button"
									onClick={adicionarEspecialidade}
									className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
								>
									<i className="fas fa-plus"></i>
								</button>
							</div>
							{formData.especialidades.length > 0 && (
								<div className="mt-2 flex flex-wrap gap-2">
									{formData.especialidades.map(
										(esp, index) => (
											<span
												key={index}
												className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-2"
											>
												{esp}
												<button
													type="button"
													onClick={() =>
														removerEspecialidade(
															esp
														)
													}
													className="hover:text-blue-900"
												>
													<i className="fas fa-times"></i>
												</button>
											</span>
										)
									)}
								</div>
							)}
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
