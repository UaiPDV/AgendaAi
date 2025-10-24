/**
 * Componente de Formulário de Registro de Estabelecimento
 */

'use client';

import { useState, FormEvent } from 'react';
import { LoadingSpinner } from '@/components/ui';
import type { RegisterEstabelecimentoData } from '@/types';

interface RegisterEstabelecimentoFormProps {
	onSubmit: (data: RegisterEstabelecimentoData) => Promise<void>;
	isLoading?: boolean;
	error?: string | null;
}

export function RegisterEstabelecimentoForm({
	onSubmit,
	isLoading,
	error,
}: RegisterEstabelecimentoFormProps) {
	const [formData, setFormData] = useState<RegisterEstabelecimentoData>({
		nome: '',
		email: '',
		senha: '',
		telefone: '',
		endereco: '',
	});

	const handleChange = (
		field: keyof RegisterEstabelecimentoData,
		value: string
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Remove campos vazios opcionais
		const dataToSend = { ...formData };
		if (!dataToSend.telefone) delete dataToSend.telefone;
		if (!dataToSend.endereco) delete dataToSend.endereco;

		await onSubmit(dataToSend);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Nome do Estabelecimento */}
			<div>
				<label
					htmlFor="nome"
					className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
				>
					Nome do Estabelecimento *
				</label>
				<input
					id="nome"
					type="text"
					value={formData.nome}
					onChange={(e) => handleChange('nome', e.target.value)}
					required
					disabled={isLoading}
					className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
						focus:ring-2 focus:ring-blue-500 focus:border-transparent
						bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
						disabled:opacity-50 disabled:cursor-not-allowed
						transition-colors"
					placeholder="Salão de Beleza XYZ"
				/>
			</div>

			{/* Email */}
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
				>
					Email *
				</label>
				<input
					id="email"
					type="email"
					value={formData.email}
					onChange={(e) => handleChange('email', e.target.value)}
					required
					disabled={isLoading}
					className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
						focus:ring-2 focus:ring-blue-500 focus:border-transparent
						bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
						disabled:opacity-50 disabled:cursor-not-allowed
						transition-colors"
					placeholder="contato@estabelecimento.com"
				/>
			</div>

			{/* Senha */}
			<div>
				<label
					htmlFor="senha"
					className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
				>
					Senha *
				</label>
				<input
					id="senha"
					type="password"
					value={formData.senha}
					onChange={(e) => handleChange('senha', e.target.value)}
					required
					disabled={isLoading}
					minLength={6}
					className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
						focus:ring-2 focus:ring-blue-500 focus:border-transparent
						bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
						disabled:opacity-50 disabled:cursor-not-allowed
						transition-colors"
					placeholder="Mínimo 6 caracteres"
				/>
			</div>

			{/* Telefone */}
			<div>
				<label
					htmlFor="telefone"
					className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
				>
					Telefone
				</label>
				<input
					id="telefone"
					type="tel"
					value={formData.telefone}
					onChange={(e) => handleChange('telefone', e.target.value)}
					disabled={isLoading}
					className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
						focus:ring-2 focus:ring-blue-500 focus:border-transparent
						bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
						disabled:opacity-50 disabled:cursor-not-allowed
						transition-colors"
					placeholder="(11) 3333-4444"
				/>
			</div>

			{/* Endereço */}
			<div>
				<label
					htmlFor="endereco"
					className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
				>
					Endereço
				</label>
				<input
					id="endereco"
					type="text"
					value={formData.endereco}
					onChange={(e) => handleChange('endereco', e.target.value)}
					disabled={isLoading}
					className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
						focus:ring-2 focus:ring-blue-500 focus:border-transparent
						bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
						disabled:opacity-50 disabled:cursor-not-allowed
						transition-colors"
					placeholder="Rua Example, 123 - São Paulo, SP"
				/>
			</div>

			{/* Mensagem de Erro */}
			{error && (
				<div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
					<p className="text-sm text-red-600 dark:text-red-400">
						{error}
					</p>
				</div>
			)}

			{/* Botão Submit */}
			<button
				type="submit"
				disabled={isLoading}
				className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg
					disabled:opacity-50 disabled:cursor-not-allowed
					transition-colors duration-200 flex items-center justify-center gap-2"
			>
				{isLoading ? (
					<>
						<LoadingSpinner />
						<span>Criando conta...</span>
					</>
				) : (
					'Criar Conta'
				)}
			</button>

			<p className="text-xs text-gray-500 dark:text-gray-400 text-center">
				* Campos obrigatórios
			</p>
		</form>
	);
}
