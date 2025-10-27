'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LucideIcon, ChevronDown } from 'lucide-react';

interface NavDropdownItem {
	href: string;
	icon: LucideIcon;
	label: string;
}

interface NavDropdownProps {
	icon: LucideIcon;
	label: string;
	items: NavDropdownItem[];
	collapsed?: boolean;
}

export function NavDropdown({
	icon: Icon,
	label,
	items,
	collapsed = false,
}: NavDropdownProps) {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(() => {
		// Abre automaticamente se algum item filho estiver ativo
		return items.some(
			(item) =>
				pathname === item.href || pathname.startsWith(`${item.href}/`)
		);
	});

	const hasActiveChild = items.some(
		(item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
	);

	if (collapsed) {
		// Modo colapsado: exibe como um menu simples com tooltip
		return (
			<div className="relative group">
				<div
					className={`
						flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all cursor-pointer
						${
							hasActiveChild
								? 'bg-gray-800 text-white dark:bg-gray-700'
								: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
						}
					`}
				>
					<Icon className="w-5 h-5 flex-shrink-0" />
				</div>

				{/* Submenu em tooltip */}
				<div
					className="
						fixed px-2 py-2 
						bg-gray-800 dark:bg-gray-700 text-white text-sm rounded-md 
						opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
						transition-opacity shadow-lg min-w-[180px]
					"
					style={{
						left: '4.5rem',
						zIndex: 9999,
					}}
				>
					<div className="font-medium px-2 py-1 mb-1 border-b border-gray-600">
						{label}
					</div>
					{items.map((item) => {
						const ItemIcon = item.icon;
						const isActive =
							pathname === item.href ||
							pathname.startsWith(`${item.href}/`);

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`
									flex items-center px-2 py-1.5 rounded transition-colors
									${
										isActive
											? 'bg-gray-700 dark:bg-gray-600'
											: 'hover:bg-gray-700 dark:hover:bg-gray-600'
									}
								`}
							>
								<ItemIcon className="w-4 h-4 mr-2" />
								{item.label}
							</Link>
						);
					})}
				</div>
			</div>
		);
	}

	// Modo expandido: dropdown normal
	return (
		<div className="space-y-1">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`
					w-full group relative flex items-center justify-between text-sm font-medium rounded-md transition-all px-3 py-2
					${
						hasActiveChild
							? 'bg-gray-800 text-white dark:bg-gray-700'
							: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
					}
				`}
			>
				<div className="flex items-center">
					<Icon className="w-5 h-5 mr-3 flex-shrink-0" />
					<span>{label}</span>
				</div>
				<ChevronDown
					className={`w-4 h-4 transition-transform ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</button>

			{/* Submenu */}
			{isOpen && (
				<div className="ml-4 space-y-1">
					{items.map((item) => {
						const ItemIcon = item.icon;
						const isActive =
							pathname === item.href ||
							pathname.startsWith(`${item.href}/`);

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`
									flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all
									${
										isActive
											? 'bg-gray-800 text-white dark:bg-gray-700'
											: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
									}
								`}
							>
								<ItemIcon className="w-4 h-4 mr-3 flex-shrink-0" />
								<span>{item.label}</span>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
