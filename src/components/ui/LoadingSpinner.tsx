/**
 * Componente de Loading Spinner
 */

export function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center py-12">
			<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
		</div>
	);
}
