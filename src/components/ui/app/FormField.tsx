import type { LucideIcon } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	icon?: LucideIcon;
}

export function FormField({ label, icon: Icon, ...props }: FormFieldProps) {
	return (
		<div className="mb-6">
			<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				{Icon && <Icon className="w-4 h-4" />}
				{label}
			</label>
			<input
				{...props}
				className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
			/>
		</div>
	);
}
