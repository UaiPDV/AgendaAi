'use client';

import { useTheme } from '@/hooks';
import {
	SettingsCard,
	SettingsItem,
	SettingsButton,
	Switch,
	LanguageSelector,
	LogoutButton,
} from '@/components/ui';

export default function ConfiguracoesPage() {
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="space-y-6">
			<header>
				<h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
					Configurações
				</h2>
				<p className="mt-1 text-gray-500 dark:text-gray-400">
					Gerencie as configurações da sua conta.
				</p>
			</header>

			<div className="space-y-6">
				<SettingsCard title="Preferências">
					<SettingsItem
						label="Tema Escuro"
						description="Ative o modo escuro para melhor visualização noturna"
						control={
							<Switch
								checked={theme === 'dark'}
								onCheckedChange={toggleTheme}
							/>
						}
					/>

					<SettingsItem
						label="Idioma"
						control={<LanguageSelector />}
					/>
				</SettingsCard>

				<SettingsCard title="Segurança">
					<SettingsButton showArrow>Alterar Senha</SettingsButton>
					<SettingsButton showArrow>
						Autenticação em Dois Fatores
					</SettingsButton>
				</SettingsCard>

				<SettingsCard title="Conta">
					<div className="space-y-3">
						<LogoutButton variant="danger" fullWidth />
						<SettingsButton variant="danger">
							Excluir Conta
						</SettingsButton>
					</div>
				</SettingsCard>
			</div>
		</div>
	);
}
