import { Search } from 'lucide-react';

interface SearchBarProps {
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
}

export function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
	return (
		<div className="max-w-7xl mx-auto mb-6">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
				<input
					type="text"
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</div>
	);
}
