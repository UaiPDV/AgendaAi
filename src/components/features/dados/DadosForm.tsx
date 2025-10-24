import { User, Mail, Phone, Calendar, CreditCard, Save } from 'lucide-react';
import { FormField, ActionButton } from '@/components/ui/app';
import type { DadosUsuario } from '@/types';

interface DadosFormProps {
	dados: DadosUsuario;
	onChange: (dados: DadosUsuario) => void;
	onSubmit: (e: React.FormEvent) => void;
	loading?: boolean;
}

export function DadosForm({
	dados,
	onChange,
	onSubmit,
	loading = false,
}: DadosFormProps) {
	const handleChange = (field: keyof DadosUsuario, value: string) => {
		onChange({ ...dados, [field]: value });
	};

	return (
		<form
			onSubmit={onSubmit}
			className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
		>
			<FormField
				label="Nome Completo"
				icon={User}
				type="text"
				value={dados.nome}
				onChange={(e) => handleChange('nome', e.target.value)}
				required
			/>

			<FormField
				label="E-mail"
				icon={Mail}
				type="email"
				value={dados.email}
				onChange={(e) => handleChange('email', e.target.value)}
				required
			/>

			<FormField
				label="Telefone"
				icon={Phone}
				type="tel"
				value={dados.telefone}
				onChange={(e) => handleChange('telefone', e.target.value)}
				required
			/>

			<FormField
				label="CPF"
				icon={CreditCard}
				type="text"
				value={dados.cpf}
				onChange={(e) => handleChange('cpf', e.target.value)}
				required
			/>

			<FormField
				label="Data de Nascimento"
				icon={Calendar}
				type="date"
				value={dados.dataNascimento}
				onChange={(e) => handleChange('dataNascimento', e.target.value)}
				required
			/>

			<ActionButton
				type="submit"
				icon={Save}
				variant="primary"
				fullWidth
				loading={loading}
				className="bg-green-500 hover:bg-green-600"
			>
				Salvar Alterações
			</ActionButton>
		</form>
	);
}
