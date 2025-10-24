/**
 * Hook de Autenticação Completo
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	login,
	registerCliente,
	registerEstabelecimento,
} from '@/lib/services/auth.service';
import {
	saveAuthToken,
	saveUserData,
	logout as logoutUtil,
	getUserData,
	getUserType,
	isAuthenticated as checkAuth,
} from '@/lib/utils/auth';
import type {
	LoginCredentials,
	RegisterClienteData,
	RegisterEstabelecimentoData,
	User,
	UserType,
} from '@/types';

interface UseAuthenticationReturn {
	user: User | null;
	userType: UserType | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	login: (credentials: LoginCredentials) => Promise<void>;
	registerCliente: (data: RegisterClienteData) => Promise<void>;
	registerEstabelecimento: (
		data: RegisterEstabelecimentoData
	) => Promise<void>;
	logout: () => void;
	clearError: () => void;
}

/**
 * Hook para gerenciar autenticação completa
 */
export function useAuthentication(): UseAuthenticationReturn {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(getUserData());
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const userType = getUserType();
	const isAuthenticated = checkAuth();

	/**
	 * Faz login do usuário
	 */
	const handleLogin = async (credentials: LoginCredentials) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await login(credentials);

			// Salva dados de autenticação
			saveAuthToken(response.token);
			saveUserData(response.user);
			setUser(response.user);

			// Redireciona baseado no tipo de usuário
			if (response.user.tipo === 'estabelecimento') {
				router.push('/estabelecimento');
			} else {
				router.push('/Agendar');
			}
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Erro ao fazer login';
			setError(message);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Registra um novo cliente
	 */
	const handleRegisterCliente = async (data: RegisterClienteData) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await registerCliente(data);

			// Salva dados de autenticação
			saveAuthToken(response.token);
			saveUserData(response.user);
			setUser(response.user);

			// Redireciona para área do cliente
			router.push('/Agendar');
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Erro ao criar conta';
			setError(message);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Registra um novo estabelecimento
	 */
	const handleRegisterEstabelecimento = async (
		data: RegisterEstabelecimentoData
	) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await registerEstabelecimento(data);

			// Salva dados de autenticação
			saveAuthToken(response.token);
			saveUserData(response.user);
			setUser(response.user);

			// Redireciona para área do estabelecimento
			router.push('/estabelecimento');
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Erro ao criar conta';
			setError(message);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Faz logout do usuário
	 */
	const handleLogout = () => {
		logoutUtil();
		setUser(null);
		router.push('/Login');
	};

	/**
	 * Limpa mensagem de erro
	 */
	const clearError = () => {
		setError(null);
	};

	return {
		user,
		userType,
		isAuthenticated,
		isLoading,
		error,
		login: handleLogin,
		registerCliente: handleRegisterCliente,
		registerEstabelecimento: handleRegisterEstabelecimento,
		logout: handleLogout,
		clearError,
	};
}
