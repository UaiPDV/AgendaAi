'use client';

import { createContext, useEffect, useState } from 'react';
import { Theme, ThemeContextType, PropsWithChildren } from '@/types';
import { getInitialTheme, saveTheme, applyTheme } from '@/lib/utils';
import { useIsClient } from '@/hooks/useIsClient';

export const ThemeContext = createContext<ThemeContextType | undefined>(
	undefined
);

export function ThemeProvider({ children }: PropsWithChildren) {
	const isClient = useIsClient();
	const [theme, setTheme] = useState<Theme>('light');

	// Sincronizar com localStorage apenas no cliente após a hidratação
	useEffect(() => {
		if (isClient) {
			const savedTheme = getInitialTheme();
			setTheme(savedTheme);
		}
	}, [isClient]);

	useEffect(() => {
		// Garantir que o tema está aplicado após a hidratação
		applyTheme(theme);
	}, [theme]);

	const toggleTheme = () => {
		const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		saveTheme(newTheme);
		applyTheme(newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
