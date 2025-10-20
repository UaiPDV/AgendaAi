interface LanguageSelectorProps {
	value?: string;
	onChange?: (value: string) => void;
}

export function LanguageSelector({
	value = 'pt-BR',
	onChange,
}: LanguageSelectorProps) {
	return (
		<select
			value={value}
			onChange={(e) => onChange?.(e.target.value)}
			className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
		>
			<option value="pt-BR">Português (BR)</option>
			<option value="en">English</option>
			<option value="es">Español</option>
		</select>
	);
}
