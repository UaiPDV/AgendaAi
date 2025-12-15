/**
 * Tipos relacionados a estabelecimentos
 */

export interface Estabelecimento {
	id: number;
	nome: string;
	endereco: string;
	imagem: string;
	avaliacao: number;
	totalAvaliacoes: number;
	horarioFuncionamento: string;
}

export interface Servico {
	id: string;
	nome: string;
	duracao: string;
	preco: string;
	descricao?: string;
}

export interface Profissional {
	id: string;
	nome: string;
	telefone?: string;
	especialidades?: string[];
}

/**
 * Tipos relacionados a agendamentos
 */

export interface Agendamento {
	id: string;
	servico: string;
	profissional: string;
	data: string;
	horario?: string;
	usuarioId?: string;
	estabelecimentoId?: number;
	preco: string;
	status: 'confirmado' | 'pendente' | 'cancelado' | 'concluido';
	estabelecimento?: string;
}

export interface AgendamentoDetalhes extends Agendamento {
	cliente: string;
	observacoes?: string;
	duracao: string;
}

/**
 * Estado do fluxo de agendamento
 */

export interface AgendamentoFluxo {
	servico?: Servico;
	profissional?: Profissional;
	data?: string;
	horario?: string;
	estabelecimento?: Estabelecimento;
}

/**
 * Tipos relacionados a finanças
 */

export interface Transacao {
	id: string;
	descricao: string;
	valor: number;
	data: string;
	status: 'pago' | 'pendente' | 'cancelado';
	servico?: string;
}

export interface ResumoFinanceiro {
	gastoMes: number;
	gastoPendente: number;
	proximoPagamento: {
		valor: number;
		data: string;
	};
}

/**
 * Tipos relacionados a formas de pagamento
 */

export interface MetodoPagamento {
	id: string;
	tipo: 'cartao-credito' | 'cartao-debito' | 'pix' | 'dinheiro';
	descricao: string;
	numero?: string; // últimos 4 dígitos
	validade?: string;
	principal?: boolean;
}

/**
 * Tipos relacionados a avaliações
 */

export interface Avaliacao {
	id: string;
	servicoNome: string;
	profissionalNome: string;
	data: string;
	nota?: number; // 1-5
	comentario?: string;
	avaliado: boolean;
}

/**
 * Tipos relacionados a notificações
 */

export interface PreferenciasNotificacao {
	lembretes: boolean;
	promocoes: boolean;
	confirmacoes: boolean;
}

/**
 * Tipos relacionados a dados do usuário
 */

export interface DadosUsuario {
	id?: string;
	nome: string;
	cpf: string;
	email: string;
	telefone: string;
	dataNascimento: string;
	notif_lembretes?: boolean | number | null;
	notif_promocoes?: boolean | number | null;
}
