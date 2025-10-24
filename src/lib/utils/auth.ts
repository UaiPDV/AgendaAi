/**
 * Utilitários para autenticação
 */

import { STORAGE_KEYS } from '@/constants';
import type { User, UserType } from '@/types';

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
	if (typeof window === 'undefined') {
		return false;
	}
	const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
	return !!token;
}

/**
 * Salva o token de autenticação
 */
export function saveAuthToken(token: string): void {
	if (typeof window === 'undefined') {
		return;
	}
	localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * Remove o token de autenticação (logout)
 */
export function removeAuthToken(): void {
	if (typeof window === 'undefined') {
		return;
	}
	localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Obtém o token de autenticação
 */
export function getAuthToken(): string | null {
	if (typeof window === 'undefined') {
		return null;
	}
	return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Salva os dados do usuário no localStorage
 */
export function saveUserData(user: User): void {
	if (typeof window === 'undefined') {
		return;
	}
	localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
}

/**
 * Obtém os dados do usuário do localStorage
 */
export function getUserData(): User | null {
	if (typeof window === 'undefined') {
		return null;
	}
	const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
	if (data) {
		try {
			return JSON.parse(data) as User;
		} catch {
			return null;
		}
	}
	return null;
}

/**
 * Remove os dados do usuário do localStorage
 */
export function removeUserData(): void {
	if (typeof window === 'undefined') {
		return;
	}
	localStorage.removeItem(STORAGE_KEYS.USER_DATA);
}

/**
 * Obtém o tipo de usuário
 */
export function getUserType(): UserType | null {
	const user = getUserData();
	return user?.tipo || null;
}

/**
 * Verifica se o usuário é um cliente
 */
export function isCliente(): boolean {
	return getUserType() === 'cliente';
}

/**
 * Verifica se o usuário é um estabelecimento
 */
export function isEstabelecimento(): boolean {
	return getUserType() === 'estabelecimento';
}

/**
 * Faz logout limpando todos os dados de autenticação
 */
export function logout(): void {
	removeAuthToken();
	removeUserData();
}
