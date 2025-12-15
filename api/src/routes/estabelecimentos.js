import { Router } from 'express';
import crypto from 'crypto'; // Para gerar ID de cliente
import { authenticateToken, isEstabelecimento } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

/**
 * @openapi
 * /api/estabelecimentos:
 *   get:
 *     tags: [Publico - Estabelecimentos]
 *     summary: Lista estabelecimentos com média de avaliações
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de estabelecimentos
 * /api/estabelecimentos/me:
 *   get:
 *     tags: [Estabelecimento - Perfil]
 *     summary: Busca dados do estabelecimento logado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do estabelecimento
 *       401:
 *         description: Token inválido
 *   put:
 *     tags: [Estabelecimento - Perfil]
 *     summary: Atualiza dados do estabelecimento logado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *               horarioFuncionamento:
 *                 type: string
 *               imagem:
 *                 type: string
 *               notif_novos_agendamentos:
 *                 type: boolean
 *               notif_resumo_diario:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estabelecimento atualizado
 *       400:
 *         description: Nenhum dado enviado
 * /api/estabelecimentos/{id}:
 *   get:
 *     tags: [Publico - Estabelecimentos]
 *     summary: Busca estabelecimento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do estabelecimento
 *       404:
 *         description: Não encontrado
 * /api/estabelecimentos/{id}/servicos:
 *   get:
 *     tags: [Publico - Servicos]
 *     summary: Lista serviços ativos de um estabelecimento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de serviços
 * /api/estabelecimentos/{id}/profissionais:
 *   get:
 *     tags: [Publico - Profissionais]
 *     summary: Lista profissionais de um estabelecimento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de profissionais
 * /api/estabelecimentos/{id}/clientes:
 *   get:
 *     tags: [Estabelecimento - Clientes]
 *     summary: Lista clientes do estabelecimento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de clientes
 *   post:
 *     tags: [Estabelecimento - Clientes]
 *     summary: Cria um cliente para o estabelecimento
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome]
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente criado
 * /api/estabelecimentos/{id}/avaliacoes:
 *   get:
 *     tags: [Publico - Avaliacoes]
 *     summary: Lista avaliações de um estabelecimento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de avaliações
 */

/**
 * GET /api/estabelecimentos
 * Lista todos os estabelecimentos. Público.
 */
