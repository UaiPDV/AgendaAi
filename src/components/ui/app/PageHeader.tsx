import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
	icon: LucideIcon;
	title: string;
	description: string;
	iconColor?: string;
	actions?: ReactNode;
}

export function PageHeader({
	icon: Icon,
	title,
	description,
	iconColor = 'text-blue-500',
	actions,
}: PageHeaderProps) {
	return (
		<div className="max-w-7xl mx-auto mb-8">
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-3">
					<Icon className={`w-8 h-8 ${iconColor}`} />
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{title}
					</h1>
				</div>
				{actions && <div>{actions}</div>}
			</div>
			<p className="text-gray-600 dark:text-gray-400">{description}</p>
		</div>
	);
}
