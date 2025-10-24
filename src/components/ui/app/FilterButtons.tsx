interface FilterOption<T = string> {
	value: T;
	label: string;
}

interface FilterButtonsProps<T = string> {
	options: FilterOption<T>[];
	activeFilter: T;
	onFilterChange: (filter: T) => void;
}

export function FilterButtons<T extends string = string>({
	options,
	activeFilter,
	onFilterChange,
}: FilterButtonsProps<T>) {
	return (
		<div className="max-w-7xl mx-auto mb-6">
			<div className="flex gap-2 overflow-x-auto pb-2">
				{options.map((option) => (
					<button
						key={String(option.value)}
						onClick={() => onFilterChange(option.value)}
						className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
							activeFilter === option.value
								? 'bg-blue-500 text-white'
								: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
						}`}
					>
						{option.label}
					</button>
				))}
			</div>
		</div>
	);
}
