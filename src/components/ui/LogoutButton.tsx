'use client';

import { useRouter } from 'next/navigation';
import { removeAuthToken } from '@/lib/utils';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
	variant?: 'button' | 'link';
	className?: string;
	showIcon?: boolean;
}

export function LogoutButton({
	variant = 'button',
	className = '',
	showIcon = true,
}: LogoutButtonProps) {
	const router = useRouter();

	const handleLogout = () => {
		// Remove o token de autenticação
		removeAuthToken();

		// Redireciona para a página de login
		router.push('/Login');
	};

	if (variant === 'link') {
		return (
			<button
				onClick={handleLogout}
				className={`flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors ${className}`}
			>
				{showIcon && <LogOut size={16} />}
				<span>Sair</span>
			</button>
		);
	}

	return (
		<button
			onClick={handleLogout}
			className={`flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 ${className}`}
		>
			{showIcon && <LogOut size={16} />}
			<span>Sair</span>
		</button>
	);
}
