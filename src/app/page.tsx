'use client';

import { useAuthRedirect } from '@/hooks';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
	// Redireciona automaticamente baseado no status de autenticação
	useAuthRedirect({
		authenticatedRedirect: '/Agendar',
		unauthenticatedRedirect: '/Login',
	});

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<p className="text-gray-600 dark:text-gray-400 mb-4">
					Redirecionando...
				</p>
				<ThemeToggle />
			</div>
		</div>
	);
}
