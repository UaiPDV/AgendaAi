import { ReactNode } from 'react';

/**
 * Tipos comuns usados em componentes
 */
export interface BaseComponentProps {
	children?: ReactNode;
	className?: string;
}

export interface PropsWithChildren {
	children: ReactNode;
}
