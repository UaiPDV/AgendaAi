import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
	icon: LucideIcon;
	iconColor: string;
	label: string;
	value: string | number;
	subtitle?: ReactNode;
}

export function StatCard({
	icon: Icon,
	iconColor,
	label,
	value,
	subtitle,
}: StatCardProps) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<div className="flex items-center gap-3 mb-2">
				<Icon className={`w-6 h-6 ${iconColor}`} />
				<h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
					{label}
				</h3>
			</div>
			<p className="text-3xl font-bold text-gray-900 dark:text-white">
				{value}
			</p>
			{subtitle && <div className="mt-1">{subtitle}</div>}
		</div>
	);
}
