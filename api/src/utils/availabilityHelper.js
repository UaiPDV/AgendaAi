// src/utils/availabilityHelper.js

import { openDb } from '../database.js';

/**
 * Verifica se um horário específico está disponível de forma SIMPLIFICADA.
 * Ignora duração, buffer, horários individuais, feriados, bloqueios.
 * Apenas verifica se já existe um agendamento *exatamente* no mesmo horário.
 *
 * @param {object} db - Instância do banco de dados (já aberta).
 * @param {string} data - Data no formato YYYY-MM-DD.
 * @param {string} horario - Horário no formato HH:MM.
 * @param {string} profissionalId - ID do profissional.
 * @param {string|null} agendamentoIdIgnorar - ID de um agendamento a ser ignorado na verificação (útil para reagendamento).
 * @returns {Promise<boolean>} - True se disponível, False caso contrário.
 */
export async function verificarDisponibilidadeSimples(
	db,
	data,
	horario,
	profissionalId,
	agendamentoIdIgnorar = null
) {
	try {
		let query = `
            SELECT id FROM agendamentos
            WHERE profissional_id = ?
              AND data = ?
              AND horario = ?
              AND status != 'cancelado'
        `;
		const params = [profissionalId, data, horario];

		if (agendamentoIdIgnorar) {
			query += ' AND id != ?';
			params.push(agendamentoIdIgnorar);
		}

		const agendamentoExistente = await db.get(query, params);

		return !agendamentoExistente; // Disponível se NÃO existir agendamento no mesmo horário
	} catch (error) {
		console.error('Erro ao verificar disponibilidade (simples):', error);
		return false; // Assume indisponível em caso de erro
	}
}

/**
 * Calcula slots de horários disponíveis de forma SIMPLIFICADA.
 * Gera slots baseados no horário de abertura/fechamento e duração,
 * removendo os que já estão ocupados.
 * Ignora buffer, intervalo, feriados, bloqueios, horários individuais.
 *
 * @param {string} horarioAbertura - HH:MM
 * @param {string} horarioFechamento - HH:MM
 * @param {number} duracaoServico - Duração em minutos
 * @param {string[]} horariosOcupados - Array de strings HH:MM já agendados
 * @returns {string[]} - Array de strings HH:MM disponíveis
 */
export function calcularSlotsDisponiveisSimples(
	horarioAbertura,
	horarioFechamento,
	duracaoServico,
	horariosOcupados
) {
	const slotsDisponiveis = [];
	const inicioMinutos = timeToMinutes(horarioAbertura);
	const fimMinutos = timeToMinutes(horarioFechamento);
	const ocupadosSet = new Set(horariosOcupados);

	if (isNaN(inicioMinutos) || isNaN(fimMinutos) || duracaoServico <= 0) {
		console.error('Horários ou duração inválidos para calcular slots.');
		return [];
	}

	// Gera slots incrementando pela duração do serviço
	for (
		let currentMinutos = inicioMinutos;
		currentMinutos < fimMinutos;
		currentMinutos += duracaoServico
	) {
		// Verifica se o slot TERMINA antes ou exatamente no horário de fechamento
		if (currentMinutos + duracaoServico <= fimMinutos) {
			const slotHorario = minutesToTime(currentMinutos);
			// Adiciona apenas se o slot não estiver na lista de ocupados
			if (!ocupadosSet.has(slotHorario)) {
				slotsDisponiveis.push(slotHorario);
			}
		} else {
			// Se o próximo slot ultrapassa o fim, para o loop
			break;
		}
	}

	return slotsDisponiveis;
}

// Funções auxiliares para converter HH:MM <-> minutos
function timeToMinutes(time) {
	if (!time || !time.includes(':')) return NaN;
	const [hours, minutes] = time.split(':').map(Number);
	if (isNaN(hours) || isNaN(minutes)) return NaN;
	return hours * 60 + minutes;
}

function minutesToTime(minutes) {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// NOTA: Esta lógica de disponibilidade é EXTREMAMENTE SIMPLIFICADA e não é adequada
// para produção. Uma implementação real precisaria considerar:
// - Horários individuais de profissionais.
// - Dias de trabalho (da config e do profissional).
// - Intervalos (almoço, buffer).
// - Feriados e datas bloqueadas.
// - Duração real do serviço para evitar sobreposições.
// - Limite de agendamentos simultâneos.
