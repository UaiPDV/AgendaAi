/**
 * Componente de Diálogo de Confirmação
 * Modal reutilizável para confirmações de ações destrutivas
 */

'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	type?: 'danger' | 'warning' | 'info';
	isLoading?: boolean;
}

export function ConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	type = 'danger',
	isLoading = false,
}: ConfirmDialogProps) {
	if (!isOpen) return null;

	const typeStyles = {
		danger: {
			icon: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
			button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
		},
		warning: {
			icon: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
			button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
		},
		info: {
			icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
			button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
		},
	};

	const styles = typeStyles[type];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-in fade-in duration-200">
			<div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-xl animate-in zoom-in-95 duration-200">
				<div className="p-6">
					<div className="flex items-start gap-4">
						<div
							className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${styles.icon}`}
						>
							<AlertTriangle size={24} />
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
								{title}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{message}
							</p>
						</div>
						<button
							onClick={onClose}
							disabled={isLoading}
							className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
						>
							<X size={20} />
						</button>
					</div>
				</div>
				<div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg flex gap-3 justify-end">
					<button
						onClick={onClose}
						disabled={isLoading}
						className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{cancelText}
					</button>
					<button
						onClick={onConfirm}
						disabled={isLoading}
						className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button}`}
					>
						{isLoading ? 'Processando...' : confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
