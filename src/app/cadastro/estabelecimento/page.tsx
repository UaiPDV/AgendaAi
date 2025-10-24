/**
 * Página de Cadastro de Estabelecimento
 */

'use client';

import Link from 'next/link';
import { RegisterEstabelecimentoForm } from '@/components/features/auth';
import { Logo } from '@/components/ui';
import { useAuthentication } from '@/hooks/useAuthentication';
import type { RegisterEstabelecimentoData } from '@/types';

export default function CadastroEstabelecimentoPage() {
	const { registerEstabelecimento, isLoading, error, clearError } =
		useAuthentication();

	const handleRegister = async (data: RegisterEstabelecimentoData) => {
		clearError();
		await registerEstabelecimento(data);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Card de Cadastro */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
					{/* Logo e Título */}
					<div className="text-center mb-8">
						<div className="flex justify-center mb-4">
							<Logo size="lg" />
						</div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
							Cadastrar Estabelecimento
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Crie sua conta comercial
						</p>
					</div>

					{/* Formulário de Cadastro */}
					<RegisterEstabelecimentoForm
						onSubmit={handleRegister}
						isLoading={isLoading}
						error={error}
					/>

					{/* Link para Login */}
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Já tem uma conta?{' '}
							<Link
								href="/Login"
								className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
							>
								Faça login
							</Link>
						</p>
					</div>

					{/* Link para Cadastro de Cliente */}
					<div className="mt-4 text-center">
						<p className="text-xs text-gray-500 dark:text-gray-500">
							É cliente?{' '}
							<Link
								href="/cadastro/cliente"
								className="text-blue-600 dark:text-blue-400 hover:underline"
							>
								Cadastre-se aqui
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
