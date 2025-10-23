'use client';

/**
 * Página Meus Dados - Informações pessoais do usuário
 */

import { useUsuario } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { User, Mail, Phone, Calendar, CreditCard, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { DadosUsuario } from '@/types';

export default function DadosPage() {
	const { dados, loading, error, atualizarDados } = useUsuario();
	const [formData, setFormData] = useState<DadosUsuario>({
		nome: '',
		cpf: '',
		email: '',
		telefone: '',
		dataNascimento: '',
	});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (dados) {
			setFormData(dados);
		}
	}, [dados]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		const sucesso = await atualizarDados(formData);
		setSaving(false);
		if (sucesso) {
			alert('Dados atualizados com sucesso!');
		} else {
			alert('Erro ao atualizar dados');
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			{/* Header */}
			<div className="max-w-3xl mx-auto mb-8">
				<div className="flex items-center gap-3 mb-2">
					<User className="w-8 h-8 text-green-500" />
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Meus Dados
					</h1>
				</div>
				<p className="text-gray-600 dark:text-gray-400">
					Gerencie suas informações pessoais
				</p>
			</div>

			{/* Loading State */}
			{loading && <LoadingSpinner />}

			{/* Error State */}
			{error && <ErrorMessage message={error} />}

			{/* Formulário */}
			{!loading && !error && dados && (
				<div className="max-w-3xl mx-auto">
					<form
						onSubmit={handleSubmit}
						className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
					>
						{/* Nome */}
						<div className="mb-6">
							<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								<User className="w-4 h-4" />
								Nome Completo
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
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
								required
							/>
						</div>

						{/* Email */}
						<div className="mb-6">
							<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								<Mail className="w-4 h-4" />
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
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
								required
							/>
						</div>

						{/* Telefone */}
						<div className="mb-6">
							<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								<Phone className="w-4 h-4" />
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
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
								required
							/>
						</div>

						{/* CPF */}
						<div className="mb-6">
							<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								<CreditCard className="w-4 h-4" />
								CPF
							</label>
							<input
								type="text"
								value={formData.cpf}
								onChange={(e) =>
									setFormData({
										...formData,
										cpf: e.target.value,
									})
								}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
								required
							/>
						</div>

						{/* Data de Nascimento */}
						<div className="mb-6">
							<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								<Calendar className="w-4 h-4" />
								Data de Nascimento
							</label>
							<input
								type="date"
								value={formData.dataNascimento}
								onChange={(e) =>
									setFormData({
										...formData,
										dataNascimento: e.target.value,
									})
								}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
								required
							/>
						</div>

						{/* Botão Salvar */}
						<button
							type="submit"
							disabled={saving}
							className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Save className="w-5 h-5" />
							{saving ? 'Salvando...' : 'Salvar Alterações'}
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
