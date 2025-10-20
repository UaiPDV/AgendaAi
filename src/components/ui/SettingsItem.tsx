import { ReactNode } from 'react';

interface SettingsItemProps {
	label: string;
	description?: string;
	control: ReactNode;
}

export function SettingsItem({
	label,
	description,
	control,
}: SettingsItemProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex-1">
				<p className="font-medium text-gray-800 dark:text-gray-100">
					{label}
				</p>
				{description && (
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
						{description}
					</p>
				)}
			</div>
			<div className="ml-4">{control}</div>
		</div>
	);
}
