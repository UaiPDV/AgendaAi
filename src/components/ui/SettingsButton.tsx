interface SettingsButtonProps {
	onClick?: () => void;
	children: React.ReactNode;
	variant?: 'default' | 'danger';
	showArrow?: boolean;
}

export function SettingsButton({
	onClick,
	children,
	variant = 'default',
	showArrow = false,
}: SettingsButtonProps) {
	const baseClasses =
		'w-full text-left px-4 py-3 border rounded-md flex justify-between items-center transition-colors';

	const variantClasses = {
		default:
			'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100',
		danger: 'border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400',
	};

	return (
		<button
			onClick={onClick}
			className={`${baseClasses} ${variantClasses[variant]}`}
		>
			<span>{children}</span>
			{showArrow && (
				<svg
					className="w-5 h-5 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			)}
		</button>
	);
}
