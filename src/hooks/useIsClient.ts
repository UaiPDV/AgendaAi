'use client';

import { useState, useEffect } from 'react';

/**
 * Hook que retorna `true` se o componente estiver sendo renderizado no cliente.
 * Ajuda a evitar erros de hidratação (hydration mismatch) em Next.js.
 */
export function useIsClient() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return isClient;
}
