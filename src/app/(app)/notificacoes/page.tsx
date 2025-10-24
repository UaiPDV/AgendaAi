'use client';

/**
 * Página Notificações - Preferências de notificações
 * Refatorada com Clean Architecture
 */

import { useUsuario } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { PageContainer, PageHeader } from '@/components/ui/app';
import { NotificationSettings } from '@/components/features/notificacoes';
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { PreferenciasNotificacao } from '@/types';

export default function NotificacoesPage() {
	const { preferenciasNotificacao, loading, error, atualizarPreferencias } =
		useUsuario();
	const [preferencias, setPreferencias] = useState<PreferenciasNotificacao>({
		lembretes: false,
		promocoes: false,
		confirmacoes: false,
	});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (preferenciasNotificacao) {
			setPreferencias(preferenciasNotificacao);
		}
	}, [preferenciasNotificacao]);

	const handleSalvar = async () => {
		setSaving(true);
		const sucesso = await atualizarPreferencias(preferencias);
		setSaving(false);

		if (sucesso) {
			alert('Preferências salvas com sucesso!');
		} else {
			alert('Erro ao salvar preferências');
		}
	};

	return (
		<PageContainer>
			<PageHeader
				icon={Bell}
				title="Notificações"
				description="Configure suas preferências de notificação"
				iconColor="text-red-500"
			/>

			{loading && <LoadingSpinner />}
			{error && <ErrorMessage message={error} />}

			{!loading && !error && preferenciasNotificacao && (
				<div className="max-w-3xl mx-auto">
					<NotificationSettings
						preferencias={preferencias}
						onChange={setPreferencias}
						onSave={handleSalvar}
						loading={saving}
					/>
				</div>
			)}
		</PageContainer>
	);
}
