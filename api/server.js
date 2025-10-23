/**
 * Servidor API REST - AgendaAi
 * API simples para desenvolvimento do frontend
 */

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de log
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	next();
});

// ============================================
// AUTENTICAÇÃO
// ============================================

// Login
app.post('/api/auth/login', (req, res) => {
	const { email, senha } = req.body;

	// Buscar usuário (cliente)
	const usuario = db.usuarios.find(
		(u) => u.email === email && u.senha === senha
	);

	if (usuario) {
		const { senha: _, ...usuarioSemSenha } = usuario;
		return res.json({
			success: true,
			user: usuarioSemSenha,
			token: `token_${usuario.id}`,
		});
	}

	// Buscar estabelecimento
	const estabelecimento = db.estabelecimentos.find(
		(e) => e.email === email && e.senha === senha
	);

	if (estabelecimento) {
		const { senha: _, ...estabelecimentoSemSenha } = estabelecimento;
		return res.json({
			success: true,
			user: estabelecimentoSemSenha,
			token: `token_${estabelecimento.id}`,
		});
	}

	res.status(401).json({ success: false, message: 'Credenciais inválidas' });
});

// Cadastro de Cliente
app.post('/api/auth/register', (req, res) => {
	const { nome, email, senha, telefone, cpf, dataNascimento } = req.body;

	// Verificar se email já existe
	if (db.usuarios.find((u) => u.email === email)) {
		return res
			.status(400)
			.json({ success: false, message: 'Email já cadastrado' });
	}

	const novoUsuario = {
		id: uuidv4(),
		nome,
		email,
		senha,
		telefone,
		cpf,
		dataNascimento,
		tipo: 'cliente',
		createdAt: new Date().toISOString(),
	};

	db.usuarios.push(novoUsuario);

	const { senha: _, ...usuarioSemSenha } = novoUsuario;
	res.status(201).json({
		success: true,
		user: usuarioSemSenha,
		token: `token_${novoUsuario.id}`,
	});
});

// ============================================
// ESTABELECIMENTOS
// ============================================

// Listar todos os estabelecimentos
app.get('/api/estabelecimentos', (req, res) => {
	const { search } = req.query;

	let resultado = db.estabelecimentos;

	if (search) {
		resultado = resultado.filter((e) =>
			e.nome.toLowerCase().includes(search.toLowerCase())
		);
	}

	res.json(resultado);
});

// Buscar estabelecimento por ID
app.get('/api/estabelecimentos/:id', (req, res) => {
	const estabelecimento = db.estabelecimentos.find(
		(e) => e.id === parseInt(req.params.id)
	);

	if (!estabelecimento) {
		return res
			.status(404)
			.json({ message: 'Estabelecimento não encontrado' });
	}

	res.json(estabelecimento);
});

// Criar estabelecimento
app.post('/api/estabelecimentos', (req, res) => {
	const novoEstabelecimento = {
		id: db.estabelecimentos.length + 1,
		...req.body,
		avaliacao: 0,
		totalAvaliacoes: 0,
		tipo: 'estabelecimento',
		createdAt: new Date().toISOString(),
	};

	db.estabelecimentos.push(novoEstabelecimento);
	res.status(201).json(novoEstabelecimento);
});

// Atualizar estabelecimento
app.put('/api/estabelecimentos/:id', (req, res) => {
	const index = db.estabelecimentos.findIndex(
		(e) => e.id === parseInt(req.params.id)
	);

	if (index === -1) {
		return res
			.status(404)
			.json({ message: 'Estabelecimento não encontrado' });
	}

	db.estabelecimentos[index] = {
		...db.estabelecimentos[index],
		...req.body,
		updatedAt: new Date().toISOString(),
	};

	res.json(db.estabelecimentos[index]);
});

// Deletar estabelecimento
app.delete('/api/estabelecimentos/:id', (req, res) => {
	const index = db.estabelecimentos.findIndex(
		(e) => e.id === parseInt(req.params.id)
	);

	if (index === -1) {
		return res
			.status(404)
			.json({ message: 'Estabelecimento não encontrado' });
	}

	db.estabelecimentos.splice(index, 1);
	res.json({ message: 'Estabelecimento deletado com sucesso' });
});

// ============================================
// SERVIÇOS
// ============================================

// Listar serviços de um estabelecimento
app.get('/api/estabelecimentos/:id/servicos', (req, res) => {
	const servicos = db.servicos.filter(
		(s) => s.estabelecimentoId === parseInt(req.params.id)
	);
	res.json(servicos);
});

// Criar serviço
app.post('/api/servicos', (req, res) => {
	const novoServico = {
		id: uuidv4(),
		...req.body,
		createdAt: new Date().toISOString(),
	};

	db.servicos.push(novoServico);
	res.status(201).json(novoServico);
});

