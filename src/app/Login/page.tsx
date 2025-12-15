/**
 * Página de Login
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/features/auth';
import { Logo } from '@/components/ui';
import { useAuthentication } from '@/hooks/useAuthentication';

export default function LoginPage() {
	const { login, isLoading, error, clearError } = useAuthentication();
	const [activeTab, setActiveTab] = useState<'cliente' | 'estabelecimento'>(
		'cliente'
	);

	const handleLogin = async (credentials: {
		email: string;
		senha: string;
		tipo: 'cliente' | 'estabelecimento';
	}) => {
		clearError();
		await login(credentials);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Card de Login */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
					{/* Logo e Título */}
					<div className="text-center mb-8">
						<div className="flex justify-center mb-4">
							<Logo size="lg" />
						</div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
							Bem-vindo de volta!
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Faça login para continuar
						</p>
					</div>

					{/* Tabs - Cliente / Estabelecimento */}
					<div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
						<button
							type="button"
							onClick={() => setActiveTab('cliente')}
							className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
								activeTab === 'cliente'
									? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
									: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
							}`}
						>
							Cliente
						</button>
						<button
							type="button"
							onClick={() => setActiveTab('estabelecimento')}
							className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
								activeTab === 'estabelecimento'
									? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
									: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
							}`}
						>
							Estabelecimento
						</button>
					</div>

					{/* Formulário de Login */}
					<LoginForm
						onSubmit={handleLogin}
						userType={activeTab}
						isLoading={isLoading}
						error={error}
					/>

					{/* Links de Cadastro */}
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Não tem uma conta?{' '}
							<Link
								href={
									activeTab === 'cliente'
										? '/cadastro/cliente'
										: '/cadastro/estabelecimento'
								}
								className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
							>
								Cadastre-se
							</Link>
						</p>
					</div>
				</div>

				{/* Footer */}
				<p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
					AgendaAi © 2025 - Todos os direitos reservados
				</p>
			</div>
		</div>
	);
}
