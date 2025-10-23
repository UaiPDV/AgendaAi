'use client';

import { useTheme } from '@/hooks';
import {
	SettingsCard,
	SettingsItem,
	SettingsButton,
	Switch,
	LanguageSelector,
} from '@/components/ui';

export default function ConfiguracoesPage() {
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="space-y-6">
			<header>
				<h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
					Configura��es
				</h2>
				<p className="mt-1 text-gray-500 dark:text-gray-400">
					Gerencie as configura��es da sua conta.
				</p>
			</header>

			<div className="space-y-6">
				<SettingsCard title="Prefer�ncias">
					<SettingsItem
						label="Tema Escuro"
						description="Ative o modo escuro para melhor visualiza��o noturna"
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

				<SettingsCard title="Seguran�a">
					<SettingsButton showArrow>Alterar Senha</SettingsButton>
					<SettingsButton showArrow>
						Autentica��o em Dois Fatores
					</SettingsButton>
				</SettingsCard>

				<SettingsCard title="Conta">
					<SettingsButton>Sair da Conta</SettingsButton>
					<SettingsButton variant="danger">
						Excluir Conta
					</SettingsButton>
				</SettingsCard>
			</div>
		</div>
	);
}