// Atualizar serviço
app.put('/api/servicos/:id', (req, res) => {
	const index = db.servicos.findIndex((s) => s.id === req.params.id);

	if (index === -1) {
		return res.status(404).json({ message: 'Serviço não encontrado' });
	}

	db.servicos[index] = {
		...db.servicos[index],
		...req.body,
		updatedAt: new Date().toISOString(),
	};

	res.json(db.servicos[index]);
});

// Deletar serviço
app.delete('/api/servicos/:id', (req, res) => {
	const index = db.servicos.findIndex((s) => s.id === req.params.id);

	if (index === -1) {
		return res.status(404).json({ message: 'Serviço não encontrado' });
	}

	db.servicos.splice(index, 1);
	res.json({ message: 'Serviço deletado com sucesso' });
});

// ============================================
// PROFISSIONAIS
// ============================================

// Listar profissionais de um estabelecimento
app.get('/api/estabelecimentos/:id/profissionais', (req, res) => {
	const profissionais = db.profissionais.filter(
		(p) => p.estabelecimentoId === parseInt(req.params.id)
	);
	res.json(profissionais);
});

// Criar profissional
app.post('/api/profissionais', (req, res) => {
	const novoProfissional = {
		id: uuidv4(),
		...req.body,
		createdAt: new Date().toISOString(),
	};

	db.profissionais.push(novoProfissional);
	res.status(201).json(novoProfissional);
});

// Atualizar profissional
app.put('/api/profissionais/:id', (req, res) => {
	const index = db.profissionais.findIndex((p) => p.id === req.params.id);

	if (index === -1) {
		return res.status(404).json({ message: 'Profissional não encontrado' });
	}

	db.profissionais[index] = {
		...db.profissionais[index],
		...req.body,
		updatedAt: new Date().toISOString(),
	};

	res.json(db.profissionais[index]);
});

// Deletar profissional
app.delete('/api/profissionais/:id', (req, res) => {
	const index = db.profissionais.findIndex((p) => p.id === req.params.id);

	if (index === -1) {
		return res.status(404).json({ message: 'Profissional não encontrado' });
	}

	db.profissionais.splice(index, 1);
	res.json({ message: 'Profissional deletado com sucesso' });
});

// ============================================
// AGENDAMENTOS
// ============================================

// Listar agendamentos de um usuário
app.get('/api/agendamentos', (req, res) => {
	const { usuarioId } = req.query;

	let resultado = db.agendamentos;

	if (usuarioId) {
		resultado = resultado.filter((a) => a.usuarioId === usuarioId);
	}

	res.json(resultado);
});

// Criar agendamento
app.post('/api/agendamentos', (req, res) => {
	const novoAgendamento = {
		id: uuidv4(),
		...req.body,
		status: 'pendente',
		createdAt: new Date().toISOString(),
	};

	db.agendamentos.push(novoAgendamento);
	res.status(201).json(novoAgendamento);
});

// Atualizar status do agendamento
app.patch('/api/agendamentos/:id', (req, res) => {
	const index = db.agendamentos.findIndex((a) => a.id === req.params.id);

	if (index === -1) {
		return res.status(404).json({ message: 'Agendamento não encontrado' });
	}

	db.agendamentos[index] = {
		...db.agendamentos[index],
		...req.body,
		updatedAt: new Date().toISOString(),
	};

	res.json(db.agendamentos[index]);
});

// Deletar agendamento
app.delete('/api/agendamentos/:id', (req, res) => {
	const index = db.agendamentos.findIndex((a) => a.id === req.params.id);

	if (index === -1) {
		return res.status(404).json({ message: 'Agendamento não encontrado' });
	}

	db.agendamentos.splice(index, 1);
	res.json({ message: 'Agendamento deletado com sucesso' });
});

// ============================================
// USUÁRIO (Dados pessoais)
// ============================================

// Buscar dados do usuário
app.get('/api/usuarios/:id', (req, res) => {
	const usuario = db.usuarios.find((u) => u.id === req.params.id);

	if (!usuario) {
		return res.status(404).json({ message: 'Usuário não encontrado' });
	}

	const { senha: _, ...usuarioSemSenha } = usuario;
	res.json(usuarioSemSenha);
});

// Listar todos os usuários (clientes) - útil para painel do estabelecimento
app.get('/api/usuarios', (req, res) => {
	res.json(
		db.usuarios.map((u) => {
			const { senha, ...rest } = u;
			return rest;
		})
	);
});

// Atualizar dados do usuário
app.put('/api/usuarios/:id', (req, res) => {
	const index = db.usuarios.findIndex((u) => u.id === req.params.id);

	if (index === -1) {
		return res.status(404).json({ message: 'Usuário não encontrado' });
	}

	const { senha, ...dadosAtualizacao } = req.body;

	db.usuarios[index] = {
		...db.usuarios[index],
		...dadosAtualizacao,
		updatedAt: new Date().toISOString(),
	};

	const { senha: _, ...usuarioSemSenha } = db.usuarios[index];
	res.json(usuarioSemSenha);
});

// ============================================
// TRANSAÇÕES
// ============================================

