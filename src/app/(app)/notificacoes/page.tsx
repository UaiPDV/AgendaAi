'use client';

/**
 * Página Notificações - Preferências de notificações
 */

import { useUsuario } from '@/hooks';
import { LoadingSpinner, ErrorMessage, Switch } from '@/components/ui';
import { Bell, Save } from 'lucide-react';
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
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			{/* Header */}
			<div className="max-w-3xl mx-auto mb-8">
				<div className="flex items-center gap-3 mb-2">
					<Bell className="w-8 h-8 text-red-500" />
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Notificações
					</h1>
				</div>
				<p className="text-gray-600 dark:text-gray-400">
					Configure suas preferências de notificação
				</p>
			</div>

			{/* Loading State */}
			{loading && <LoadingSpinner />}

			{/* Error State */}
			{error && <ErrorMessage message={error} />}

			{/* Preferências */}
			{!loading && !error && preferenciasNotificacao && (
				<div className="max-w-3xl mx-auto">
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
						{/* Lembretes */}
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
									Lembretes de Agendamento
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Receba lembretes antes dos seus agendamentos
								</p>
							</div>
							<Switch
								checked={preferencias.lembretes}
								onCheckedChange={(checked: boolean) =>
									setPreferencias({
										...preferencias,
										lembretes: checked,
									})
								}
							/>
						</div>

						<div className="border-t border-gray-200 dark:border-gray-700" />

						{/* Promoções */}
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
									Promoções e Ofertas
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Receba notificações sobre promoções e
									ofertas especiais
								</p>
							</div>
							<Switch
								checked={preferencias.promocoes}
								onCheckedChange={(checked: boolean) =>
									setPreferencias({
										...preferencias,
										promocoes: checked,
									})
								}
							/>
						</div>

						<div className="border-t border-gray-200 dark:border-gray-700" />

						{/* Confirmações */}
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
									Confirmações
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Receba confirmações de agendamentos e
									pagamentos
								</p>
							</div>
							<Switch
								checked={preferencias.confirmacoes}
								onCheckedChange={(checked: boolean) =>
									setPreferencias({
										...preferencias,
										confirmacoes: checked,
									})
								}
							/>
						</div>

						<div className="border-t border-gray-200 dark:border-gray-700" />

						{/* Botão Salvar */}
						<button
							onClick={handleSalvar}
							disabled={saving}
							className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Save className="w-5 h-5" />
							{saving ? 'Salvando...' : 'Salvar Preferências'}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
