import { Router } from 'express';
import { authenticateToken, isEstabelecimento } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

/**
 * GET /api/estabelecimentos
 * Lista todos os estabelecimentos. Público.
 * Aceita query ?search=
 */
router.get('/', async (req, res) => {
	const { search } = req.query;
	let db;
	try {
		db = await openDb();
		let query =
			'SELECT id, nome, email, telefone, endereco, imagem, avaliacao, total_avaliacoes, horario_funcionamento FROM estabelecimentos';
		const params = [];

		if (search) {
			query += ' WHERE nome LIKE ?';
			params.push(`%${search}%`);
		}

		const estabelecimentos = await db.all(query, params);
		res.status(200).json(estabelecimentos);
	} catch (error) {
		console.error('Erro ao listar estabelecimentos:', error);
		res.status(500).json({
			message: 'Erro interno ao listar estabelecimentos.',
		});
	} finally {
		if (db) await db.close();
	}
});

/**
 * GET /api/estabelecimentos/me
 * Busca os dados do estabelecimento logado.
 */
router.get('/me', [authenticateToken, isEstabelecimento], async (req, res) => {
	let db;
	try {
		db = await openDb();
		const estab = await db.get(
			'SELECT id, nome, email, telefone, endereco, imagem, avaliacao, total_avaliacoes, horario_funcionamento FROM estabelecimentos WHERE id = ?',
			[req.user.id]
		);
		if (!estab) {
			return res
				.status(404)
				.json({ message: 'Estabelecimento não encontrado.' });
		}
		res.status(200).json(estab);
	} catch (error) {
		console.error('Erro ao buscar estabelecimento:', error);
		res.status(500).json({
			message: 'Erro interno ao buscar estabelecimento.',
		});
	} finally {
		if (db) await db.close();
	}
});

/**
 * GET /api/estabelecimentos/:id
 * Busca um estabelecimento específico pelo ID. Público.
 */
router.get('/:id', async (req, res) => {
	let db;
	try {
		db = await openDb();
		const estab = await db.get(
			'SELECT id, nome, email, telefone, endereco, imagem, avaliacao, total_avaliacoes, horario_funcionamento FROM estabelecimentos WHERE id = ?',
			[req.params.id]
		);

		if (!estab) {
			return res
				.status(404)
				.json({ message: 'Estabelecimento não encontrado.' });
		}
		res.status(200).json(estab);
	} catch (error) {
		console.error('Erro ao buscar estabelecimento:', error);
		res.status(500).json({
			message: 'Erro interno ao buscar estabelecimento.',
		});
	} finally {
		if (db) await db.close();
	}
});

/**
 * PUT /api/estabelecimentos/me
 * Atualiza o estabelecimento logado.
 */
router.put('/me', [authenticateToken, isEstabelecimento], async (req, res) => {
	const { nome, telefone, endereco, horarioFuncionamento, imagem } = req.body;
	const estabId = req.user.id;

	const fields = [];
	const params = [];

	if (nome) {
		fields.push('nome = ?');
		params.push(nome);
	}
	if (telefone) {
		fields.push('telefone = ?');
		params.push(telefone);
	}
	if (endereco) {
		fields.push('endereco = ?');
		params.push(endereco);
	}
	if (horarioFuncionamento) {
		fields.push('horario_funcionamento = ?');
		params.push(horarioFuncionamento);
	}
	if (imagem) {
		fields.push('imagem = ?');
		params.push(imagem);
	}

	if (fields.length === 0) {
		return res
			.status(400)
			.json({ message: 'Nenhum dado fornecido para atualização.' });
	}

	fields.push('updated_at = CURRENT_TIMESTAMP');
	params.push(estabId); // Para a cláusula WHERE

	let db;
	try {
		db = await openDb();
		await db.run(
			`UPDATE estabelecimentos SET ${fields.join(', ')} WHERE id = ?`,
			params
		);

		const estabAtualizado = await db.get(
			'SELECT id, nome, email, telefone, endereco, imagem, avaliacao, total_avaliacoes, horario_funcionamento FROM estabelecimentos WHERE id = ?',
			[estabId]
		);
		res.status(200).json(estabAtualizado);
	} catch (error) {
		console.error('Erro ao atualizar estabelecimento:', error);
		res.status(500).json({
			message: 'Erro interno ao atualizar estabelecimento.',
		});
	} finally {
		if (db) await db.close();
	}
});

