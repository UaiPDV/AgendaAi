import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { authenticateToken, isCliente } from '../middlewares/auth.js'; // Assuming middleware lives here
import { openDb } from '../database.js';

const router = Router();

/**
 * @openapi
 * /api/usuarios/me:
 *   get:
 *     tags: [Cliente - Perfil]
 *     summary: Retorna dados do usuário logado (cliente ou estabelecimento)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Token ausente ou inválido
 *   put:
 *     tags: [Cliente - Perfil]
 *     summary: Atualiza dados e preferências do cliente logado
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
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *               notif_lembretes:
 *                 type: boolean
 *               notif_promocoes:
 *                 type: boolean
 *               pref_tema_escuro:
 *                 type: boolean
 *               pref_idioma:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado
 *       400:
 *         description: Nenhum dado enviado
 *   delete:
 *     tags: [Cliente - Perfil, Estabelecimento - Perfil]
 *     summary: Exclui a conta do usuário logado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conta excluída
 *       401:
 *         description: Token ausente ou inválido
 * /api/usuarios/me/pagamentos:
 *   get:
 *     tags: [Cliente - Pagamentos]
 *     summary: Lista formas de pagamento do cliente
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagamentos
 *   post:
 *     tags: [Cliente - Pagamentos]
 *     summary: Cria uma forma de pagamento
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tipo, descricao]
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [credito, debito, pix]
 *               descricao:
 *                 type: string
 *               token_gateway:
 *                 type: string
 *               principal:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Forma de pagamento criada
 * /api/usuarios/me/pagamentos/{id}:
 *   put:
 *     tags: [Cliente - Pagamentos]
 *     summary: Atualiza uma forma de pagamento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *               principal:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Forma de pagamento atualizada
 *   delete:
 *     tags: [Cliente - Pagamentos]
 *     summary: Remove uma forma de pagamento
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
 *         description: Removida com sucesso
 * /api/usuarios/me/avaliacoes:
 *   get:
 *     tags: [Cliente - Avaliacoes]
 *     summary: Lista avaliações feitas pelo cliente
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avaliações
 */

/**
 * GET /api/usuarios/me
 * Busca os dados do usuário (cliente OU estabelecimento) logado.
 */
router.get('/me', authenticateToken, async (req, res) => {
	let db;
	try {
		db = await openDb();
		let user;
		const userId = req.user.id;
		const userType = req.user.tipo;

		if (userType === 'cliente') {
			user = await db.get(
				'SELECT id, nome, email, telefone, cpf, data_nascimento, tipo, notif_lembretes, notif_promocoes, pref_tema_escuro, pref_idioma FROM usuarios WHERE id = ?',
				[userId]
			);
		} else if (userType === 'estabelecimento') {
			user = await db.get(
				'SELECT id, nome, email, telefone, endereco, tipo, notif_novos_agendamentos, notif_resumo_diario FROM estabelecimentos WHERE id = ?',
				[userId]
			);
		}

		if (!user) {
			return res.status(404).json({ message: 'Usuário não encontrado.' });
		}

		// Converte preferências para booleano na resposta
		if (user.notif_lembretes !== undefined)
			user.notif_lembretes = Boolean(user.notif_lembretes);
		if (user.notif_promocoes !== undefined)
			user.notif_promocoes = Boolean(user.notif_promocoes);
		if (user.pref_tema_escuro !== undefined)
			user.pref_tema_escuro = Boolean(user.pref_tema_escuro);
		if (user.notif_novos_agendamentos !== undefined)
			user.notif_novos_agendamentos = Boolean(
				user.notif_novos_agendamentos
			);
		if (user.notif_resumo_diario !== undefined)
			user.notif_resumo_diario = Boolean(user.notif_resumo_diario);

		res.status(200).json(user);
	} catch (error) {
		console.error('Erro ao buscar dados do usuário:', error);
		res.status(500).json({
			message: 'Erro interno ao buscar dados do usuário.',
		});
	} finally {
		if (db) await db.close();
	}
});

/**
 * PUT /api/usuarios/me
 * Atualiza os dados e preferências do usuário (cliente) logado.
 */
