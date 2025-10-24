import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Hook para gerenciar toast de sucesso com parâmetro de URL
 */
export function useSuccessToast() {
	const searchParams = useSearchParams();
	const sucesso = searchParams.get('sucesso');
	const [mostrarSucesso, setMostrarSucesso] = useState(false);

	useEffect(() => {
		if (sucesso === 'true') {
			setMostrarSucesso(true);
			const timer = setTimeout(() => {
				setMostrarSucesso(false);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [sucesso]);

	return {
		mostrarSucesso,
		setMostrarSucesso,
	};
}
