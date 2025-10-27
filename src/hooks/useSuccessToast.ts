import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar toast de sucesso
 * Para usar com parâmetros de URL, passe o valor do searchParam como argumento
 */
export function useSuccessToast(sucessoParam?: string | null) {
	const [mostrarSucesso, setMostrarSucesso] = useState(false);

	useEffect(() => {
		if (sucessoParam === 'true') {
			setMostrarSucesso(true);
			const timer = setTimeout(() => {
				setMostrarSucesso(false);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [sucessoParam]);

	return {
		mostrarSucesso,
		setMostrarSucesso,
	};
}
