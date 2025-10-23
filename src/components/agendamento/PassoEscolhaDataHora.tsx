/**
 * Passo 2: Escolha de Data e Horário
 */

'use client';

import { useState } from 'react';
import type { Profissional } from '@/types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface PassoEscolhaDataHoraProps {
	profissional: Profissional;
	onSelecionar: (data: string, horario: string) => void;
	onVoltar: () => void;
}

export function PassoEscolhaDataHora({
	profissional,
	onSelecionar,
	onVoltar,
}: PassoEscolhaDataHoraProps) {
	const [mes, setMes] = useState(new Date().getMonth());
	const [ano, setAno] = useState(new Date().getFullYear());
	const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
	const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(
		null
	);

	const mesesNomes = [
		'Janeiro',
		'Fevereiro',
		'Março',
		'Abril',
		'Maio',
		'Junho',
		'Julho',
		'Agosto',
		'Setembro',
		'Outubro',
		'Novembro',
		'Dezembro',
	];

	const hoje = new Date();
	hoje.setHours(0, 0, 0, 0);

	// Gerar dias do calendário
	const gerarCalendario = () => {
		const primeiroDia = new Date(ano, mes, 1);
		const ultimoDia = new Date(ano, mes + 1, 0);
		const diasNoMes = ultimoDia.getDate();
		const diaDaSemanaInicio = primeiroDia.getDay();

		const dias: (number | null)[] = [];

		// Adicionar células vazias antes do primeiro dia
		for (let i = 0; i < diaDaSemanaInicio; i++) {
			dias.push(null);
		}

		// Adicionar os dias do mês
		for (let dia = 1; dia <= diasNoMes; dia++) {
			dias.push(dia);
		}

		return dias;
	};

	const mesAnterior = () => {
		if (mes === 0) {
			setMes(11);
			setAno(ano - 1);
		} else {
			setMes(mes - 1);
		}
	};

	const proximoMes = () => {
		if (mes === 11) {
			setMes(0);
			setAno(ano + 1);
		} else {
			setMes(mes + 1);
		}
	};

	const isDiaPassado = (dia: number) => {
		const data = new Date(ano, mes, dia);
		data.setHours(0, 0, 0, 0);
		return data < hoje;
	};

	const isFimDeSemana = (dia: number) => {
		const data = new Date(ano, mes, dia);
		const diaSemana = data.getDay();
		return diaSemana === 0 || diaSemana === 6;
	};

	const selecionarDia = (dia: number) => {
		if (isDiaPassado(dia) || isFimDeSemana(dia)) return;

		const data = new Date(ano, mes, dia);
		const dataFormatada = data.toLocaleDateString('pt-BR');
		setDataSelecionada(dataFormatada);
		setHorarioSelecionado(null);
	};

	const selecionarHorario = (horario: string) => {
		setHorarioSelecionado(horario);
	};

	const confirmar = () => {
		if (dataSelecionada && horarioSelecionado) {
			onSelecionar(dataSelecionada, horarioSelecionado);
		}
	};

	// Horários disponíveis (exemplo fixo)
	const horariosDisponiveis = [
		'09:00',
		'10:00',
		'11:00',
		'14:00',
		'15:00',
		'16:00',
		'17:00',
	];

	const dias = gerarCalendario();

	return (
		<div>
			<h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
				Passo 2: Escolha a data e o horário
			</h3>
			<p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
				Profissional:{' '}
				<span className="font-semibold text-gray-900 dark:text-white">
					{profissional.nome}
				</span>
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Calendário */}
				<div>
					<div className="flex items-center justify-between mb-4">
						<button
							onClick={mesAnterior}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
						>
							<ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
						</button>
						<div className="flex gap-2 items-center">
							<select
								value={mes}
								onChange={(e) => setMes(Number(e.target.value))}
								className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								{mesesNomes.map((nome, idx) => (
									<option key={idx} value={idx}>
										{nome}
									</option>
								))}
							</select>
							<select
								value={ano}
								onChange={(e) => setAno(Number(e.target.value))}
								className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								{[0, 1, 2, 3, 4].map((offset) => {
									const anoOpcao =
										hoje.getFullYear() + offset;
									return (
										<option key={anoOpcao} value={anoOpcao}>
											{anoOpcao}
										</option>
									);
								})}
							</select>
						</div>
						<button
							onClick={proximoMes}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
						>
							<ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
						</button>
					</div>

					<div className="grid grid-cols-7 gap-1 text-center text-sm">
						{['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dia, idx) => (
							<div
								key={idx}
								className="text-gray-500 dark:text-gray-400 font-medium p-2"
							>
								{dia}
							</div>
						))}
						{dias.map((dia, idx) => {
							if (dia === null) {
								return <div key={`empty-${idx}`}></div>;
							}

							const passado = isDiaPassado(dia);
							const fimDeSemana = isFimDeSemana(dia);
							const desabilitado = passado || fimDeSemana;
							const hoje =
								dia === new Date().getDate() &&
								mes === new Date().getMonth() &&
								ano === new Date().getFullYear();

							let classes =
								'p-3 rounded-lg text-center cursor-pointer transition-all duration-200 font-medium';

							if (desabilitado) {
								classes =
									'p-3 rounded-lg text-center text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed';
							} else if (hoje) {
								classes +=
									' bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500 hover:bg-blue-200 dark:hover:bg-blue-800 hover:shadow-md';
							} else {
								classes +=
									' text-gray-700 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-600 hover:text-white hover:shadow-lg hover:scale-105';
							}

							return (
								<div
									key={`day-${idx}`}
									className={classes}
									onClick={() =>
										!desabilitado && selecionarDia(dia)
									}
								>
									{dia}
								</div>
							);
						})}
					</div>

					<p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
						* Sábados, domingos e datas passadas não estão
						disponíveis
					</p>
				</div>

				{/* Seleção de Horário */}
				<div>
					{!dataSelecionada ? (
						<div className="flex flex-col items-center justify-center h-full text-center">
							<Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" />
							<h4 className="font-medium text-gray-900 dark:text-white mb-2">
								Selecione uma data primeiro
							</h4>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Os horários aparecerão após selecionar uma data
								válida
							</p>
						</div>
					) : (
						<div>
							<div className="mb-4">
								<h4 className="font-medium text-gray-900 dark:text-white mb-2">
									Horários disponíveis
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Data selecionada:{' '}
									<span className="font-semibold">
										{dataSelecionada}
									</span>
								</p>
							</div>
							<div className="grid grid-cols-3 gap-2">
								{horariosDisponiveis.map((horario) => (
									<button
										key={horario}
										onClick={() =>
											selecionarHorario(horario)
										}
										className={`p-2 border rounded-md transition-all ${
											horarioSelecionado === horario
												? 'bg-gray-800 dark:bg-gray-600 text-white border-gray-800 dark:border-gray-600'
												: 'border-gray-300 dark:border-gray-600 hover:bg-gray-800 dark:hover:bg-gray-600 hover:text-white'
										}`}
									>
										{horario}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Botões de Navegação */}
			<div className="mt-6 flex justify-between items-center">
				<button
					onClick={onVoltar}
					className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2"
				>
					<ChevronLeft className="w-4 h-4" />
					Voltar
				</button>
				{dataSelecionada && horarioSelecionado && (
					<button
						onClick={confirmar}
						className="bg-gray-800 dark:bg-gray-700 text-white font-semibold px-6 py-2 rounded-md hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
					>
						Continuar
					</button>
				)}
			</div>
		</div>
	);
}
