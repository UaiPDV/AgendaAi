import type { ReactNode } from 'react';

interface PageContainerProps {
	children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			{children}
		</div>
	);
}
