'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/utils/auth';

/**
 * Hook para gerenciar redirecionamento baseado em autenticação
 * @param {Object} options - Opções de redirecionamento
 * @param {string} options.authenticatedRedirect - URL para redirecionar se autenticado
 * @param {string} options.unauthenticatedRedirect - URL para redirecionar se não autenticado
 * @param {boolean} options.requireAuth - Se true, requer autenticação (redireciona se não autenticado)
 */
interface UseAuthRedirectOptions {
	authenticatedRedirect?: string;
	unauthenticatedRedirect?: string;
	requireAuth?: boolean;
}

export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
	const router = useRouter();
	const {
		authenticatedRedirect = '/Agendar',
		unauthenticatedRedirect = '/Login',
		requireAuth = false,
	} = options;

	useEffect(() => {
		const checkAuthAndRedirect = () => {
			const authenticated = isAuthenticated();

			if (authenticated && authenticatedRedirect) {
				// Usuário está autenticado, redirecionar para área autenticada
				router.push(authenticatedRedirect);
			} else if (!authenticated && unauthenticatedRedirect) {
				// Usuário não está autenticado, redirecionar para login
				// Só redireciona se requireAuth for true OU se ambos os redirects estiverem definidos
				if (
					requireAuth ||
					(authenticatedRedirect && unauthenticatedRedirect)
				) {
					router.push(unauthenticatedRedirect);
				}
			}
		};

		checkAuthAndRedirect();
	}, [router, authenticatedRedirect, unauthenticatedRedirect, requireAuth]);
}

/**
 * Hook simples para verificar se o usuário está autenticado
 * @returns {boolean} true se o usuário está autenticado
 */
export function useAuth(): boolean {
	return isAuthenticated();
}
