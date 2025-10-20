'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarToggle } from '@/components/layout/SidebarToggle';
import { TopBar } from '@/components/layout/TopBar';
import { MobileNav } from '@/components/layout/MobileNav';
import { NavSection } from '@/components/ui/NavSection';
import { NavItem } from '@/components/ui/NavItem';
import { SidebarProvider } from '@/contexts/SidebarContext';
import {
	PieChart,
	Calendar,
	History,
	Briefcase,
	Users,
	UserCheck,
	Store,
	DollarSign,
	BarChart3,
	Settings,
	User,
} from 'lucide-react';

export default function BusinessLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
				<Sidebar>
					<NavSection title="Principal" isFirst>
						<NavItem
							href="/estabelecimento/dashboard"
							icon={PieChart}
							label="Dashboard"
						/>
						<NavItem
							href="/estabelecimento/agenda"
							icon={Calendar}
							label="Agenda"
						/>
						<NavItem
							href="/estabelecimento/historico"
							icon={History}
							label="Histórico"
						/>
					</NavSection>

					<NavSection title="Gerenciamento">
						<NavItem
							href="/estabelecimento/servicos"
							icon={Briefcase}
							label="Serviços"
						/>
						<NavItem
							href="/estabelecimento/profissionais"
							icon={Users}
							label="Profissionais"
						/>
						<NavItem
							href="/estabelecimento/clientes"
							icon={UserCheck}
							label="Clientes"
						/>
						<NavItem
							href="/estabelecimento/configuracao"
							icon={Store}
							label="Config. Estabelecimento"
						/>
					</NavSection>

					<NavSection title="Financeiro">
						<NavItem
							href="/estabelecimento/financeiro"
							icon={DollarSign}
							label="Ganhos"
						/>
						<NavItem
							href="/estabelecimento/relatorios"
							icon={BarChart3}
							label="Relatórios"
						/>
					</NavSection>

					<NavSection title="Outros">
						<NavItem
							href="/estabelecimento/configuracoes"
							icon={Settings}
							label="Configurações"
						/>
					</NavSection>
				</Sidebar>

				<div className="flex-1 flex flex-col">
					<SidebarToggle />
					<TopBar
						actionLink={{
							href: '/Agendar',
							icon: <User size={16} />,
							label: 'Área do Cliente',
						}}
					/>

					<main className="flex-1 p-4 sm:p-6 md:p-10 pb-24 md:pb-10">
						{children}
					</main>

					<MobileNav
						items={[
							{
								href: '/estabelecimento/dashboard',
								icon: PieChart,
								label: 'Dashboard',
							},
							{
								href: '/estabelecimento/agenda',
								icon: Calendar,
								label: 'Agenda',
							},
							{
								href: '/estabelecimento/historico',
								icon: History,
								label: 'Histórico',
							},
							{
								href: '/estabelecimento/menu',
								icon: Store,
								label: 'Menu',
							},
						]}
					/>
				</div>
			</div>
		</SidebarProvider>
	);
}
