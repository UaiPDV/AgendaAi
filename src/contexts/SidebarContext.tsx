'use client';

import { createContext, ReactNode, useState, useEffect } from 'react';
import {
	getSidebarCollapsed,
	saveSidebarCollapsed,
	applySidebarCollapsed,
} from '@/lib/utils';
import { addCustomEventListener } from '@/lib/utils';
import { CUSTOM_EVENTS } from '@/constants';
import { useIsClient } from '@/hooks/useIsClient';

interface SidebarToggleDetail {
	collapsed: boolean;
}

export interface SidebarContextType {
	collapsed: boolean;
	toggle: () => void;
	setCollapsed: (collapsed: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(
	undefined
);

export function SidebarProvider({ children }: { children: ReactNode }) {
	const isClient = useIsClient();
	const [collapsed, setCollapsed] = useState(false);

	// Sincronizar com localStorage apenas no cliente após a hidratação
	useEffect(() => {
		if (isClient) {
			const savedState = getSidebarCollapsed();
			setCollapsed(savedState);
		}
	}, [isClient]);

	useEffect(() => {
		// Aplicar classe ao documento quando o estado mudar
		applySidebarCollapsed(collapsed);

		// Escutar mudanças via evento customizado
		const cleanup = addCustomEventListener<SidebarToggleDetail>(
			CUSTOM_EVENTS.SIDEBAR_TOGGLE,
			(event) => {
				setCollapsed(event.detail.collapsed);
			}
		);

		return cleanup;
	}, [collapsed]);

	const toggle = () => {
		const newState = !collapsed;
		setCollapsed(newState);
		saveSidebarCollapsed(newState);
	};

	return (
		<SidebarContext.Provider value={{ collapsed, toggle, setCollapsed }}>
			{children}
		</SidebarContext.Provider>
	);
}
