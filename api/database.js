/**
 * Banco de Dados em Memória - AgendaAi API
 * Dados iniciais para desenvolvimento
 */
/* eslint-disable @typescript-eslint/no-require-imports */
// O projeto da API usa CommonJS/JS simples; usamos `require` para compatibilidade.
const { v4: uuidv4 } = require('uuid');

// ============================================
// USUÁRIOS (Clientes)
// ============================================
let usuarios = [
	{
		id: uuidv4(),
		nome: 'Cliente Exemplo',
		email: 'cliente@exemplo.com',
		senha: '123456', // Senha simples para desenvolvimento
		telefone: '(11) 99999-9999',
		cpf: '123.456.789-00',
		dataNascimento: '1990-01-01',
		tipo: 'cliente',
		createdAt: new Date().toISOString(),
	},
];

// ============================================
// ESTABELECIMENTOS
// ============================================
let estabelecimentos = [
	{
		id: 1,
		nome: 'Salão Beleza Pura',
		email: 'contato@belezapura.com',
		senha: '123456',
		telefone: '(11) 98765-4321',
		endereco: 'Rua das Flores, 123 - Centro',
		imagem: 'https://frizzar.com.br/blog/wp-content/uploads/2022/03/salao-de-beleza-por-assinatura.jpg',
		avaliacao: 4.8,
		totalAvaliacoes: 156,
		horarioFuncionamento: 'Seg-Sex: 9h às 19h | Sáb: 9h às 17h',
		tipo: 'estabelecimento',
		createdAt: new Date().toISOString(),
	},
	{
		id: 2,
		nome: 'Barbearia Premium',
		email: 'contato@barberiapremium.com',
		senha: '123456',
		telefone: '(11) 98765-4322',
		endereco: 'Av. Principal, 456 - Jardim América',
		imagem: 'https://dkfbh8idjneas.cloudfront.net/images/5a45f32d-f80b-48f7-8681-eadf6f61cc0d.png',
		avaliacao: 4.9,
		totalAvaliacoes: 203,
		horarioFuncionamento: 'Seg-Sex: 10h às 20h | Sáb: 10h às 18h',
		tipo: 'estabelecimento',
		createdAt: new Date().toISOString(),
	},
	{
		id: 3,
		nome: 'Estética & Cia',
		email: 'contato@esteticaecia.com',
		senha: '123456',
		telefone: '(11) 98765-4323',
		endereco: 'Rua do Comércio, 789 - Vila Nova',
		imagem: 'https://compraevendadeouro-rgaldi.com.br/wp-content/uploads/2017/09/salao-de-beleza-jardim-oceanico-barra-da-tijuca-venda-1.jpg',
		avaliacao: 4.7,
		totalAvaliacoes: 98,
		horarioFuncionamento: 'Seg-Sex: 8h às 18h',
		tipo: 'estabelecimento',
		createdAt: new Date().toISOString(),
	},
];

// ============================================
// SERVIÇOS
// ============================================
let servicos = [
	// Salão Beleza Pura
	{
		id: uuidv4(),
		estabelecimentoId: 1,
		nome: 'Corte Feminino',
		descricao: 'Corte de cabelo feminino com acabamento profissional',
		preco: '80.00',
		duracao: '60',
		createdAt: new Date().toISOString(),
	},
	{
		id: uuidv4(),
		estabelecimentoId: 1,
		nome: 'Manicure e Pedicure',
		descricao: 'Cuidados completos para unhas das mãos e pés',
		preco: '60.00',
		duracao: '90',
		createdAt: new Date().toISOString(),
	},
	{
		id: uuidv4(),
		estabelecimentoId: 1,
		nome: 'Escova Progressiva',
		descricao: 'Alisamento profissional com produtos de alta qualidade',
		preco: '200.00',
		duracao: '180',
		createdAt: new Date().toISOString(),
	},
	// Barbearia Premium
	{
		id: uuidv4(),
		estabelecimentoId: 2,
		nome: 'Corte Masculino',
		descricao: 'Corte de cabelo masculino tradicional ou moderno',
		preco: '40.00',
		duracao: '30',
		createdAt: new Date().toISOString(),
	},
	{
		id: uuidv4(),
		estabelecimentoId: 2,
		nome: 'Barba',
		descricao: 'Aparar e desenhar barba com navalha',
		preco: '25.00',
		duracao: '20',
		createdAt: new Date().toISOString(),
	},
	{
		id: uuidv4(),
		estabelecimentoId: 2,
		nome: 'Combo Corte + Barba',
		descricao: 'Pacote completo com corte e barba',
		preco: '60.00',
		duracao: '45',
		createdAt: new Date().toISOString(),
	},
	// Estética & Cia
	{
		id: uuidv4(),
		estabelecimentoId: 3,
		nome: 'Limpeza de Pele',
		descricao: 'Limpeza profunda facial com produtos específicos',
		preco: '120.00',
		duracao: '90',
		createdAt: new Date().toISOString(),
	},
	{
		id: uuidv4(),
		estabelecimentoId: 3,
		nome: 'Massagem Relaxante',
		descricao: 'Massagem corporal para relaxamento',
		preco: '100.00',
		duracao: '60',
		createdAt: new Date().toISOString(),
	},
];

