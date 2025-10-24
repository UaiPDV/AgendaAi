'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/utils/auth';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
	variant?: 'button' | 'link' | 'danger';
	className?: string;
	showIcon?: boolean;
	fullWidth?: boolean;
}

export function LogoutButton({
	variant = 'button',
	className = '',
	showIcon = true,
	fullWidth = false,
}: LogoutButtonProps) {
	const router = useRouter();

	const handleLogout = () => {
		// Remove token e dados do usuário
		logout();

		// Redireciona para a página de login
		router.push('/Login');
	};

	const baseClasses = `flex items-center gap-2 transition-colors ${
		fullWidth ? 'w-full justify-center' : ''
	} ${className}`;

	if (variant === 'link') {
		return (
			<button
				onClick={handleLogout}
				className={`${baseClasses} text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300`}
			>
				{showIcon && <LogOut size={16} />}
				<span>Sair</span>
			</button>
		);
	}

	if (variant === 'danger') {
		return (
			<button
				onClick={handleLogout}
				className={`${baseClasses} px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium`}
			>
				{showIcon && <LogOut size={18} />}
				<span>Sair da Conta</span>
			</button>
		);
	}

	return (
		<button
			onClick={handleLogout}
			className={`${baseClasses} px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg`}
		>
			{showIcon && <LogOut size={16} />}
			<span>Sair</span>
		</button>
	);
}
