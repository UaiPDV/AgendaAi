import { ReactNode } from 'react';

interface SettingsCardProps {
	title: string;
	children: ReactNode;
}

export function SettingsCard({ title, children }: SettingsCardProps) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
			<div className="p-6 border-b border-gray-200 dark:border-gray-700">
				<h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
					{title}
				</h3>
			</div>
			<div className="p-6 space-y-4">{children}</div>
		</div>
	);
}
