'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { ReactNode } from 'react';

interface TopBarProps {
	actionLink?: {
		href: string;
		icon: ReactNode;
		label: string;
	};
}

export function TopBar({ actionLink }: TopBarProps) {
	return (
		<header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center z-10">
			{/* Logo visível no mobile */}
			<div className="md:hidden">
				<Logo variant="full" size="sm" />
			</div>

			{/* Título apenas no desktop */}
			<div className="hidden md:block">
				<h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
					AgendaAi
				</h1>
			</div>

			{/* Link de ação (se fornecido) */}
			{actionLink && (
				<Link
					href={actionLink.href}
					className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hidden md:flex items-center gap-1"
				>
					{actionLink.icon}
					{actionLink.label}
				</Link>
			)}
		</header>
	);
}
