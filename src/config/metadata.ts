import { Metadata } from 'next';

/**
 * Metadados da aplicação
 */
export const metadata: Metadata = {
	title: 'AgendaAi',
	description: 'Sistema de agendamento inteligente',
	keywords: ['agendamento', 'agenda', 'serviços', 'gestão'],
	authors: [{ name: 'AgendaAi Team' }],
	creator: 'AgendaAi',
	publisher: 'AgendaAi',
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		type: 'website',
		locale: 'pt_BR',
		title: 'AgendaAi',
		description: 'Sistema de agendamento inteligente',
		siteName: 'AgendaAi',
	},
};
