/**
 * Card de Métrica do Dashboard
 */

interface MetricCardProps {
	title: string;
	value: string | number;
	icon: string;
	trend?: {
		value: string;
		isPositive: boolean;
	};
	iconColor?: string;
}

export function MetricCard({
	title,
	value,
	icon,
	trend,
	iconColor = 'bg-blue-500',
}: MetricCardProps) {
	return (
		<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-gray-500">{title}</p>
					<h3 className="text-2xl font-bold text-gray-800 mt-1">
						{value}
					</h3>
					{trend && (
						<p
							className={`text-sm mt-1 ${
								trend.isPositive
									? 'text-green-600'
									: 'text-red-600'
							}`}
						>
							{trend.isPositive ? '↑' : '↓'} {trend.value}
						</p>
					)}
				</div>
				<div
					className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}
				>
					<i className={`${icon} text-white text-xl`}></i>
				</div>
			</div>
		</div>
	);
}
