import { ReactNode } from 'react';

interface NavSectionProps {
	title?: string;
	collapsed?: boolean;
	children: ReactNode;
	isFirst?: boolean;
}

export function NavSection({
	title,
	collapsed = false,
	children,
}: NavSectionProps) {
	return (
		<div className="mt-8 first:mt-2">
			{/* Título da seção quando expandida */}
			{title && !collapsed && (
				<h2 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
					{title}
				</h2>
			)}

			{/* A linha separadora foi completamente removida */}

			<div className="space-y-1">{children}</div>
		</div>
	);
}
