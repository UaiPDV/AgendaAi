'use client';

/**
 * Fluxo de Agendamento - 3 Passos
 * 1. Escolher Profissional
 * 2. Escolher Data e Hora
 * 3. Confirmar Agendamento
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';
import type {
	Estabelecimento,
	Servico,
	Profissional,
	AgendamentoFluxo,
} from '@/types';

// Importar os componentes de cada passo
import {
	PassoEscolhaProfissional,
	PassoEscolhaDataHora,
	PassoConfirmacao,
} from '@/components/agendamento';

export default function FluxoAgendamento() {
	const router = useRouter();
	const params = useParams();
	const searchParams = useSearchParams();

	const estabelecimentoId = params.id as string;
	const servicoId = searchParams.get('servicoId');

	const [passoAtual, setPassoAtual] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [estabelecimento, setEstabelecimento] =
		useState<Estabelecimento | null>(null);
	const [servico, setServico] = useState<Servico | null>(null);
	const [profissionais, setProfissionais] = useState<Profissional[]>([]);

	const [agendamento, setAgendamento] = useState<AgendamentoFluxo>({});

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				setError(null);

				// Buscar estabelecimento
				const estabelecimentoData = await apiRequest<Estabelecimento>(
					API_ENDPOINTS.ESTABELECIMENTO_BY_ID(
						Number(estabelecimentoId)
					)
				);
				setEstabelecimento(estabelecimentoData);

				// Buscar serviços
				const servicosData = await apiRequest<Servico[]>(
					API_ENDPOINTS.ESTABELECIMENTO_SERVICOS(
						Number(estabelecimentoId)
					)
				);
				const servicoEncontrado = servicosData.find(
					(s) => s.id === servicoId
				);

				if (!servicoEncontrado) {
					throw new Error('Serviço não encontrado');
				}
				setServico(servicoEncontrado);

				// Buscar profissionais
				const profissionaisData = await apiRequest<Profissional[]>(
					API_ENDPOINTS.ESTABELECIMENTO_PROFISSIONAIS(
						Number(estabelecimentoId)
					)
				);
				setProfissionais(profissionaisData);
			} catch (err) {
				setError('Erro ao carregar dados');
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [estabelecimentoId, servicoId]);

	const voltarPagina = () => {
		router.push(`/Agendar/${estabelecimentoId}`);
	};

	const selecionarProfissional = (profissional: Profissional) => {
		setAgendamento((prev) => ({ ...prev, profissional }));
		setPassoAtual(2);
	};

	const selecionarDataHora = (data: string, horario: string) => {
		setAgendamento((prev) => ({ ...prev, data, horario }));
		setPassoAtual(3);
	};

	const voltarPasso = () => {
		setPassoAtual((prev) => Math.max(1, prev - 1));
	};

	const confirmarAgendamento = async () => {
		try {
			setLoading(true);

			// Criar agendamento na API
			await apiRequest(API_ENDPOINTS.AGENDAMENTOS, {
				method: 'POST',
				body: JSON.stringify({
					estabelecimentoId: Number(estabelecimentoId),
					servicoId: servico?.id,
					profissionalId: agendamento.profissional?.id,
					data: agendamento.data,
					horario: agendamento.horario,
					status: 'pendente',
					// Aqui você deveria pegar o ID do usuário logado
					usuarioId: 'usuario-exemplo',
				}),
			});

			// Redirecionar para página de sucesso ou meus agendamentos
			router.push('/agendamentos?sucesso=true');
		} catch (err) {
			setError('Erro ao confirmar agendamento');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <LoadingSpinner />;
	if (error) return <ErrorMessage message={error} />;
	if (!estabelecimento || !servico)
		return <ErrorMessage message="Dados não encontrados" />;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			<div className="max-w-3xl mx-auto">
				{/* Breadcrumb */}
				<div className="mb-6">
					<button
						onClick={voltarPagina}
						className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
						<span>Voltar para serviços</span>
					</button>
				</div>

				{/* Card Principal */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
					{/* Título e Informações do Serviço */}
					<div className="mb-6">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
							{passoAtual === 1 && 'Escolha o Profissional'}
							{passoAtual === 2 && 'Escolha Data e Horário'}
							{passoAtual === 3 && 'Confirme seu Agendamento'}
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Serviço selecionado:{' '}
							<span className="font-semibold text-gray-900 dark:text-white">
								{servico.nome}
							</span>
						</p>
					</div>

					{/* Barra de Progresso */}
					<div className="mb-8">
						<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
							<div
								className="bg-gray-800 dark:bg-gray-600 h-2 rounded-full transition-all duration-300"
								style={{
									width: `${(passoAtual / 3) * 100}%`,
								}}
							></div>
						</div>
					</div>

					{/* Componente do Passo Atual */}
					{passoAtual === 1 && (
						<PassoEscolhaProfissional
							profissionais={profissionais}
							onSelecionar={selecionarProfissional}
						/>
					)}

					{passoAtual === 2 && (
						<PassoEscolhaDataHora
							profissional={agendamento.profissional!}
							onSelecionar={selecionarDataHora}
							onVoltar={voltarPasso}
						/>
					)}

					{passoAtual === 3 && (
						<PassoConfirmacao
							servico={servico}
							profissional={agendamento.profissional!}
							data={agendamento.data!}
							horario={agendamento.horario!}
							onConfirmar={confirmarAgendamento}
							onVoltar={voltarPasso}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
