/**
 * Componente de Formulário de Registro de Cliente
 */

'use client';

import { useState, FormEvent } from 'react';
import { LoadingSpinner } from '@/components/ui';
import type { RegisterClienteData } from '@/types';

interface RegisterClienteFormProps {
	onSubmit: (data: RegisterClienteData) => Promise<void>;
	isLoading?: boolean;
	error?: string | null;
}

export function RegisterClienteForm({
	onSubmit,
	isLoading,
	error,
}: RegisterClienteFormProps) {
	const [formData, setFormData] = useState<RegisterClienteData>({
		nome: '',
		email: '',
		senha: '',
		telefone: '',
		cpf: '',
		data_nascimento: '',
	});
	const [showSenha, setShowSenha] = useState(false);

	const handleChange = (field: keyof RegisterClienteData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Remove campos vazios opcionais
		const dataToSend = { ...formData };
		if (!dataToSend.telefone) delete dataToSend.telefone;
		if (!dataToSend.cpf) delete dataToSend.cpf;
		if (!dataToSend.data_nascimento) delete dataToSend.data_nascimento;

		await onSubmit(dataToSend);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Nome */}
			<div>
				<label
					htmlFor="nome"
					className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
				>
					Nome Completo *
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
					placeholder="João Silva"
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
					placeholder="joao@email.com"
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
				<div className="relative">
					<input
						id="senha"
						type={showSenha ? 'text' : 'password'}
						value={formData.senha}
						onChange={(e) => handleChange('senha', e.target.value)}
						required
						disabled={isLoading}
						minLength={6}
						className="w-full px-4 py-2 pr-24 border border-gray-300 dark:border-gray-600 rounded-lg 
							focus:ring-2 focus:ring-blue-500 focus:border-transparent
							bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-colors"
						placeholder="Mínimo 6 caracteres"
					/>
					<button
						type="button"
						onClick={() => setShowSenha((v) => !v)}
						disabled={isLoading}
						className="absolute inset-y-0 right-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-300 
							bg-transparent hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
						aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
					>
						{showSenha ? 'Ocultar' : 'Mostrar'}
					</button>
				</div>
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
					placeholder="(11) 99999-9999"
				/>
			</div>

			{/* CPF */}
			<div>
				<label
					htmlFor="cpf"
					className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
				>
					CPF
				</label>
				<input
					id="cpf"
					type="text"
					value={formData.cpf}
					onChange={(e) => handleChange('cpf', e.target.value)}
					disabled={isLoading}
					className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
						focus:ring-2 focus:ring-blue-500 focus:border-transparent
						bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
						disabled:opacity-50 disabled:cursor-not-allowed
						transition-colors"
					placeholder="000.000.000-00"
					maxLength={14}
				/>
			</div>

			{/* Data de Nascimento */}
			<div>
				<label
					htmlFor="data_nascimento"
					className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
				>
					Data de Nascimento
				</label>
				<input
					id="data_nascimento"
					type="date"
					value={formData.data_nascimento}
					onChange={(e) =>
						handleChange('data_nascimento', e.target.value)
					}
					disabled={isLoading}
					className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
						focus:ring-2 focus:ring-blue-500 focus:border-transparent
						bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
						disabled:opacity-50 disabled:cursor-not-allowed
						transition-colors"
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