// ============================================
// PROFISSIONAIS
// ============================================
let profissionais = [
	// Salão Beleza Pura
	{
		id: uuidv4(),
		estabelecimentoId: 1,
		nome: 'Ana Silva',
		telefone: '(11) 98765-4321',
		especialidades: ['Corte Feminino', 'Escova'],
		createdAt: new Date().toISOString(),
	},
	{
		id: uuidv4(),
		estabelecimentoId: 1,
		nome: 'Maria Santos',
		telefone: '(11) 98765-4322',
		especialidades: ['Manicure', 'Pedicure'],
		createdAt: new Date().toISOString(),
	},
	// Barbearia Premium
	{
		id: uuidv4(),
		estabelecimentoId: 2,
		nome: 'João Souza',
		telefone: '(11) 98765-4323',
		especialidades: ['Corte Masculino', 'Barba'],
		createdAt: new Date().toISOString(),
	},
	{
		id: uuidv4(),
		estabelecimentoId: 2,
		nome: 'Pedro Costa',
		telefone: '(11) 98765-4324',
		especialidades: ['Corte Masculino', 'Barba'],
		createdAt: new Date().toISOString(),
	},
	// Estética & Cia
	{
		id: uuidv4(),
		estabelecimentoId: 3,
		nome: 'Carla Oliveira',
		telefone: '(11) 98765-4325',
		especialidades: ['Estética Facial', 'Limpeza de Pele'],
		createdAt: new Date().toISOString(),
	},
];

// ============================================
// AGENDAMENTOS
// ============================================
let agendamentos = [
	// Agendamentos futuros
	{
		id: uuidv4(),
		usuarioId: usuarios[0].id,
		estabelecimentoId: 2,
		servicoId: null, // será preenchido dinamicamente
		profissionalId: null,
		data: '2025-10-25',
		horario: '10:00',
		status: 'confirmado',
		servico: 'Corte Masculino',
		profissional: 'João Souza',
		preco: '40.00',
		estabelecimento: 'Barbearia Premium',
		createdAt: new Date().toISOString(),
	},
	{
		id: uuidv4(),
		usuarioId: usuarios[0].id,
		estabelecimentoId: 1,
		servicoId: null,
		profissionalId: null,
		data: '2025-10-28',
		horario: '15:00',
		status: 'pendente',
		servico: 'Manicure e Pedicure',
		profissional: 'Maria Santos',
		preco: '60.00',
		estabelecimento: 'Salão Beleza Pura',
		createdAt: new Date().toISOString(),
	},
	// Agendamentos passados
	{
		id: uuidv4(),
		usuarioId: usuarios[0].id,
		estabelecimentoId: 2,
		servicoId: null,
		profissionalId: null,
		data: '2025-10-15',
		horario: '14:00',
		status: 'concluido',
		servico: 'Combo Corte + Barba',
		profissional: 'João Souza',
		preco: '60.00',
		estabelecimento: 'Barbearia Premium',
		createdAt: new Date('2025-10-10').toISOString(),
	},
	{
		id: uuidv4(),
		usuarioId: usuarios[0].id,
		estabelecimentoId: 1,
		servicoId: null,
		profissionalId: null,
		data: '2025-10-10',
		horario: '11:00',
		status: 'concluido',
		servico: 'Corte Feminino',
		profissional: 'Ana Silva',
		preco: '80.00',
		estabelecimento: 'Salão Beleza Pura',
		createdAt: new Date('2025-10-05').toISOString(),
	},
	{
		id: uuidv4(),
		usuarioId: usuarios[0].id,
		estabelecimentoId: 3,
		servicoId: null,
		profissionalId: null,
		data: '2025-10-08',
		horario: '16:00',
		status: 'cancelado',
		servico: 'Massagem Relaxante',
		profissional: 'Carla Oliveira',
		preco: '100.00',
		estabelecimento: 'Estética & Cia',
		createdAt: new Date('2025-10-03').toISOString(),
	},
];

