import type { ReactNode } from 'react';

interface GridContainerProps {
	children: ReactNode;
	columns?: 1 | 2 | 3 | 4;
}

export function GridContainer({ children, columns = 3 }: GridContainerProps) {
	const gridCols = {
		1: 'grid-cols-1',
		2: 'grid-cols-1 md:grid-cols-2',
		3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
	};

	return (
		<div className="max-w-7xl mx-auto">
			<div className={`grid ${gridCols[columns]} gap-6`}>{children}</div>
		</div>
	);
}
