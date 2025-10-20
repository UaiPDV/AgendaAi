/**
 * Script para inicializar o tema antes da hidratação do React
 * Previne o flash visual de tema ao carregar a página
 */
export const themeInitScript = `
(function() {
	try {
		// Configurar tema ANTES da renderização
		var theme = localStorage.getItem('theme');
		if (!theme) {
			// Se não houver tema salvo, usar preferência do sistema
			var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
			theme = prefersDark ? 'dark' : 'light';
		}
		document.documentElement.setAttribute('data-theme', theme);
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		}
	} catch (e) {
		// Fallback silencioso se localStorage não estiver disponível
	}
})();
`;
