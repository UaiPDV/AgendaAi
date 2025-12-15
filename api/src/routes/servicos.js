import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, isEstabelecimento } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

// Protege todas as rotas de serviços (CUD) - GET é público via /estabelecimentos/:id/servicos
router.use(authenticateToken);
router.use(isEstabelecimento);

/**
 * @openapi
 * /api/servicos:
 *   post:
 *     tags: [Estabelecimento - Servicos]
 *     summary: Cria um serviço para o estabelecimento logado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, preco, duracao]
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               duracao:
 *                 type: integer
 *               categoria:
 *                 type: string
 *               icone:
 *                 type: string
 *               ativo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Serviço criado
 * /api/servicos/{id}:
 *   put:
 *     tags: [Estabelecimento - Servicos]
 *     summary: Atualiza um serviço
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
 *         description: Serviço atualizado
 *       404:
 *         description: Serviço não encontrado
 *   delete:
 *     tags: [Estabelecimento - Servicos]
 *     summary: Deleta um serviço
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
 *         description: Serviço removido
 */

/**
 * POST /api/servicos
 * Cria um novo serviço para o estabelecimento logado.
 */
router.post('/', async (req, res) => {
	// Adiciona categoria, icone, ativo
	const { nome, descricao, preco, duracao, categoria, icone, ativo } =
		req.body;
	const estabelecimentoId = req.user.id; // ID do estabelecimento logado

	if (!nome || preco === undefined || duracao === undefined) {
		return res
			.status(400)
			.json({ message: 'Nome, preço e duração são obrigatórios.' });
	}

	const servicoId = uuidv4();
	let db;
	try {
		db = await openDb();
		await db.run(
			'INSERT INTO servicos (id, estabelecimento_id, nome, descricao, preco, duracao, categoria, icone, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				servicoId,
				estabelecimentoId,
				nome,
				descricao || null,
				preco,
				duracao,
				categoria || null,
				icone || null,
				ativo !== undefined ? (ativo ? 1 : 0) : 1, // Default to active (1)
			]
		);

		const novoServico = await db.get(
			'SELECT * FROM servicos WHERE id = ?',
			[servicoId]
		);
		// Converte 'ativo' de volta para booleano
		if (novoServico) {
			novoServico.ativo = Boolean(novoServico.ativo);
		}
		res.status(201).json(novoServico);
	} catch (error) {
		console.error('Erro ao criar serviço:', error);
		res.status(500).json({ message: 'Erro interno ao criar serviço.' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * PUT /api/servicos/:id
 * Atualiza um serviço.
 */
router.put('/:id', async (req, res) => {
	// Adiciona categoria, icone, ativo
	const { nome, descricao, preco, duracao, categoria, icone, ativo } =
		req.body;
	const { id } = req.params;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();
		const servico = await db.get(
			'SELECT * FROM servicos WHERE id = ? AND estabelecimento_id = ?',
			[id, estabelecimentoId]
		);
		if (!servico) {
			return res.status(404).json({
				message:
					'Serviço não encontrado ou não pertence a este estabelecimento.',
			});
		}

		// Atualiza apenas os campos fornecidos
		const fieldsToUpdate = [];
		const params = [];

		if (nome !== undefined) {
			fieldsToUpdate.push('nome = ?');
			params.push(nome);
		}
		if (descricao !== undefined) {
			fieldsToUpdate.push('descricao = ?');
			params.push(descricao);
		}
		if (preco !== undefined) {
			fieldsToUpdate.push('preco = ?');
			params.push(preco);
		}
		if (duracao !== undefined) {
			fieldsToUpdate.push('duracao = ?');
			params.push(duracao);
		}
		if (categoria !== undefined) {
			fieldsToUpdate.push('categoria = ?');
			params.push(categoria);
		}
		if (icone !== undefined) {
			fieldsToUpdate.push('icone = ?');
			params.push(icone);
		}
		if (ativo !== undefined) {
			fieldsToUpdate.push('ativo = ?');
			params.push(ativo ? 1 : 0);
		}

		if (fieldsToUpdate.length === 0) {
			return res
				.status(400)
				.json({ message: 'Nenhum campo fornecido para atualização.' });
		}

		fieldsToUpdate.push('updated_at = CURRENT_TIMESTAMP');
		params.push(id); // For WHERE clause

		await db.run(
			`UPDATE servicos SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
			params
		);

		const servicoAtualizado = await db.get(
			'SELECT * FROM servicos WHERE id = ?',
			[id]
		);
		// Converte 'ativo' de volta para booleano
		if (servicoAtualizado) {
			servicoAtualizado.ativo = Boolean(servicoAtualizado.ativo);
		}
		res.status(200).json(servicoAtualizado);
	} catch (error) {
		console.error('Erro ao atualizar serviço:', error);
		res.status(500).json({ message: 'Erro interno ao atualizar serviço.' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * DELETE /api/servicos/:id
 * Deleta um serviço.
 */
router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();
		const servico = await db.get(
			'SELECT * FROM servicos WHERE id = ? AND estabelecimento_id = ?',
			[id, estabelecimentoId]
		);
		if (!servico) {
			return res.status(404).json({
				message:
					'Serviço não encontrado ou não pertence a este estabelecimento.',
			});
		}

		await db.run('DELETE FROM servicos WHERE id = ?', [id]);
		res.status(200).json({ message: 'Serviço deletado com sucesso.' });
	} catch (error) {
		console.error('Erro ao deletar serviço:', error);
		// Check for foreign key constraint error (if appointments exist for this service)
		if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
			return res
				.status(400)
				.json({
					message:
						'Não é possível deletar o serviço pois existem agendamentos vinculados a ele.',
				});
		}
		res.status(500).json({ message: 'Erro interno ao deletar serviço.' });
	} finally {
		if (db) await db.close();
	}
});

export default router;
