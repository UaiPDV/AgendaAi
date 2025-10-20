'use client';

import { ChevronLeft } from 'lucide-react';

interface ToggleButtonProps {
	collapsed: boolean;
	onClick: () => void;
}

export function ToggleButton({ collapsed, onClick }: ToggleButtonProps) {
	return (
		<button
			onClick={onClick}
			className="
				w-7 h-7 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 
				rounded-full flex items-center justify-center 
				hover:shadow-md transition-all
				text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
			"
			title={collapsed ? 'Expandir menu' : 'Recolher menu'}
		>
			<ChevronLeft
				size={12}
				className={`transition-transform duration-300 ${
					collapsed ? 'rotate-180' : ''
				}`}
			/>
		</button>
	);
}
