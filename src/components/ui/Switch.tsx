'use client';

interface SwitchProps {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	label?: string;
	disabled?: boolean;
}

export function Switch({
	checked,
	onCheckedChange,
	label,
	disabled = false,
}: SwitchProps) {
	return (
		<label className="relative inline-flex items-center cursor-pointer">
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onCheckedChange(e.target.checked)}
				disabled={disabled}
				className="sr-only peer"
			/>
			<div
				className={`
					w-12 h-6 rounded-full transition-colors
					${checked ? 'bg-gray-800 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'}
					${disabled ? 'opacity-50 cursor-not-allowed' : ''}
					peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-800 dark:peer-focus:ring-gray-600
					after:content-[''] after:absolute after:top-0.5 after:left-0.5 
					after:bg-white after:rounded-full after:h-5 after:w-5 
					after:transition-transform after:duration-200
					${checked ? 'after:translate-x-6' : ''}
				`}
			/>
			{label && (
				<span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
					{label}
				</span>
			)}
		</label>
	);
}
