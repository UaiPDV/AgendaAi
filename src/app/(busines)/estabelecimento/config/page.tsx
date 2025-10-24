'use client';

/**
 * Página de Configuração do Estabelecimento
 * Estilização idêntica ao protótipo HTML
 */

import { useConfig } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';

export default function ConfiguracaoEstabelecimentoPage() {
	const { config, loading, error, atualizarConfig } = useConfig();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<LoadingSpinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 sm:p-6">
				<ErrorMessage message={error} />
			</div>
		);
	}

	if (!config) {
		return (
			<div className="p-4 sm:p-6">
				<ErrorMessage message="Configuração não encontrada" />
			</div>
		);
	}

	const handleWorkPattern = (
		pattern: 'seg-sex' | 'seg-sab' | 'seg-dom'
	) => {
		const patterns: Record<string, number[]> = {
			'seg-sex': [1, 2, 3, 4, 5],
			'seg-sab': [1, 2, 3, 4, 5, 6],
			'seg-dom': [1, 2, 3, 4, 5, 6, 0],
		};
		atualizarConfig({
			padraoFuncionamento: pattern,
			diasTrabalho: patterns[pattern],
		});
	};

	return (
		<main className="flex-1 p-4 sm:p-6 md:p-10">
			{/* Cabeçalho */}
			<h2 className="text-2xl sm:text-3xl font-bold">
				Configuração do Estabelecimento
			</h2>
			<p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400">
				Gerencie horários de funcionamento, feriados e bloqueios de agenda.
			</p>

			{/* Horário de Funcionamento */}
			<div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
				<div className="p-4 sm:p-6 border-b bg-gray-50 dark:bg-gray-700/50">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white">
						<i className="fas fa-clock mr-2 text-gray-600 dark:text-gray-400"></i>
						Horário de Funcionamento
					</h3>
					<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
						Defina os dias e horários em que seu estabelecimento funciona
					</p>
				</div>
				<div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
					{/* Padrão de Funcionamento */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
							Padrão de Funcionamento
						</label>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
							<button
								onClick={() => handleWorkPattern('seg-sex')}
								className={`border-2 rounded-lg p-3 sm:p-4 transition-colors text-center ${
									config.padraoFuncionamento === 'seg-sex'
										? 'border-gray-800 dark:border-gray-300 bg-gray-50 dark:bg-gray-700'
										: 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
								}`}
							>
								<i className="fas fa-briefcase text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-2"></i>
								<p className="font-medium text-sm sm:text-base">Segunda a Sexta</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									5 dias por semana
								</p>
							</button>
							<button
								onClick={() => handleWorkPattern('seg-sab')}
								className={`border-2 rounded-lg p-3 sm:p-4 transition-colors text-center ${
									config.padraoFuncionamento === 'seg-sab'
										? 'border-gray-800 dark:border-gray-300 bg-gray-50 dark:bg-gray-700'
										: 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
								}`}
							>
								<i className="fas fa-calendar-week text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-2"></i>
								<p className="font-medium text-sm sm:text-base">Segunda a Sábado</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									6 dias por semana
								</p>
							</button>
							<button
								onClick={() => handleWorkPattern('seg-dom')}
								className={`border-2 rounded-lg p-3 sm:p-4 transition-colors text-center ${
									config.padraoFuncionamento === 'seg-dom'
										? 'border-gray-800 dark:border-gray-300 bg-gray-50 dark:bg-gray-700'
										: 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
								}`}
							>
								<i className="fas fa-calendar text-xl sm:text-2xl text-gray-800 dark:text-gray-300 mb-2"></i>
								<p className="font-medium text-sm sm:text-base">Todos os Dias</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									7 dias por semana
								</p>
							</button>
						</div>
					</div>

					{/* Dias da Semana */}
					<div className="pt-4 border-t dark:border-gray-700">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
							Dias de Funcionamento (Personalizado)
						</label>
						<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
							{[
								{ value: 0, label: 'Domingo' },
								{ value: 1, label: 'Segunda' },
								{ value: 2, label: 'Terça' },
								{ value: 3, label: 'Quarta' },
								{ value: 4, label: 'Quinta' },
								{ value: 5, label: 'Sexta' },
								{ value: 6, label: 'Sábado' },
							].map((dia) => (
								<div
									key={dia.value}
									className="flex items-center justify-between p-2 sm:p-3 border dark:border-gray-600 rounded-lg"
								>
									<label
										htmlFor={`day-${dia.value}`}
										className="cursor-pointer flex-1 text-sm sm:text-base"
									>
										{dia.label}
									</label>
									<input
										type="checkbox"
										id={`day-${dia.value}`}
										checked={config.diasTrabalho.includes(dia.value)}
										onChange={(e) => {
											const novos = e.target.checked
												? [...config.diasTrabalho, dia.value]
												: config.diasTrabalho.filter((d) => d !== dia.value);
											atualizarConfig({ diasTrabalho: novos });
										}}
										className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-300 rounded focus:ring-gray-800"
									/>
								</div>
							))}
						</div>
					</div>

					{/* Horários Padrão */}
					<div className="pt-4 border-t dark:border-gray-700">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
							Horário de Atendimento Padrão
						</label>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
							<div>
								<label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
									Horário de Abertura
								</label>
								<input
									type="time"
									value={config.horarioAbertura}
									onChange={(e) =>
										atualizarConfig({ horarioAbertura: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-800"
								/>
							</div>
							<div>
								<label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
									Horário de Fechamento
								</label>
								<input
									type="time"
									value={config.horarioFechamento}
									onChange={(e) =>
										atualizarConfig({ horarioFechamento: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-800"
								/>
							</div>
						</div>
						<div className="mt-3 flex items-center">
							<input
								type="checkbox"
								id="intervalo"
								checked={config.possuiIntervalo}
								onChange={(e) =>
									atualizarConfig({ possuiIntervalo: e.target.checked })
								}
								className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-300 rounded focus:ring-gray-800"
							/>
							<label
								htmlFor="intervalo"
								className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
							>
								Possui intervalo para almoço
							</label>
						</div>
						{config.possuiIntervalo && (
							<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-4 sm:pl-6 border-l-2 border-gray-300 dark:border-gray-600">
								<div>
									<label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
										Início do Intervalo
									</label>
									<input
										type="time"
										value={config.intervaloInicio || ''}
										onChange={(e) =>
											atualizarConfig({ intervaloInicio: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-800"
									/>
								</div>
								<div>
									<label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
										Fim do Intervalo
									</label>
									<input
										type="time"
										value={config.intervaloFim || ''}
										onChange={(e) =>
											atualizarConfig({ intervaloFim: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-800"
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Horários por Profissional */}
			<div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
				<div className="p-4 sm:p-6 border-b bg-gray-50 dark:bg-gray-700/50">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-gray-800 dark:text-white">
								<i className="fas fa-user-clock mr-2 text-gray-600 dark:text-gray-400"></i>
								Horários por Profissional
							</h3>
							<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
								Configure horários específicos para cada profissional
							</p>
						</div>
						<label className="flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={config.horariosIndividuaisAtivo}
								onChange={(e) =>
									atualizarConfig({
										horariosIndividuaisAtivo: e.target.checked,
									})
								}
								className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-300 rounded focus:ring-gray-800"
							/>
							<span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Ativar
							</span>
						</label>
					</div>
				</div>
				{config.horariosIndividuaisAtivo && (
					<div className="p-4 sm:p-6">
						<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
							<div className="flex items-start gap-2">
								<i className="fas fa-info-circle text-blue-600 dark:text-blue-400 mt-1"></i>
								<div className="text-sm text-blue-800 dark:text-blue-300">
									<strong>Funcionalidade em Desenvolvimento</strong>
									<p className="mt-1">
										Em breve você poderá configurar horários individuais para
										cada profissional do seu estabelecimento.
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Feriados */}
			<div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
				<div className="p-4 sm:p-6 border-b bg-gray-50 dark:bg-gray-700/50">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white">
						<i className="fas fa-umbrella-beach mr-2 text-gray-600 dark:text-gray-400"></i>
						Funcionamento em Feriados
					</h3>
					<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
						Configure o funcionamento do estabelecimento em feriados
					</p>
				</div>
				<div className="p-4 sm:p-6">
					<div className="flex items-start space-x-3">
						<input
							type="checkbox"
							id="feriados-nacionais"
							checked={config.fecharFeriadosNacionais}
							onChange={(e) =>
								atualizarConfig({ fecharFeriadosNacionais: e.target.checked })
							}
							className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-300 rounded focus:ring-gray-800"
						/>
						<div className="flex-1">
							<label
								htmlFor="feriados-nacionais"
								className="block font-medium text-gray-700 dark:text-gray-300 cursor-pointer text-sm sm:text-base"
							>
								Fechar em Feriados Nacionais
							</label>
							<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
								O estabelecimento não aceitará agendamentos em feriados nacionais
							</p>
						</div>
					</div>
					<div className="mt-4 flex items-start space-x-3">
						<input
							type="checkbox"
							id="feriados-locais"
							checked={config.fecharFeriadosMunicipais}
							onChange={(e) =>
								atualizarConfig({ fecharFeriadosMunicipais: e.target.checked })
							}
							className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-300 rounded focus:ring-gray-800"
						/>
						<div className="flex-1">
							<label
								htmlFor="feriados-locais"
								className="block font-medium text-gray-700 dark:text-gray-300 cursor-pointer text-sm sm:text-base"
							>
								Fechar em Feriados Municipais
							</label>
							<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
								O estabelecimento não aceitará agendamentos em feriados locais
							</p>
						</div>
					</div>
					<div className="mt-6 pt-6 border-t dark:border-gray-700">
						<h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 text-sm sm:text-base">
							Feriados Personalizados
						</h4>
						<div className="space-y-2" id="custom-holidays-list">
							{config.feriadosPersonalizados.length === 0 ? (
								<p className="text-sm text-gray-500 dark:text-gray-400 p-3">
									Nenhum feriado personalizado cadastrado
								</p>
							) : (
								config.feriadosPersonalizados.map((feriado) => (
									<div
										key={feriado.id}
										className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
									>
										<div>
											<p className="font-medium text-sm text-gray-800 dark:text-white">
												{feriado.nome}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{feriado.data}
											</p>
										</div>
									</div>
								))
							)}
						</div>
						<button className="mt-3 w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-600 dark:text-gray-400 hover:border-gray-400 hover:text-gray-800 dark:hover:border-gray-500 dark:hover:text-gray-300 transition-colors text-sm sm:text-base">
							<i className="fas fa-plus mr-2"></i>Adicionar Feriado
							Personalizado
						</button>
					</div>
				</div>
			</div>

			{/* Bloqueio de Datas */}
			<div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
				<div className="p-4 sm:p-6 border-b bg-gray-50 dark:bg-gray-700/50">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white">
						<i className="fas fa-ban mr-2 text-gray-600 dark:text-gray-400"></i>
						Bloqueio de Agenda
					</h3>
					<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
						Bloqueie datas específicas para não receber agendamentos
					</p>
				</div>
				<div className="p-4 sm:p-6">
					<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
						<div className="flex items-start gap-2">
							<i className="fas fa-info-circle text-blue-600 dark:text-blue-400 mt-1"></i>
							<div className="text-sm text-blue-800 dark:text-blue-300">
								<strong>Funcionalidade em Desenvolvimento</strong>
								<p className="mt-1">
									Em breve você poderá bloquear datas específicas através de um
									calendário interativo.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Configurações Adicionais */}
			<div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
				<div className="p-4 sm:p-6 border-b bg-gray-50 dark:bg-gray-700/50">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white">
						<i className="fas fa-sliders-h mr-2 text-gray-600 dark:text-gray-400"></i>
						Configurações Adicionais
					</h3>
				</div>
				<div className="p-4 sm:p-6 space-y-4">
					{/* Antecedência Mínima */}
					<div className="flex items-start space-x-3">
						<input
							type="checkbox"
							id="antecedencia-minima"
							checked={config.antecedenciaMinimaAtivo}
							onChange={(e) =>
								atualizarConfig({ antecedenciaMinimaAtivo: e.target.checked })
							}
							className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-300 rounded focus:ring-gray-800"
						/>
						<div className="flex-1">
							<label
								htmlFor="antecedencia-minima"
								className="block font-medium text-gray-700 dark:text-gray-300 cursor-pointer text-sm sm:text-base"
							>
								Antecedência Mínima para Agendamentos
							</label>
							<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
								Clientes devem agendar com pelo menos{' '}
								<select
									value={config.antecedenciaMinima}
									onChange={(e) =>
										atualizarConfig({
											antecedenciaMinima: Number(e.target.value),
										})
									}
									disabled={!config.antecedenciaMinimaAtivo}
									className="mx-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 text-xs sm:text-sm"
								>
									<option value="1">1 hora</option>
									<option value="2">2 horas</option>
									<option value="3">3 horas</option>
									<option value="6">6 horas</option>
									<option value="12">12 horas</option>
									<option value="24">24 horas</option>
								</select>{' '}
								de antecedência
							</p>
						</div>
					</div>

					{/* Limite de Agendamentos */}
					<div className="flex items-start space-x-3">
						<input
							type="checkbox"
							id="limite-agendamentos"
							checked={config.limiteAgendamentosAtivo}
							onChange={(e) =>
								atualizarConfig({ limiteAgendamentosAtivo: e.target.checked })
							}
							className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-300 rounded focus:ring-gray-800"
						/>
						<div className="flex-1">
							<label
								htmlFor="limite-agendamentos"
								className="block font-medium text-gray-700 dark:text-gray-300 cursor-pointer text-sm sm:text-base"
							>
								Limite de Agendamentos Simultâneos
							</label>
							<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
								Permitir no máximo{' '}
								<select
									value={config.limiteAgendamentosSimultaneos}
									onChange={(e) =>
										atualizarConfig({
											limiteAgendamentosSimultaneos: Number(e.target.value),
										})
									}
									disabled={!config.limiteAgendamentosAtivo}
									className="mx-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 text-xs sm:text-sm"
								>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
								</select>{' '}
								agendamentos no mesmo horário
							</p>
						</div>
					</div>

					{/* Confirmação Automática */}
					<div className="flex items-start space-x-3">
						<input
							type="checkbox"
							id="confirmacao-automatica"
							checked={config.confirmacaoAutomatica}
							onChange={(e) =>
								atualizarConfig({ confirmacaoAutomatica: e.target.checked })
							}
							className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-300 rounded focus:ring-gray-800"
						/>
						<div className="flex-1">
							<label
								htmlFor="confirmacao-automatica"
								className="block font-medium text-gray-700 dark:text-gray-300 cursor-pointer text-sm sm:text-base"
							>
								Confirmação Automática de Agendamentos
							</label>
							<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
								Agendamentos serão confirmados automaticamente sem necessidade de
								aprovação manual
							</p>
						</div>
					</div>

					{/* Buffer entre Serviços */}
					<div className="flex items-start space-x-3">
						<input
							type="checkbox"
							id="buffer-entre-servicos"
							checked={config.bufferEntreServicosAtivo}
							onChange={(e) =>
								atualizarConfig({ bufferEntreServicosAtivo: e.target.checked })
							}
							className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-300 rounded focus:ring-gray-800"
						/>
						<div className="flex-1">
							<label
								htmlFor="buffer-entre-servicos"
								className="block font-medium text-gray-700 dark:text-gray-300 cursor-pointer text-sm sm:text-base"
							>
								Buffer entre Serviços
							</label>
							<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
								Adicionar{' '}
								<select
									value={config.bufferEntreServicos}
									onChange={(e) =>
										atualizarConfig({
											bufferEntreServicos: Number(e.target.value),
										})
									}
									disabled={!config.bufferEntreServicosAtivo}
									className="mx-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 text-xs sm:text-sm"
								>
									<option value="5">5 minutos</option>
									<option value="10">10 minutos</option>
									<option value="15">15 minutos</option>
									<option value="30">30 minutos</option>
								</select>{' '}
								de intervalo entre cada agendamento
							</p>
						</div>
					</div>

					{/* Cancelamento */}
					<div className="flex items-start space-x-3">
						<input
							type="checkbox"
							id="cancelamento-antecedencia"
							checked={config.cancelamentoAntecedenciaAtivo}
							onChange={(e) =>
								atualizarConfig({
									cancelamentoAntecedenciaAtivo: e.target.checked,
								})
							}
							className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-300 rounded focus:ring-gray-800"
						/>
						<div className="flex-1">
							<label
								htmlFor="cancelamento-antecedencia"
								className="block font-medium text-gray-700 dark:text-gray-300 cursor-pointer text-sm sm:text-base"
							>
								Antecedência para Cancelamento
							</label>
							<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
								Clientes podem cancelar com até{' '}
								<select
									value={config.cancelamentoAntecedencia}
									onChange={(e) =>
										atualizarConfig({
											cancelamentoAntecedencia: Number(e.target.value),
										})
									}
									disabled={!config.cancelamentoAntecedenciaAtivo}
									className="mx-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 text-xs sm:text-sm"
								>
									<option value="1">1 hora</option>
									<option value="2">2 horas</option>
									<option value="24">24 horas</option>
									<option value="48">48 horas</option>
								</select>{' '}
								antes do horário agendado
							</p>
						</div>
					</div>

					{/* Reagendamento */}
					<div className="flex items-start space-x-3">
						<input
							type="checkbox"
							id="reagendamento-permitido"
							checked={config.reagendamentoPermitido}
							onChange={(e) =>
								atualizarConfig({ reagendamentoPermitido: e.target.checked })
							}
							className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-300 rounded focus:ring-gray-800"
						/>
						<div className="flex-1">
							<label
								htmlFor="reagendamento-permitido"
								className="block font-medium text-gray-700 dark:text-gray-300 cursor-pointer text-sm sm:text-base"
							>
								Permitir Reagendamento pelo Cliente
							</label>
							<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
								Clientes podem reagendar seus agendamentos sem aprovação do
								estabelecimento
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Botões de Ação */}
			<div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
				<button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm sm:text-base">
					Cancelar
				</button>
				<button className="px-6 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-md hover:bg-gray-900 dark:hover:bg-gray-600 font-medium text-sm sm:text-base">
					<i className="fas fa-save mr-2"></i>Salvar Configurações
				</button>
			</div>

			{/* Aviso de Auto-save */}
			<div className="mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
				<div className="flex items-center gap-2">
					<i className="fas fa-info-circle text-blue-600 dark:text-blue-400"></i>
					<p className="text-sm text-blue-700 dark:text-blue-300">
						<strong>Salvamento Automático Ativo:</strong> Suas alterações são
						salvas automaticamente após 300ms de inatividade.
					</p>
				</div>
			</div>
		</main>
	);
}
