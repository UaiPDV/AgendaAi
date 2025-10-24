import { CheckCircle } from 'lucide-react';

interface SuccessToastProps {
	show: boolean;
	title: string;
	message: string;
	onClose: () => void;
}

export function SuccessToast({
	show,
	title,
	message,
	onClose,
}: SuccessToastProps) {
	if (!show) return null;

	return (
		<div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
			<CheckCircle className="w-6 h-6" />
			<div>
				<p className="font-semibold">{title}</p>
				<p className="text-sm">{message}</p>
			</div>
			<button
				onClick={onClose}
				className="ml-4 text-white hover:text-gray-200"
			>
				×
			</button>
		</div>
	);
}
