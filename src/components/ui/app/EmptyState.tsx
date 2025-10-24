interface EmptyStateProps {
	message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
	return (
		<div className="text-center py-12">
			<p className="text-gray-600 dark:text-gray-400">{message}</p>
		</div>
	);
}
