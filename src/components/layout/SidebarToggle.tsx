'use client';

import { ToggleButton } from '@/components/ui/ToggleButton';
import { useSidebar } from '@/hooks';
import { dispatchCustomEvent } from '@/lib/utils';
import { CUSTOM_EVENTS } from '@/constants';

export function SidebarToggle() {
	const { collapsed, toggle: toggleSidebar } = useSidebar();

	const handleToggle = () => {
		toggleSidebar();

		// Disparar evento customizado para outros componentes
		dispatchCustomEvent(CUSTOM_EVENTS.SIDEBAR_TOGGLE, {
			collapsed: !collapsed,
		});
	};

	return (
		<div
			className={`
				hidden md:block fixed z-50
				transition-all duration-300
				${collapsed ? 'left-16' : 'left-64'}
			`}
			style={{
				// O `top` é calculado a partir da altura da área do logo (h-20 -> 5rem no Sidebar.tsx).
				// A fórmula é: (altura da área do logo) - (metade da altura do botão).
				// Assumindo que o botão tem 1.75rem de altura (0.875rem * 2).
				top: 'calc(5rem - 0.875rem)',
				transform: 'translateX(-50%)',
			}}
		>
			<ToggleButton collapsed={collapsed} onClick={handleToggle} />
		</div>
	);
}
