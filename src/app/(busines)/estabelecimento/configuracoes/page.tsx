'use client';

import { useTheme } from '@/hooks';
import {
	SettingsCard,
	SettingsItem,
	SettingsButton,
	Switch,
	LanguageSelector,
} from '@/components/ui';

export default function ConfiguracoesEstabelecimentoPage() {
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
					Configurações
				</h2>
				<p className="mt-1 text-gray-500 dark:text-gray-400">
					Gerencie as configurações do estabelecimento.
				</p>
			</div>

			<div className="space-y-6">
				{/* Preferências */}
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

				{/* Segurança */}
				<SettingsCard title="Segurança">
					<SettingsButton showArrow>Alterar Senha</SettingsButton>

					<SettingsButton showArrow>
						Autenticação em Dois Fatores
					</SettingsButton>
				</SettingsCard>

				{/* Conta */}
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
