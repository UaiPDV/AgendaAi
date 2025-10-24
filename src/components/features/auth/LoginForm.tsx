/**
 * Componente de Formulário de Login
 */

'use client';

import { useState, FormEvent } from 'react';
import { LoadingSpinner } from '@/components/ui';
import type { LoginCredentials } from '@/types';

interface LoginFormProps {
	onSubmit: (credentials: LoginCredentials) => Promise<void>;
	isLoading?: boolean;
	error?: string | null;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await onSubmit({ email, senha });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Email */}
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
				>
					Email
				</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={isLoading}
					className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
						focus:ring-2 focus:ring-blue-500 focus:border-transparent
						bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
						disabled:opacity-50 disabled:cursor-not-allowed
						transition-colors"
					placeholder="seu@email.com"
				/>
			</div>

			{/* Senha */}
			<div>
				<label
					htmlFor="senha"
					className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
				>
					Senha
				</label>
				<input
					id="senha"
					type="password"
					value={senha}
					onChange={(e) => setSenha(e.target.value)}
					required
					disabled={isLoading}
					className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
						focus:ring-2 focus:ring-blue-500 focus:border-transparent
						bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
						disabled:opacity-50 disabled:cursor-not-allowed
						transition-colors"
					placeholder="••••••••"
					minLength={6}
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
						<span>Entrando...</span>
					</>
				) : (
					'Entrar'
				)}
			</button>
		</form>
	);
}