router.put('/me', [authenticateToken, isCliente], async (req, res) => {
	const {
		nome,
		telefone,
		dataNascimento,
		notif_lembretes,
		notif_promocoes,
		pref_tema_escuro,
		pref_idioma,
	} = req.body;
	const userId = req.user.id;

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
	if (dataNascimento !== undefined) {
		fields.push('data_nascimento = ?');
		params.push(dataNascimento);
	}
	if (notif_lembretes !== undefined) {
		fields.push('notif_lembretes = ?');
		params.push(notif_lembretes ? 1 : 0);
	}
	if (notif_promocoes !== undefined) {
		fields.push('notif_promocoes = ?');
		params.push(notif_promocoes ? 1 : 0);
	}
	if (pref_tema_escuro !== undefined) {
		fields.push('pref_tema_escuro = ?');
		params.push(pref_tema_escuro ? 1 : 0);
	}
	if (pref_idioma !== undefined) {
		fields.push('pref_idioma = ?');
		params.push(pref_idioma);
	}

	if (fields.length === 0) {
		return res
			.status(400)
			.json({ message: 'Nenhum dado fornecido para atualização.' });
	}

	fields.push('updated_at = CURRENT_TIMESTAMP');
	params.push(userId); // Para a cláusula WHERE

	let db;
	try {
		db = await openDb();
		await db.run(
			`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`,
			params
		);

		const usuarioAtualizado = await db.get(
			'SELECT id, nome, email, telefone, cpf, data_nascimento, tipo, notif_lembretes, notif_promocoes, pref_tema_escuro, pref_idioma FROM usuarios WHERE id = ?',
			[userId]
		);

		if (usuarioAtualizado.notif_lembretes !== undefined)
			usuarioAtualizado.notif_lembretes = Boolean(
				usuarioAtualizado.notif_lembretes
			);
		if (usuarioAtualizado.notif_promocoes !== undefined)
			usuarioAtualizado.notif_promocoes = Boolean(
				usuarioAtualizado.notif_promocoes
			);
		if (usuarioAtualizado.pref_tema_escuro !== undefined)
			usuarioAtualizado.pref_tema_escuro = Boolean(
				usuarioAtualizado.pref_tema_escuro
			);

		res.status(200).json(usuarioAtualizado);
	} catch (error) {
		console.error('Erro ao atualizar usuário:', error);
		res.status(500).json({ message: 'Erro interno ao atualizar usuário.' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * DELETE /api/usuarios/me
 * Exclui a conta do usuário logado (cliente ou estabelecimento).
 */
router.delete('/me', authenticateToken, async (req, res) => {
	const userId = req.user.id;
	const userType = req.user.tipo;
	let db;

	try {
		db = await openDb();
		if (userType === 'cliente') {
			await db.run('DELETE FROM usuarios WHERE id = ?', [userId]);
		} else if (userType === 'estabelecimento') {
			await db.run('DELETE FROM estabelecimentos WHERE id = ?', [userId]);
		} else {
			return res
				.status(400)
				.json({ message: 'Tipo de usuário inválido no token.' });
		}
		res.status(200).json({ message: 'Conta excluída com sucesso.' });
	} catch (error) {
		console.error('Erro ao excluir conta:', error);
		res.status(500).json({ message: 'Erro interno ao excluir conta.' });
	} finally {
		if (db) await db.close();
	}
});

// --- Rotas de Formas de Pagamento (Aninhadas) ---

/**
 * GET /api/usuarios/me/pagamentos
 * Lista as formas de pagamento do cliente logado.
 */
router.get(
	'/me/pagamentos',
	[authenticateToken, isCliente],
	async (req, res) => {
		const usuarioId = req.user.id;
		let db;
		try {
			db = await openDb();
			const formasPagamento = await db.all(
				'SELECT id, tipo, descricao, principal FROM formas_pagamento WHERE usuario_id = ? ORDER BY principal DESC, created_at DESC',
				[usuarioId]
			);
			formasPagamento.forEach(
				(fp) => (fp.principal = Boolean(fp.principal))
			);
			res.status(200).json(formasPagamento);
		} catch (error) {
			console.error('Erro ao listar formas de pagamento:', error);
			res.status(500).json({
				message: 'Erro interno ao listar formas de pagamento.',
			});
		} finally {
			if (db) await db.close();
		}
	}
);

/**
 * POST /api/usuarios/me/pagamentos
 * Adiciona uma nova forma de pagamento para o cliente logado.
 */
router.post(
	'/me/pagamentos',
	[authenticateToken, isCliente],
	async (req, res) => {
		const { tipo, descricao, token_gateway, principal } = req.body;
		const usuarioId = req.user.id;

		if (!tipo || !descricao) {
			return res
				.status(400)
				.json({ message: 'Tipo e descrição são obrigatórios.' });
		}
		const validTipos = ['credito', 'debito', 'pix'];
		if (!validTipos.includes(tipo)) {
			return res
				.status(400)
				.json({
					message: `Tipo inválido. Válidos: ${validTipos.join(
						', '
					)}.`,
				});
		}

		let db;
		try {
			db = await openDb();
			await db.run('BEGIN TRANSACTION'); // Inicia transação

			if (principal) {
				await db.run(
					'UPDATE formas_pagamento SET principal = 0 WHERE usuario_id = ?',
					[usuarioId]
				);
			}

			const result = await db.run(
				'INSERT INTO formas_pagamento (usuario_id, tipo, descricao, token_gateway, principal) VALUES (?, ?, ?, ?, ?)',
				[
					usuarioId,
					tipo,
					descricao,
					token_gateway || null,
					principal ? 1 : 0,
				]
			);

			await db.run('COMMIT'); // Finaliza transação

			const novaForma = await db.get(
				'SELECT id, tipo, descricao, principal FROM formas_pagamento WHERE id = ?',
				[result.lastID]
			);
			novaForma.principal = Boolean(novaForma.principal);

			res.status(201).json(novaForma);
		} catch (error) {
			if (db) await db.run('ROLLBACK'); // Desfaz em caso de erro
			console.error('Erro ao adicionar forma de pagamento:', error);
			res.status(500).json({
				message: 'Erro interno ao adicionar forma de pagamento.',
			});
		} finally {
			if (db) await db.close();
		}
	}
);

/**
 * PUT /api/usuarios/me/pagamentos/:id
 * Atualiza uma forma de pagamento (ex: marcar como principal).
 */
router.put(
	'/me/pagamentos/:id',
	[authenticateToken, isCliente],
	async (req, res) => {
		const { id } = req.params;
		const { descricao, principal } = req.body; // Apenas descrição e principal podem ser editados (simples)
		const usuarioId = req.user.id;

		if (descricao === undefined && principal === undefined) {
			return res
				.status(400)
				.json({
					message:
						'Nenhum dado fornecido para atualização (descricao ou principal).',
				});
		}

		let db;
		try {
			db = await openDb();
			await db.run('BEGIN TRANSACTION'); // Inicia transação

			// Busca o método para garantir que pertence ao usuário
			const metodo = await db.get(
				'SELECT id FROM formas_pagamento WHERE id = ? AND usuario_id = ?',
				[id, usuarioId]
			);
			if (!metodo) {
				await db.run('ROLLBACK');
				return res
					.status(404)
					.json({
						message:
							'Forma de pagamento não encontrada ou não pertence a este usuário.',
					});
			}

			// Se marcar como principal, desmarca os outros PRIMEIRO
			if (principal === true) {
				await db.run(
					'UPDATE formas_pagamento SET principal = 0 WHERE usuario_id = ? AND id != ?',
					[usuarioId, id]
				);
			}

			// Monta a query de atualização
			const fieldsToUpdate = [];
			const params = [];
			if (descricao !== undefined) {
				fieldsToUpdate.push('descricao = ?');
				params.push(descricao);
			}
			if (principal !== undefined) {
				fieldsToUpdate.push('principal = ?');
				params.push(principal ? 1 : 0);
			}

			if (fieldsToUpdate.length > 0) {
				params.push(id); // for WHERE id = ?
				params.push(usuarioId); // for WHERE usuario_id = ?
				await db.run(
					`UPDATE formas_pagamento SET ${fieldsToUpdate.join(
						', '
					)} WHERE id = ? AND usuario_id = ?`,
					params
				);
			}

			await db.run('COMMIT'); // Finaliza transação

			const formaAtualizada = await db.get(
				'SELECT id, tipo, descricao, principal FROM formas_pagamento WHERE id = ?',
				[id]
			);
			formaAtualizada.principal = Boolean(formaAtualizada.principal);

			res.status(200).json(formaAtualizada);
		} catch (error) {
			if (db) await db.run('ROLLBACK');
			console.error('Erro ao atualizar forma de pagamento:', error);
			res.status(500).json({
				message: 'Erro interno ao atualizar forma de pagamento.',
			});
		} finally {
			if (db) await db.close();
		}
	}
);

/**
 * DELETE /api/usuarios/me/pagamentos/:id
 * Remove uma forma de pagamento do cliente logado.
 */
router.delete(
	'/me/pagamentos/:id',
	[authenticateToken, isCliente],
	async (req, res) => {
		const { id } = req.params;
		const usuarioId = req.user.id;
		let db;
		try {
			db = await openDb();
			const result = await db.run(
				'DELETE FROM formas_pagamento WHERE id = ? AND usuario_id = ?',
				[id, usuarioId]
			);

			if (result.changes === 0) {
				return res
					.status(404)
					.json({
						message:
							'Forma de pagamento não encontrada ou não pertence a este usuário.',
					});
			}

			res.status(200).json({
				message: 'Forma de pagamento removida com sucesso.',
			});
		} catch (error) {
			console.error('Erro ao remover forma de pagamento:', error);
			res.status(500).json({
				message: 'Erro interno ao remover forma de pagamento.',
			});
		} finally {
			if (db) await db.close();
		}
	}
);

// --- Rotas de Avaliações do Usuário (Aninhadas) ---

/**
 * GET /api/usuarios/me/avaliacoes
 * Lista as avaliações feitas pelo cliente logado.
 */
router.get(
	'/me/avaliacoes',
	[authenticateToken, isCliente],
	async (req, res) => {
		const usuarioId = req.user.id;
		let db;
		try {
			db = await openDb();
			// Junta com agendamentos para pegar detalhes
			const avaliacoes = await db.all(
				`
            SELECT
                av.id, av.agendamento_id, av.nota, av.comentario, av.created_at,
                ag.estabelecimento_nome, ag.servico_nome, ag.profissional_nome, ag.data, ag.horario
            FROM avaliacoes av
            JOIN agendamentos ag ON av.agendamento_id = ag.id
            WHERE av.usuario_id = ?
            ORDER BY av.created_at DESC
        `,
				[usuarioId]
			);
			res.status(200).json(avaliacoes);
		} catch (error) {
			console.error('Erro ao listar minhas avaliações:', error);
			res.status(500).json({
				message: 'Erro interno ao listar avaliações.',
			});
		} finally {
			if (db) await db.close();
		}
	}
);

export default router;
