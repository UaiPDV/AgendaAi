'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarToggle } from '@/components/layout/SidebarToggle';
import { TopBar } from '@/components/layout/TopBar';
import { MobileNav } from '@/components/layout/MobileNav';
import { NavSection } from '@/components/ui/NavSection';
import { NavItem } from '@/components/ui/NavItem';
import { SidebarProvider } from '@/contexts/SidebarContext';
import {
	CalendarCheck,
	Receipt,
	History,
	UserCircle,
	Wallet,
	CreditCard,
	Bell,
	Star,
	Settings,
	Store,
} from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
				<Sidebar>
					<NavSection title="Cliente" isFirst>
						<NavItem
							href="/Agendar"
							icon={CalendarCheck}
							label="Agendar Serviço"
						/>
						<NavItem
							href="/agendamentos"
							icon={Receipt}
							label="Meus Agendamentos"
						/>
						<NavItem
							href="/historico"
							icon={History}
							label="Histórico"
						/>
						<NavItem
							href="/dados"
							icon={UserCircle}
							label="Meus Dados"
						/>
					</NavSection>

					<NavSection title="Financeiro">
						<NavItem
							href="/financas"
							icon={Wallet}
							label="Minhas Finanças"
						/>
						<NavItem
							href="/pagamentos"
							icon={CreditCard}
							label="Formas de Pagamento"
						/>
					</NavSection>

					<NavSection title="Outros">
						<NavItem
							href="/notificacoes"
							icon={Bell}
							label="Notificações"
						/>
						<NavItem
							href="/avaliacoes"
							icon={Star}
							label="Avaliações"
						/>
						<NavItem
							href="/configuracoes"
							icon={Settings}
							label="Configurações"
						/>
					</NavSection>
				</Sidebar>

				<div className="flex-1 flex flex-col">
					<SidebarToggle />
					<TopBar
						actionLink={{
							href: '/estabelecimento',
							icon: <Store size={16} />,
							label: 'Área do Estabelecimento',
						}}
					/>

					<main className="flex-1 p-4 sm:p-6 md:p-10 pb-24 md:pb-10">
						{children}
					</main>

					<MobileNav
						items={[
							{
								href: '/Agendar',
								icon: CalendarCheck,
								label: 'Início',
							},
							{
								href: '/agendamentos',
								icon: Receipt,
								label: 'Agendamentos',
							},
							{
								href: '/historico',
								icon: History,
								label: 'Histórico',
							},
							{ href: '/menu', icon: Store, label: 'Menu' },
						]}
					/>
				</div>
			</div>
		</SidebarProvider>
	);
}