router.get('/', async (req, res) => {
	const { search } = req.query;
	let db;
	try {
		db = await openDb();
		// Seleciona apenas campos públicos + média de avaliação (calculada ou da tabela)
		let query = `
            SELECT
                e.id, e.nome, e.email, e.telefone, e.endereco, e.imagem,
                e.horario_funcionamento, -- Manter por compatibilidade, mas preferir dados de config
                COALESCE(AVG(av.nota), 0) as avaliacao_calculada, -- Calcula média real
                COUNT(av.id) as total_avaliacoes_calculado -- Conta avaliações reais
            FROM estabelecimentos e
            LEFT JOIN avaliacoes av ON e.id = av.estabelecimento_id
        `;
		const params = [];

		if (search) {
			query += ' WHERE e.nome LIKE ?';
			params.push(`%${search}%`);
		}

		query += ' GROUP BY e.id ORDER BY e.nome ASC'; // Agrupa para calcular média e conta

		const estabelecimentos = await db.all(query, params);

		// Formata a avaliação para 1 casa decimal
		estabelecimentos.forEach((est) => {
			est.avaliacao_calculada = parseFloat(
				est.avaliacao_calculada.toFixed(1)
			);
		});

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
			`SELECT id, nome, email, telefone, endereco, imagem,
             horario_funcionamento, -- Legado
             notif_novos_agendamentos, notif_resumo_diario -- Preferências
             FROM estabelecimentos WHERE id = ?`,
			[req.user.id]
		);
		if (!estab) {
			return res
				.status(404)
				.json({ message: 'Estabelecimento não encontrado.' });
		}
		// Busca avaliação e total separadamente (mais simples que JOIN aqui)
		const rating = await db.get(
			'SELECT COALESCE(AVG(nota), 0) as avg_rating, COUNT(id) as total_reviews FROM avaliacoes WHERE estabelecimento_id = ?',
			[req.user.id]
		);
		estab.avaliacao = parseFloat(rating.avg_rating.toFixed(1));
		estab.total_avaliacoes = rating.total_reviews;

		// Converte preferências para booleano
		estab.notif_novos_agendamentos = Boolean(
			estab.notif_novos_agendamentos
		);
		estab.notif_resumo_diario = Boolean(estab.notif_resumo_diario);

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
			'SELECT id, nome, email, telefone, endereco, imagem, horario_funcionamento FROM estabelecimentos WHERE id = ?',
			[req.params.id]
		);

		if (!estab) {
			return res
				.status(404)
				.json({ message: 'Estabelecimento não encontrado.' });
		}
		// Busca avaliação e total separadamente
		const rating = await db.get(
			'SELECT COALESCE(AVG(nota), 0) as avg_rating, COUNT(id) as total_reviews FROM avaliacoes WHERE estabelecimento_id = ?',
			[req.params.id]
		);
		estab.avaliacao = parseFloat(rating.avg_rating.toFixed(1));
		estab.total_avaliacoes = rating.total_reviews;

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
	// Adiciona preferências de notificação
	const {
		nome,
		telefone,
		endereco,
		horarioFuncionamento, // Legado
		imagem,
		notif_novos_agendamentos,
		notif_resumo_diario,
	} = req.body;
	const estabId = req.user.id;

	const fields = [];
	const params = [];

	if (nome !== undefined) {
		fields.push('nome = ?');
		params.push(nome);
	}
	if (telefone !== undefined) {
		fields.push('telefone = ?');
		params.push(telefone);
	}
	if (endereco !== undefined) {
		fields.push('endereco = ?');
		params.push(endereco);
	}
	if (horarioFuncionamento !== undefined) {
		fields.push('horario_funcionamento = ?');
		params.push(horarioFuncionamento);
	} // Manter por compatibilidade?
	if (imagem !== undefined) {
		fields.push('imagem = ?');
		params.push(imagem);
	}
	// Preferências (converte boolean para 0/1)
	if (notif_novos_agendamentos !== undefined) {
		fields.push('notif_novos_agendamentos = ?');
		params.push(notif_novos_agendamentos ? 1 : 0);
	}
	if (notif_resumo_diario !== undefined) {
		fields.push('notif_resumo_diario = ?');
		params.push(notif_resumo_diario ? 1 : 0);
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
			`SELECT id, nome, email, telefone, endereco, imagem,
             horario_funcionamento, notif_novos_agendamentos, notif_resumo_diario
             FROM estabelecimentos WHERE id = ?`,
			[estabId]
		);
		// Busca avaliação e total separadamente
		const rating = await db.get(
			'SELECT COALESCE(AVG(nota), 0) as avg_rating, COUNT(id) as total_reviews FROM avaliacoes WHERE estabelecimento_id = ?',
			[estabId]
		);
		estabAtualizado.avaliacao = parseFloat(rating.avg_rating.toFixed(1));
		estabAtualizado.total_avaliacoes = rating.total_reviews;

		// Converte preferências para booleano
		estabAtualizado.notif_novos_agendamentos = Boolean(
			estabAtualizado.notif_novos_agendamentos
		);
		estabAtualizado.notif_resumo_diario = Boolean(
			estabAtualizado.notif_resumo_diario
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
 * Lista os serviços ATIVOS de um estabelecimento. Público.
 */
router.get('/:id/servicos', async (req, res) => {
	let db;
	try {
		db = await openDb();
		const servicos = await db.all(
			'SELECT * FROM servicos WHERE estabelecimento_id = ? AND ativo = 1 ORDER BY nome ASC', // Filtra por ativo=1
			[req.params.id]
		);
		// Converte 'ativo' para booleano (embora sempre será true aqui)
		servicos.forEach((s) => (s.ativo = Boolean(s.ativo)));
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
			'SELECT id, nome, telefone, especialidades, horario_entrada, horario_saida, dias_trabalho FROM profissionais WHERE estabelecimento_id = ? ORDER BY nome ASC',
			[req.params.id]
		);

		// Converte JSON de volta para array
		const profissionaisFormatados = profissionais.map((p) => ({
			...p,
			especialidades: p.especialidades
				? JSON.parse(p.especialidades)
				: [],
			dias_trabalho: p.dias_trabalho ? JSON.parse(p.dias_trabalho) : [],
		}));

		res.status(200).json(profissionaisFormatados);
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
 * Lista os clientes de um estabelecimento, incluindo a última visita.
 */
router.get(
	'/:id/clientes',
	[authenticateToken, isEstabelecimento],
	async (req, res) => {
		let db;
		try {
			const { id } = req.params;

			if (id !== 'me' && String(req.user.id) !== String(id)) {
				return res.status(403).json({ message: 'Acesso negado.' });
			}
			const estabelecimentoId = id === 'me' ? req.user.id : id;

			db = await openDb();
			// Query para buscar clientes e a data da última visita (último agendamento)
			const query = `
                SELECT
                    c.*,
                    MAX(a.data) as ultima_visita
                FROM clientes c
                LEFT JOIN agendamentos a ON c.id = (SELECT u.id FROM usuarios u WHERE u.email = c.email OR u.telefone = c.telefone LIMIT 1) -- Tenta linkar cliente do estabelecimento com usuário global
                                           AND a.estabelecimento_id = c.estabelecimento_id -- Garante que é agendamento neste estabelecimento
                WHERE c.estabelecimento_id = ?
                GROUP BY c.id
                ORDER BY c.nome ASC;
            `;
			// NOTA: A ligação entre 'clientes' (tabela do estabelecimento) e 'usuarios' (tabela global)
			// é feita por email ou telefone, o que pode não ser ideal ou preciso.
			// Uma FK direta `usuario_id` na tabela `clientes` seria melhor se possível.
			const clientes = await db.all(query, [estabelecimentoId]);

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

			if (!nome?.trim()) {
				return res.status(400).json({ message: 'Nome é obrigatório' });
			}

			if (id !== 'me' && String(req.user.id) !== String(id)) {
				return res.status(403).json({ message: 'Acesso negado.' });
			}

			const estabelecimentoId = id === 'me' ? req.user.id : id;
			const clienteId = crypto.randomUUID(); // Usar crypto para UUIDs mais seguros

			db = await openDb();

			// Opcional: Verificar se já existe cliente com mesmo email/telefone para este estabelecimento
			const existente = await db.get(
				'SELECT id FROM clientes WHERE estabelecimento_id = ? AND (email = ? OR telefone = ?)',
				[estabelecimentoId, email || null, telefone || null]
			);
			if (existente && (email || telefone)) {
				// Só barra se email ou telefone foram fornecidos e já existem
				return res
					.status(409)
					.json({
						message:
							'Cliente com este email ou telefone já existe para este estabelecimento.',
					});
			}

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

			const novoCliente = await db.get(
				'SELECT * FROM clientes WHERE id = ?',
				[clienteId]
			);

			res.status(201).json(novoCliente);
		} catch (error) {
			console.error('Erro ao criar cliente:', error);
			res.status(500).json({ message: 'Erro interno ao criar cliente.' });
		} finally {
			if (db) await db.close();
		}
	}
);

// --- Rotas Aninhadas de Avaliações ---

/**
 * GET /api/estabelecimentos/:id/avaliacoes
 * Lista as avaliações de um estabelecimento. Público.
 */
router.get('/:id/avaliacoes', async (req, res) => {
	const estabelecimentoId = req.params.id;
	let db;
	try {
		db = await openDb();
		const avaliacoes = await db.all(
			`
            SELECT av.*, u.nome as usuario_nome
            FROM avaliacoes av
            JOIN usuarios u ON av.usuario_id = u.id
            WHERE av.estabelecimento_id = ?
            ORDER BY av.created_at DESC
        `,
			[estabelecimentoId]
		);
		res.status(200).json(avaliacoes);
	} catch (error) {
		console.error('Erro ao listar avaliações:', error);
		res.status(500).json({ message: 'Erro interno ao listar avaliações.' });
	} finally {
		if (db) await db.close();
	}
});

export default router;
