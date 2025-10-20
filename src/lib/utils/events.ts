/**
 * Utilitários para trabalhar com eventos customizados
 */

/**
 * Dispara um evento customizado
 */
export function dispatchCustomEvent<T = unknown>(
	eventName: string,
	detail?: T
): void {
	if (typeof window === 'undefined') return;

	window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

/**
 * Adiciona um listener para evento customizado
 */
export function addCustomEventListener<T = unknown>(
	eventName: string,
	handler: (event: CustomEvent<T>) => void
): () => void {
	if (typeof window === 'undefined') {
		return () => {}; // Retorna função vazia para cleanup
	}

	const listener = (e: Event) => handler(e as CustomEvent<T>);
	window.addEventListener(eventName, listener);

	// Retorna função de cleanup
	return () => window.removeEventListener(eventName, listener);
}
