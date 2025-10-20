/**
 * Script para inicializar o estado da sidebar antes da hidratação do React
 * Previne o flash visual ao carregar a página
 */
export const sidebarInitScript = `
(function() {
	try {
		var sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
		if (sidebarCollapsed === 'true') {
			document.documentElement.classList.add('sidebar-collapsed');
		}
	} catch (e) {
		// Fallback silencioso se localStorage não estiver disponível
	}
})();
`;
