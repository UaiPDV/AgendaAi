import { Save } from 'lucide-react';
import { ActionButton } from '@/components/ui/app';
import { PreferenceToggle } from './PreferenceToggle';
import type { PreferenciasNotificacao } from '@/types';

interface NotificationSettingsProps {
	preferencias: PreferenciasNotificacao;
	onChange: (preferencias: PreferenciasNotificacao) => void;
	onSave: () => void;
	loading?: boolean;
}

export function NotificationSettings({
	preferencias,
	onChange,
	onSave,
	loading = false,
}: NotificationSettingsProps) {
	const handleToggle = (
		key: keyof PreferenciasNotificacao,
		checked: boolean
	) => {
		onChange({ ...preferencias, [key]: checked });
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
			<PreferenceToggle
				title="Lembretes de Agendamento"
				description="Receba lembretes antes dos seus agendamentos"
				checked={preferencias.lembretes}
				onCheckedChange={(checked) =>
					handleToggle('lembretes', checked)
				}
			/>

			<PreferenceToggle
				title="Promoções e Ofertas"
				description="Receba notificações sobre promoções e ofertas especiais"
				checked={preferencias.promocoes}
				onCheckedChange={(checked) =>
					handleToggle('promocoes', checked)
				}
			/>

			<PreferenceToggle
				title="Confirmações"
				description="Receba confirmações de agendamentos e pagamentos"
				checked={preferencias.confirmacoes}
				onCheckedChange={(checked) =>
					handleToggle('confirmacoes', checked)
				}
			/>

			<ActionButton
				onClick={onSave}
				icon={Save}
				variant="primary"
				fullWidth
				loading={loading}
				className="bg-red-500 hover:bg-red-600"
			>
				Salvar Preferências
			</ActionButton>
		</div>
	);
}
