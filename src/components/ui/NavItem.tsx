'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface NavItemProps {
	href: string;
	icon: LucideIcon;
	label: string;
	collapsed?: boolean;
	tooltip?: ReactNode;
}

export function NavItem({
	href,
	icon: Icon,
	label,
	collapsed = false,
}: NavItemProps) {
	const pathname = usePathname();
	const isActive = pathname === href || pathname.startsWith(`${href}/`);

	return (
		<Link
			href={href}
			className={`
				group relative flex items-center text-sm font-medium rounded-md transition-all
				${collapsed ? 'justify-center px-3 py-2' : 'justify-start px-3 py-2'}
				${
					isActive
						? 'bg-gray-800 text-white dark:bg-gray-700'
						: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
				}
			`}
		>
			<Icon
				className={`flex-shrink-0 ${
					collapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'
				}`}
			/>
			{!collapsed && <span>{label}</span>}

			{/* Tooltip para sidebar colapsada */}
			{collapsed && (
				<span
					className="
						fixed px-3 py-2 
						bg-gray-800 dark:bg-gray-700 text-white text-sm rounded-md 
						opacity-0 group-hover:opacity-100 pointer-events-none 
						transition-opacity whitespace-nowrap shadow-lg
					"
					style={{
						left: '4.5rem', // 4rem (sidebar) + 0.5rem (espaçamento)
						zIndex: 9999,
					}}
				>
					{label}
				</span>
			)}
		</Link>
	);
}
