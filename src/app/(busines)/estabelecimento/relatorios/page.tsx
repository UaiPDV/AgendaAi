'use client';

import { useRelatorios } from '@/hooks/useRelatorios';

export default function RelatoriosPage() {
	const {
		servicosMaisAgendados,
		desempenhoProfissionais,
		taxaCancelamento,
		loading,
		error,
	} = useRelatorios();

	if (loading) {
		return (
			<div className="animate-fade-in">
				<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
					Relatórios
				</h1>
				<p className="mt-2 text-gray-600 dark:text-gray-400">
					Carregando relatórios...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="animate-fade-in">
				<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
					Relatórios
				</h1>
				<p className="mt-2 text-red-600">{error}</p>
			</div>
		);
	}

	// Calcula porcentagens para os serviços
	const totalServicos = servicosMaisAgendados.reduce(
		(acc, s) => acc + s.count,
		0
	);

	// Determina badge do profissional baseado em atendimentos
	const getBadgeProfissional = (count: number) => {
		if (count >= 150) return { label: 'Excelente', color: 'green' };
		if (count >= 100) return { label: 'Muito Bom', color: 'green' };
		return { label: 'Bom', color: 'blue' };
	};

	return (
		<div className="animate-fade-in">
			<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
				Relatórios
			</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Análises e estatísticas do seu negócio.
			</p>

			<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Serviços Mais Agendados */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
						Serviços Mais Agendados
					</h3>
					<div className="space-y-3">
						{servicosMaisAgendados.length === 0 ? (
							<p className="text-gray-500 dark:text-gray-400 text-sm">
								Nenhum serviço agendado ainda
							</p>
						) : (
							servicosMaisAgendados.map((servico) => {
								const porcentagem =
									totalServicos > 0
										? Math.round(
												(servico.count /
													totalServicos) *
													100
										  )
										: 0;
								return (
									<div key={servico.servico_nome}>
										<div className="flex justify-between text-sm mb-1">
											<span className="text-gray-800 dark:text-gray-200">
												{servico.servico_nome}
											</span>
											<span className="font-semibold text-gray-800 dark:text-gray-200">
												{porcentagem}%
											</span>
										</div>
										<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
											<div
												className="bg-gray-800 dark:bg-gray-400 h-2 rounded-full"
												style={{
													width: `${porcentagem}%`,
												}}
											></div>
										</div>
									</div>
								);
							})
						)}
					</div>
				</div>

				{/* Desempenho dos Profissionais */}
				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
						Desempenho dos Profissionais
					</h3>
					<div className="space-y-3">
						{desempenhoProfissionais.length === 0 ? (
							<p className="text-gray-500 dark:text-gray-400 text-sm">
								Nenhum profissional com atendimentos
							</p>
						) : (
							desempenhoProfissionais.map((profissional) => {
								const badge = getBadgeProfissional(
									profissional.count
								);
								return (
									<div
										key={profissional.profissional_nome}
										className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
									>
										<div>
											<p className="font-medium text-gray-800 dark:text-gray-200">
												{profissional.profissional_nome}
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												{profissional.count} atendimento
												{profissional.count !== 1
													? 's'
													: ''}
											</p>
										</div>
										<span
											className={`text-sm bg-${badge.color}-100 dark:bg-${badge.color}-900 text-${badge.color}-800 dark:text-${badge.color}-200 px-2 py-1 rounded-full self-start sm:self-center`}
										>
											{badge.label}
										</span>
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>

			{/* Taxa de Cancelamento */}
			<div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
				<h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
					Taxa de Cancelamento
				</h3>
				{taxaCancelamento ? (
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
						<div className="flex-1 w-full">
							<p className="text-5xl font-bold text-gray-800 dark:text-gray-200">
								{taxaCancelamento.taxaCancelamentoPercentual.toFixed(
									1
								)}
								%
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
								{taxaCancelamento.agendamentosCancelados} de{' '}
								{taxaCancelamento.totalAgendamentos}{' '}
								agendamentos cancelados
							</p>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{taxaCancelamento.taxaCancelamentoPercentual < 10
								? 'Meta: abaixo de 10%. Você está indo bem!'
								: 'Meta: abaixo de 10%. Tente melhorar!'}
						</p>
					</div>
				) : (
					<p className="text-gray-500 dark:text-gray-400">
						Nenhum dado disponível
					</p>
				)}
			</div>
		</div>
	);
}
