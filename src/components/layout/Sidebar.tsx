'use client';

import { ReactNode, cloneElement, isValidElement } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useSidebar } from '@/hooks';

interface SidebarProps {
	children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
	const { collapsed } = useSidebar();

	// Passar o estado collapsed para os filhos (NavSection e NavItem)
	const childrenWithProps = injectCollapsedProp(children, collapsed);

	return (
		<>
			<aside
				className={`
					hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40
					bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
					transition-all duration-300
					${collapsed ? 'w-16' : 'w-64'}
				`}
				style={{
					overflow: 'visible', // Permite que tooltips apareçam fora da sidebar
				}}
				suppressHydrationWarning
			>
				{/* Logo */}
				{/* Definimos uma altura fixa (h-20) para garantir que o cálculo da posição do botão seja sempre preciso */}
				<div
					className="h-20 p-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-800"
					suppressHydrationWarning
				>
					<Logo variant={collapsed ? 'icon' : 'full'} size="lg" />
				</div>

				{/* Navegação */}
				<nav className="px-3 flex-1 overflow-y-auto scrollbar-hide">
					{childrenWithProps}
				</nav>
			</aside>

			{/* Espaçamento para o conteúdo principal */}
			<div
				className={`hidden md:block transition-all duration-300 ${
					collapsed ? 'ml-16' : 'ml-64'
				}`}
			/>
		</>
	);
}

// Função auxiliar para injetar a prop collapsed recursivamente nos filhos
function injectCollapsedProp(
	children: ReactNode,
	collapsed: boolean
): ReactNode {
	return (
		<>
			{Array.isArray(children)
				? children.map((child, index) => {
						if (isValidElement(child)) {
							const childProps = child.props as {
								children?: ReactNode;
							};
							return cloneElement(child, {
								key: index,
								collapsed,
								children: childProps.children
									? injectCollapsedProp(
											childProps.children,
											collapsed
									  )
									: undefined,
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
							} as any);
						}
						return child;
				  })
				: isValidElement(children)
				? (() => {
						const childProps = children.props as {
							children?: ReactNode;
						};
						return cloneElement(children, {
							collapsed,
							children: childProps.children
								? injectCollapsedProp(
										childProps.children,
										collapsed
								  )
								: undefined,
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
						} as any);
				  })()
				: children}
		</>
	);
}