// ============================================
// TRANSAÇÕES
// ============================================
let transacoes = [
	{
		id: uuidv4(),
		usuarioId: usuarios[0].id,
		agendamentoId: agendamentos[2].id,
		descricao: 'Combo Corte + Barba',
		valor: 60.0,
		data: '2025-10-15',
		status: 'pago',
		metodoPagamento: 'Cartão de Crédito',
		createdAt: new Date('2025-10-15').toISOString(),
	},
	{
		id: uuidv4(),
		usuarioId: usuarios[0].id,
		agendamentoId: agendamentos[3].id,
		descricao: 'Corte Feminino',
		valor: 80.0,
		data: '2025-10-10',
		status: 'pago',
		metodoPagamento: 'PIX',
		createdAt: new Date('2025-10-10').toISOString(),
	},
	{
		id: uuidv4(),
		usuarioId: usuarios[0].id,
		agendamentoId: agendamentos[0].id,
		descricao: 'Corte Masculino (Futuro)',
		valor: 40.0,
		data: '2025-10-25',
		status: 'pendente',
		metodoPagamento: null,
		createdAt: new Date().toISOString(),
	},
];

// ============================================
// MÉTODOS DE PAGAMENTO
// ============================================
let metodosPagamento = [
	{
		id: uuidv4(),
		usuarioId: usuarios[0].id,
		tipo: 'cartao-credito',
		descricao: 'Visa',
		numero: '1234', // últimos 4 dígitos
		validade: '12/2027',
		principal: true,
		createdAt: new Date().toISOString(),
	},
	{
		id: uuidv4(),
		usuarioId: usuarios[0].id,
		tipo: 'pix',
		descricao: 'PIX - CPF',
		numero: null,
		validade: null,
		principal: false,
		createdAt: new Date().toISOString(),
	},
];

// ============================================
// AVALIAÇÕES
// ============================================
let avaliacoes = [
	{
		id: uuidv4(),
		usuarioId: usuarios[0].id,
		agendamentoId: agendamentos[2].id,
		estabelecimentoId: 2,
		servicoNome: 'Combo Corte + Barba',
		profissionalNome: 'João Souza',
		data: '2025-10-15',
		nota: 5,
		comentario: 'Excelente atendimento! Muito profissional e atencioso.',
		avaliado: true,
		createdAt: new Date('2025-10-15').toISOString(),
	},
	{
		id: uuidv4(),
		usuarioId: usuarios[0].id,
		agendamentoId: agendamentos[3].id,
		estabelecimentoId: 1,
		servicoNome: 'Corte Feminino',
		profissionalNome: 'Ana Silva',
		data: '2025-10-10',
		nota: null,
		comentario: null,
		avaliado: false,
		createdAt: new Date('2025-10-10').toISOString(),
	},
];

// ============================================
// PREFERÊNCIAS DE NOTIFICAÇÃO (por usuário)
// ============================================
let preferenciasNotificacao = {
	[usuarios[0].id]: {
		lembretes: true,
		promocoes: true,
		confirmacoes: true,
		updatedAt: new Date().toISOString(),
	},
};

module.exports = {
	usuarios,
	estabelecimentos,
	servicos,
	profissionais,
	agendamentos,
	transacoes,
	metodosPagamento,
	avaliacoes,
	preferenciasNotificacao,
};
