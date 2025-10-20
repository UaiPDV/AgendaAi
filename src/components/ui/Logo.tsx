import { Calendar } from 'lucide-react';

interface LogoProps {
	variant?: 'full' | 'icon';
	size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'full', size = 'md' }: LogoProps) {
	const iconSizes = {
		sm: 'w-8 h-8 text-base',
		md: 'w-10 h-10 text-xl',
		lg: 'w-12 h-12 text-2xl',
	};

	const textSizes = {
		sm: 'text-lg',
		md: 'text-xl',
		lg: 'text-2xl',
	};

	return (
		<div
			className={`flex items-center transition-all duration-300 ${
				variant === 'icon' ? 'justify-center gap-0' : 'gap-3'
			}`}
			suppressHydrationWarning
		>
			<div
				className={`${iconSizes[size]} bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md flex-shrink-0`}
			>
				<Calendar
					className="text-white"
					size={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
				/>
			</div>
			<h1
				className={`${
					textSizes[size]
				} font-bold text-gray-800 dark:text-gray-100 transition-all duration-300 ${
					variant === 'icon'
						? 'w-0 opacity-0 overflow-hidden'
						: 'opacity-100'
				}`}
				suppressHydrationWarning
			>
				AgendaAi
			</h1>
		</div>
	);
}
