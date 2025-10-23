'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { saveAuthToken } from '@/lib/utils';
import type { LoginCredentials } from '@/types';

export default function LoginPage() {
	const router = useRouter();
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// TODO: Substituir por chamada real à API
			// const response = await fetch('/api/auth/login', {
			// 	method: 'POST',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify(credentials),
			// });

			// if (!response.ok) {
			// 	throw new Error('Credenciais inválidas');
			// }

			// const data = await response.json();
			// saveAuthToken(data.token);

			// Simulação temporária - remover em produção
			const mockToken = 'mock-jwt-token-' + Date.now();
			saveAuthToken(mockToken);

			// Redirecionar para área autenticada
			router.push('/Agendar');
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Erro ao fazer login'
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
			<div className="w-full max-w-md">
				<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
						Login
					</h1>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								E-mail
							</label>
							<input
								id="email"
								type="email"
								required
								value={credentials.email}
								onChange={(e) =>
									setCredentials((prev) => ({
										...prev,
										email: e.target.value,
									}))
								}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
								placeholder="seu@email.com"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Senha
							</label>
							<input
								id="password"
								type="password"
								required
								value={credentials.password}
								onChange={(e) =>
									setCredentials((prev) => ({
										...prev,
										password: e.target.value,
									}))
								}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
								placeholder="••••••••"
							/>
						</div>

						{error && (
							<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
								{error}
							</div>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
						>
							{isLoading ? 'Entrando...' : 'Entrar'}
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
						Não tem uma conta?{' '}
						<a
							href="/Cadastro"
							className="text-blue-600 dark:text-blue-400 hover:underline"
						>
							Cadastre-se
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