// --- Rotas Aninhadas de Serviços ---

/**
 * GET /api/estabelecimentos/:id/servicos
 * Lista os serviços de um estabelecimento. Público.
 */
router.get('/:id/servicos', async (req, res) => {
	let db;
	try {
		db = await openDb();
		const servicos = await db.all(
			'SELECT * FROM servicos WHERE estabelecimento_id = ?',
			[req.params.id]
		);
		res.status(200).json(servicos);
	} catch (error) {
		console.error('Erro ao listar serviços:', error);
		res.status(500).json({ message: 'Erro interno ao listar serviços.' });
	} finally {
		if (db) await db.close();
	}
});

// --- Rotas Aninhadas de Profissionais ---

/**
 * GET /api/estabelecimentos/:id/profissionais
 * Lista os profissionais de um estabelecimento. Público.
 */
router.get('/:id/profissionais', async (req, res) => {
	let db;
	try {
		db = await openDb();
		const profissionais = await db.all(
			'SELECT * FROM profissionais WHERE estabelecimento_id = ?',
			[req.params.id]
		);

		// Converte a string JSON de especialidades em array
		const profissionaisComEspecialidades = profissionais.map((p) => ({
			...p,
			especialidades: p.especialidades
				? JSON.parse(p.especialidades)
				: [],
		}));

		res.status(200).json(profissionaisComEspecialidades);
	} catch (error) {
		console.error('Erro ao listar profissionais:', error);
		res.status(500).json({
			message: 'Erro interno ao listar profissionais.',
		});
	} finally {
		if (db) await db.close();
	}
});

// --- Rotas Aninhadas de Clientes ---

/**
 * GET /api/estabelecimentos/:id/clientes
 * Lista os clientes de um estabelecimento.
 */
router.get(
	'/:id/clientes',
	[authenticateToken, isEstabelecimento],
	async (req, res) => {
		let db;
		try {
			const { id } = req.params;

			// Apenas o próprio estabelecimento pode ver seus clientes
			// OU usar 'me' como id especial
			if (id !== 'me' && String(req.user.id) !== String(id)) {
				return res.status(403).json({
					message:
						'Você não tem permissão para acessar esses clientes.',
				});
			}

			const estabelecimentoId = id === 'me' ? req.user.id : id;

			db = await openDb();
			const clientes = await db.all(
				'SELECT * FROM clientes WHERE estabelecimento_id = ? ORDER BY nome ASC',
				[estabelecimentoId]
			);
			res.status(200).json(clientes);
		} catch (error) {
			console.error('Erro ao listar clientes:', error);
			res.status(500).json({
				message: 'Erro interno ao listar clientes.',
			});
		} finally {
			if (db) await db.close();
		}
	}
);

/**
 * POST /api/estabelecimentos/:id/clientes
 * Cria um novo cliente para o estabelecimento.
 */
router.post(
	'/:id/clientes',
	[authenticateToken, isEstabelecimento],
	async (req, res) => {
		let db;
		try {
			const { id } = req.params;
			const { nome, email, telefone } = req.body;

			// Validação
			if (!nome?.trim()) {
				return res.status(400).json({ message: 'Nome é obrigatório' });
			}

			// Apenas o próprio estabelecimento pode criar clientes para si
			// OU usar 'me' como id especial
			if (id !== 'me' && String(req.user.id) !== String(id)) {
				return res.status(403).json({
					message:
						'Você não tem permissão para criar clientes para este estabelecimento.',
				});
			}

			const estabelecimentoId = id === 'me' ? req.user.id : id;
			const clienteId = crypto.randomUUID();

			db = await openDb();

			// Cria o cliente
			await db.run(
				`INSERT INTO clientes (id, estabelecimento_id, nome, email, telefone) 
			 VALUES (?, ?, ?, ?, ?)`,
				[
					clienteId,
					estabelecimentoId,
					nome.trim(),
					email || null,
					telefone || null,
				]
			);

			// Retorna o cliente criado
			const novoCliente = await db.get(
				'SELECT * FROM clientes WHERE id = ?',
				[clienteId]
			);

			res.status(201).json(novoCliente);
		} catch (error) {
			console.error('Erro ao criar cliente:', error);
			res.status(500).json({
				message: 'Erro interno ao criar cliente.',
			});
		} finally {
			if (db) await db.close();
		}
	}
);

export default router;
