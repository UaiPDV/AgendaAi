import { Switch } from '@/components/ui';

interface PreferenceToggleProps {
	title: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}

export function PreferenceToggle({
	title,
	description,
	checked,
	onCheckedChange,
}: PreferenceToggleProps) {
	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
						{title}
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{description}
					</p>
				</div>
				<Switch checked={checked} onCheckedChange={onCheckedChange} />
			</div>
			<div className="border-t border-gray-200 dark:border-gray-700" />
		</>
	);
}
