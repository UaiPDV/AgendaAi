'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

interface MobileNavItem {
	href: string;
	icon: LucideIcon;
	label: string;
}

interface MobileNavProps {
	items: MobileNavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
	const pathname = usePathname();

	return (
		<footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around p-2 z-20">
			{items.map((item) => {
				const Icon = item.icon;
				const isActive =
					pathname === item.href ||
					pathname.startsWith(`${item.href}/`);

				return (
					<Link
						key={item.href}
						href={item.href}
						className={`
							flex flex-col items-center w-full pt-2 pb-1 transition-colors
							${
								isActive
									? 'text-gray-800 dark:text-gray-100'
									: 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
							}
						`}
					>
						<Icon size={20} />
						<span className="text-xs mt-1">{item.label}</span>
					</Link>
				);
			})}
		</footer>
	);
}
