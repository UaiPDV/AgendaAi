/**
 * Componente de Mensagem de Erro
 */

import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
	message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<AlertCircle className="w-12 h-12 text-red-500 mb-4" />
			<p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
				Ops! Algo deu errado
			</p>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				{message}
			</p>
		</div>
	);
}
