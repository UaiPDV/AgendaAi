import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: LucideIcon;
	variant?: 'primary' | 'secondary' | 'danger';
	fullWidth?: boolean;
	loading?: boolean;
	children: ReactNode;
}

export function ActionButton({
	icon: Icon,
	variant = 'primary',
	fullWidth = false,
	loading = false,
	children,
	className = '',
	...props
}: ActionButtonProps) {
	const variants = {
		primary: 'bg-blue-500 hover:bg-blue-600 text-white',
		secondary:
			'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
		danger: 'bg-red-500 hover:bg-red-600 text-white',
	};

	return (
		<button
			{...props}
			disabled={loading || props.disabled}
			className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
				variants[variant]
			} ${fullWidth ? 'w-full' : ''} ${className}`}
		>
			{Icon && <Icon className="w-5 h-5" />}
			{loading ? 'Carregando...' : children}
		</button>
	);
}
