'use client';

/**
 * Página Meus Dados - Informações pessoais do usuário
 * Refatorada com Clean Architecture
 */

import { useUsuario } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { PageContainer, PageHeader } from '@/components/ui/app';
import { DadosForm } from '@/components/features/dados';
import { User } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { DadosUsuario } from '@/types';

export default function DadosPage() {
	const { dados, loading, error, atualizarDados } = useUsuario();
	const [formData, setFormData] = useState<DadosUsuario>({
		nome: '',
		cpf: '',
		email: '',
		telefone: '',
		dataNascimento: '',
	});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (dados) {
			setFormData({
				nome: dados.nome ?? '',
				cpf: dados.cpf ?? '',
				email: dados.email ?? '',
				telefone: dados.telefone ?? '',
				dataNascimento: dados.dataNascimento ?? '',
			});
		}
	}, [dados]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		const sucesso = await atualizarDados(formData);
		setSaving(false);

		if (sucesso) {
			alert('Dados atualizados com sucesso!');
		} else {
			alert('Erro ao atualizar dados');
		}
	};

	return (
		<PageContainer>
			<PageHeader
				icon={User}
				title="Meus Dados"
				description="Gerencie suas informações pessoais"
				iconColor="text-green-500"
			/>

			{loading && <LoadingSpinner />}
			{error && <ErrorMessage message={error} />}

			{!loading && !error && dados && (
				<div className="max-w-3xl mx-auto">
					<DadosForm
						dados={formData}
						onChange={setFormData}
						onSubmit={handleSubmit}
						loading={saving}
					/>
				</div>
			)}
		</PageContainer>
	);
}