// Listar transações de um usuário
app.get('/api/transacoes', (req, res) => {
	const { usuarioId } = req.query;

	let resultado = db.transacoes;

	if (usuarioId) {
		resultado = resultado.filter((t) => t.usuarioId === usuarioId);
	}

	res.json(resultado);
});

// Criar transação
app.post('/api/transacoes', (req, res) => {
	const novaTransacao = {
		id: uuidv4(),
		...req.body,
		createdAt: new Date().toISOString(),
	};

	db.transacoes.push(novaTransacao);
	res.status(201).json(novaTransacao);
});

// ============================================
// MÉTODOS DE PAGAMENTO
// ============================================

// Listar métodos de pagamento de um usuário
app.get('/api/metodos-pagamento', (req, res) => {
	const { usuarioId } = req.query;

	let resultado = db.metodosPagamento;

	if (usuarioId) {
		resultado = resultado.filter((m) => m.usuarioId === usuarioId);
	}

	res.json(resultado);
});

// Criar método de pagamento
app.post('/api/metodos-pagamento', (req, res) => {
	const novoMetodo = {
		id: uuidv4(),
		...req.body,
		createdAt: new Date().toISOString(),
	};

	db.metodosPagamento.push(novoMetodo);
	res.status(201).json(novoMetodo);
});

// Deletar método de pagamento
app.delete('/api/metodos-pagamento/:id', (req, res) => {
	const index = db.metodosPagamento.findIndex((m) => m.id === req.params.id);

	if (index === -1) {
		return res.status(404).json({ message: 'Método não encontrado' });
	}

	db.metodosPagamento.splice(index, 1);
	res.json({ message: 'Método deletado com sucesso' });
});

// ============================================
// AVALIAÇÕES
// ============================================

// Listar avaliações de um usuário
app.get('/api/avaliacoes', (req, res) => {
	const { usuarioId } = req.query;

	let resultado = db.avaliacoes;

	if (usuarioId) {
		resultado = resultado.filter((a) => a.usuarioId === usuarioId);
	}

	res.json(resultado);
});

// Criar/Atualizar avaliação
app.post('/api/avaliacoes', (req, res) => {
	const { agendamentoId, nota, comentario, usuarioId } = req.body;

	const avaliacaoExistente = db.avaliacoes.find(
		(a) => a.agendamentoId === agendamentoId
	);

	if (avaliacaoExistente) {
		avaliacaoExistente.nota = nota;
		avaliacaoExistente.comentario = comentario;
		avaliacaoExistente.updatedAt = new Date().toISOString();
		return res.json(avaliacaoExistente);
	}

	const novaAvaliacao = {
		id: uuidv4(),
		usuarioId,
		agendamentoId,
		nota,
		comentario,
		createdAt: new Date().toISOString(),
	};

	db.avaliacoes.push(novaAvaliacao);
	res.status(201).json(novaAvaliacao);
});

// ============================================
// PREFERÊNCIAS DE NOTIFICAÇÃO
// ============================================

// Buscar preferências de notificação
app.get('/api/preferencias-notificacao/:usuarioId', (req, res) => {
	const preferencias = db.preferenciasNotificacao[req.params.usuarioId] || {
		lembretes: true,
		promocoes: true,
		confirmacoes: true,
	};

	res.json(preferencias);
});

// Atualizar preferências de notificação
app.put('/api/preferencias-notificacao/:usuarioId', (req, res) => {
	db.preferenciasNotificacao[req.params.usuarioId] = {
		...req.body,
		updatedAt: new Date().toISOString(),
	};

	res.json(db.preferenciasNotificacao[req.params.usuarioId]);
});

// ============================================
// SERVIDOR
// ============================================

app.listen(PORT, () => {
	console.log(`\n🚀 API AgendaAi rodando em http://localhost:${PORT}`);
	console.log(`\n📚 Endpoints disponíveis:`);
	console.log(`   POST   /api/auth/login`);
	console.log(`   POST   /api/auth/register`);
	console.log(`   GET    /api/estabelecimentos`);
	console.log(`   GET    /api/estabelecimentos/:id`);
	console.log(`   GET    /api/estabelecimentos/:id/servicos`);
	console.log(`   GET    /api/estabelecimentos/:id/profissionais`);
	console.log(`   GET    /api/agendamentos`);
	console.log(`   POST   /api/agendamentos`);
	console.log(`   GET    /api/usuarios/:id`);
	console.log(`   PUT    /api/usuarios/:id`);
	console.log(`   GET    /api/transacoes`);
	console.log(`   GET    /api/metodos-pagamento`);
	console.log(`   GET    /api/avaliacoes`);
	console.log(`   GET    /api/preferencias-notificacao/:usuarioId`);
	console.log(`\n💡 Credenciais de teste:`);
	console.log(`   Cliente: cliente@exemplo.com / 123456`);
	console.log(`   Estabelecimento: contato@belezapura.com / 123456\n`);
});
