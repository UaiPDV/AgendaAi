import { LucideIcon } from 'lucide-react';

/**
 * Tipos relacionados à navegação
 */
export interface NavItemData {
	href: string;
	icon: LucideIcon;
	label: string;
}

export interface NavSectionData {
	title?: string;
	items: NavItemData[];
}

export interface ActionLink {
	href: string;
	icon: React.ReactNode;
	label: string;
}
