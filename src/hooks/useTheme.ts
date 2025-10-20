'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { ThemeContextType } from '@/types';

/**
 * Hook para acessar o contexto de tema
 * @throws {Error} Se usado fora do ThemeProvider
 * @returns {ThemeContextType} Contexto do tema com estado e funções
 */
export function useTheme(): ThemeContextType {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
	}

	return context;
}
