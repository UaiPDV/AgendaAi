/**
 * Tipos relacionados às configurações do estabelecimento
 */

export interface ConfiguracaoEstabelecimento {
	id: string;
	estabelecimentoId: string;

	// Padrão de funcionamento
	padraoFuncionamento: 'seg-sex' | 'seg-sab' | 'seg-dom' | 'personalizado';

	// Dias de trabalho (array de 0-6, onde 0 = domingo, 6 = sábado)
	diasTrabalho: number[];

	// Horários padrão
	horarioAbertura: string; // HH:mm
	horarioFechamento: string; // HH:mm

	// Intervalo
	possuiIntervalo: boolean;
	intervaloInicio?: string; // HH:mm
	intervaloFim?: string; // HH:mm

	// Horários individuais
	horariosIndividuaisAtivo: boolean;

	// Feriados
	fecharFeriadosNacionais: boolean;
	fecharFeriadosMunicipais: boolean;
	feriadosPersonalizados: FeriadoPersonalizado[];

	// Bloqueio de datas
	datasBloqueadas: string[]; // Array de datas no formato YYYY-MM-DD

	// Duração padrão dos agendamentos (em minutos)
	duracaoPadrao: number;

	// Configurações adicionais
	antecedenciaMinima: number; // em horas
	antecedenciaMinimaAtivo: boolean;
	limiteAgendamentosSimultaneos: number;
	limiteAgendamentosAtivo: boolean;
	confirmacaoAutomatica: boolean;
	bufferEntreServicos: number; // em minutos
	bufferEntreServicosAtivo: boolean;
	cancelamentoAntecedencia: number; // em horas
	cancelamentoAntecedenciaAtivo: boolean;
	reagendamentoPermitido: boolean;

	createdAt?: string;
	updatedAt?: string;
}

export interface FeriadoPersonalizado {
	id: string;
	nome: string;
	data: string; // MM-DD (sem ano para repetir anualmente)
}

export interface NovaConfiguracaoForm {
	padraoFuncionamento?: 'seg-sex' | 'seg-sab' | 'seg-dom' | 'personalizado';
	diasTrabalho?: number[];
	horarioAbertura?: string;
	horarioFechamento?: string;
	possuiIntervalo?: boolean;
	intervaloInicio?: string;
	intervaloFim?: string;
	horariosIndividuaisAtivo?: boolean;
	fecharFeriadosNacionais?: boolean;
	fecharFeriadosMunicipais?: boolean;
	feriadosPersonalizados?: FeriadoPersonalizado[];
	datasBloqueadas?: string[];
	duracaoPadrao?: number;
	antecedenciaMinima?: number;
	antecedenciaMinimaAtivo?: boolean;
	limiteAgendamentosSimultaneos?: number;
	limiteAgendamentosAtivo?: boolean;
	confirmacaoAutomatica?: boolean;
	bufferEntreServicos?: number;
	bufferEntreServicosAtivo?: boolean;
	cancelamentoAntecedencia?: number;
	cancelamentoAntecedenciaAtivo?: boolean;
	reagendamentoPermitido?: boolean;
}
