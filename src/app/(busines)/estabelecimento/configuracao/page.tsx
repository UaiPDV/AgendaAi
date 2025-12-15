'use client';

import { useEffect, useState } from 'react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import { getAuthToken } from '@/lib/utils/auth';
import type { PreferenciasNotificacao } from '@/types/cliente';

type NotificacaoResponse = {
	notif_lembretes?: boolean | number | null;
	notif_promocoes?: boolean | number | null;
};

export default function ConfiguracaoPage() {
	const [prefs, setPrefs] = useState<PreferenciasNotificacao>({
		lembretes: true,
		promocoes: true,
		confirmacoes: true,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetch() {
			const token = getAuthToken();
			if (!token) {
				setLoading(false);
				return;
			}
			try {
				const config = await apiRequest<NotificacaoResponse>(
					API_ENDPOINTS.CONFIGURACOES_ME,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setPrefs({
					lembretes: Boolean(config?.notif_lembretes ?? true),
					promocoes: Boolean(config?.notif_promocoes ?? true),
					confirmacoes: true,
				});
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		fetch();
	}, []);

	async function save() {
		const token = getAuthToken();
		if (!token) return;
		try {
			await fetch(API_ENDPOINTS.USUARIO_ME, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					notif_lembretes: prefs.lembretes,
					notif_promocoes: prefs.promocoes,
				}),
			});
			alert('Preferências salvas');
		} catch (err) {
			console.error(err);
			alert('Erro ao salvar preferências');
		}
	}

	return (
		<div className="animate-fade-in">
			<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
				Configurações
			</h1>

			<div className="mt-6 max-w-md">
				{loading ? (
					<p className="text-sm text-gray-500">Carregando...</p>
				) : (
					<div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded">
						<label className="flex items-center justify-between">
							<span className="text-sm text-gray-700 dark:text-gray-200">
								Lembretes
							</span>
							<input
								type="checkbox"
								checked={prefs.lembretes}
								onChange={(e) =>
									setPrefs({
										...prefs,
										lembretes: e.target.checked,
									})
								}
							/>
						</label>

						<label className="flex items-center justify-between">
							<span className="text-sm text-gray-700 dark:text-gray-200">
								Promoções
							</span>
							<input
								type="checkbox"
								checked={prefs.promocoes}
								onChange={(e) =>
									setPrefs({
										...prefs,
										promocoes: e.target.checked,
									})
								}
							/>
						</label>

						<label className="flex items-center justify-between">
							<span className="text-sm text-gray-700 dark:text-gray-200">
								Confirmações
							</span>
							<input
								type="checkbox"
								checked={prefs.confirmacoes}
								onChange={(e) =>
									setPrefs({
										...prefs,
										confirmacoes: e.target.checked,
									})
								}
							/>
						</label>

						<div className="pt-2">
							<button
								onClick={save}
								className="px-4 py-2 bg-blue-600 text-white rounded"
							>
								Salvar
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
