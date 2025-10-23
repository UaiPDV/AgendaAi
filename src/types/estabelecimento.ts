/**
 * Tipos para área de Estabelecimento
 */

import type { Agendamento, Servico, Profissional } from './cliente';

/**
 * Métricas do Dashboard
 */
export interface DashboardMetrics {
	agendamentosHoje: number;
	agendamentosSemana: number;
	receitaMes: number;
	taxaCancelamento: number;
}

/**
 * Dados do gráfico de receita
 */
export interface RevenueChartData {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		backgroundColor?: string;
		borderColor?: string;
		borderWidth?: number;
	}[];
}

/**
 * Agendamento para lista (com informações extras)
 */
export interface AgendamentoListItem extends Agendamento {
	clienteNome?: string;
	clienteTelefone?: string;
	observacoes?: string;
}

/**
 * Profissional com informações completas
 */
export interface ProfissionalDetalhado extends Profissional {
	estabelecimentoId: number;
	email?: string;
	ativo?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Serviço com informações completas
 */
export interface ServicoDetalhado extends Servico {
	estabelecimentoId: number;
	categoria?: string;
	icone?: string;
	ativo?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Cliente (usuário que agenda)
 */
export interface Cliente {
	id: string;
	nome: string;
	email: string;
	telefone: string;
	cpf?: string;
	dataNascimento?: string;
	totalAgendamentos?: number;
	ultimoAgendamento?: string;
}

/**
 * Transação financeira
 */
export interface TransacaoFinanceira {
	id: string;
	descricao: string;
	valor: number;
	data: string;
	status: 'pago' | 'pendente' | 'cancelado';
	metodoPagamento?: string;
	agendamentoId?: string;
	usuarioId?: string;
}

/**
 * Resumo financeiro do estabelecimento
 */
export interface ResumoFinanceiroEstabelecimento {
	receitaMes: number;
	receitaPendente: number;
	receitaCancelada: number;
	totalTransacoes: number;
}

/**
 * Configuração de horário do estabelecimento
 */
export interface ConfiguracaoHorario {
	estabelecimentoId: number;
	diasTrabalho: DiaSemana[];
	horarioAbertura: string;
	horarioFechamento: string;
	intervaloAlmoco?: {
		inicio: string;
		fim: string;
	};
	duracaoPadrao: number; // em minutos
	horariosIndividuais?: boolean;
	datasBloqueadas?: string[]; // ISO date strings
}

export type DiaSemana = 'dom' | 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab';

/**
 * Filtros para histórico
 */
export interface HistoricoFiltros {
	dataInicio?: string;
	dataFim?: string;
	status?: string;
	profissional?: string;
	servico?: string;
}

/**
 * Dados para formulário de novo serviço
 */
export interface NovoServicoForm {
	nome: string;
	descricao: string;
	duracao: string;
	preco: string;
	categoria: string;
	icone: string;
	ativo: boolean;
}

/**
 * Dados para formulário de novo profissional
 */
export interface NovoProfissionalForm {
	nome: string;
	telefone: string;
	email?: string;
	especialidades: string[];
}
