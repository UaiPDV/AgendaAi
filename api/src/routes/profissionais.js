import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, isEstabelecimento } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

// Protege todas as rotas de profissionais (CUD) - GET é público via /estabelecimentos/:id/profissionais
router.use(authenticateToken);
router.use(isEstabelecimento);

/**
 * @openapi
 * /api/profissionais:
 *   post:
 *     tags: [Estabelecimento - Profissionais]
 *     summary: Cria um profissional para o estabelecimento logado
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
 *               telefone:
 *                 type: string
 *               especialidades:
 *                 type: array
 *                 items:
 *                   type: string
 *               horario_entrada:
 *                 type: string
 *               horario_saida:
 *                 type: string
 *               dias_trabalho:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Profissional criado
 * /api/profissionais/{id}:
 *   put:
 *     tags: [Estabelecimento - Profissionais]
 *     summary: Atualiza dados de um profissional
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
 *         description: Profissional atualizado
 *       404:
 *         description: Não encontrado
 *   delete:
 *     tags: [Estabelecimento - Profissionais]
 *     summary: Remove um profissional
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
 *         description: Profissional removido
 */

/**
 * POST /api/profissionais
 * Cria um novo profissional para o estabelecimento logado.
 */
router.post('/', async (req, res) => {
	// Adiciona horario_entrada, horario_saida, dias_trabalho
	const {
		nome,
		telefone,
		especialidades,
		horario_entrada,
		horario_saida,
		dias_trabalho,
	} = req.body;
	const estabelecimentoId = req.user.id;

	if (!nome) {
		return res.status(400).json({ message: 'Nome é obrigatório.' });
	}

	const especialidadesJSON = JSON.stringify(especialidades || []);
	// Garante que dias_trabalho seja um array JSON, mesmo que venha vazio ou nulo
	const diasTrabalhoJSON = JSON.stringify(
		Array.isArray(dias_trabalho) ? dias_trabalho : []
	);
	const profissionalId = uuidv4();

	let db;
	try {
		db = await openDb();
		await db.run(
			'INSERT INTO profissionais (id, estabelecimento_id, nome, telefone, especialidades, horario_entrada, horario_saida, dias_trabalho) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
			[
				profissionalId,
				estabelecimentoId,
				nome,
				telefone || null,
				especialidadesJSON,
				horario_entrada || null,
				horario_saida || null,
				diasTrabalhoJSON,
			]
		);

		const novoProfissional = await db.get(
			'SELECT * FROM profissionais WHERE id = ?',
			[profissionalId]
		);
		// Converte JSON de volta para array
		novoProfissional.especialidades = JSON.parse(
			novoProfissional.especialidades
		);
		novoProfissional.dias_trabalho = JSON.parse(
			novoProfissional.dias_trabalho
		);

		res.status(201).json(novoProfissional);
	} catch (error) {
		console.error('Erro ao criar profissional:', error);
		res.status(500).json({
			message: 'Erro interno ao criar profissional.',
		});
	} finally {
		if (db) await db.close();
	}
});

/**
 * PUT /api/profissionais/:id
 * Atualiza um profissional.
 */
router.put('/:id', async (req, res) => {
	// Adiciona horario_entrada, horario_saida, dias_trabalho
	const {
		nome,
		telefone,
		especialidades,
		horario_entrada,
		horario_saida,
		dias_trabalho,
	} = req.body;
	const { id } = req.params;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();
		const profissional = await db.get(
			'SELECT * FROM profissionais WHERE id = ? AND estabelecimento_id = ?',
			[id, estabelecimentoId]
		);
		if (!profissional) {
			return res.status(404).json({
				message:
					'Profissional não encontrado ou não pertence a este estabelecimento.',
			});
		}

		// Atualiza apenas os campos fornecidos
		const fieldsToUpdate = [];
		const params = [];

		if (nome !== undefined) {
			fieldsToUpdate.push('nome = ?');
			params.push(nome);
		}
		if (telefone !== undefined) {
			fieldsToUpdate.push('telefone = ?');
			params.push(telefone);
		}
		if (especialidades !== undefined) {
			fieldsToUpdate.push('especialidades = ?');
			params.push(JSON.stringify(especialidades || []));
		}
		if (horario_entrada !== undefined) {
			fieldsToUpdate.push('horario_entrada = ?');
			params.push(horario_entrada);
		}
		if (horario_saida !== undefined) {
			fieldsToUpdate.push('horario_saida = ?');
			params.push(horario_saida);
		}
		if (dias_trabalho !== undefined) {
			fieldsToUpdate.push('dias_trabalho = ?');
			params.push(
				JSON.stringify(
					Array.isArray(dias_trabalho) ? dias_trabalho : []
				)
			);
		}

		if (fieldsToUpdate.length === 0) {
			return res
				.status(400)
				.json({ message: 'Nenhum campo fornecido para atualização.' });
		}

		fieldsToUpdate.push('updated_at = CURRENT_TIMESTAMP');
		params.push(id); // For WHERE clause

		await db.run(
			`UPDATE profissionais SET ${fieldsToUpdate.join(
				', '
			)} WHERE id = ?`,
			params
		);

		const profAtualizado = await db.get(
			'SELECT * FROM profissionais WHERE id = ?',
			[id]
		);
		// Converte JSON de volta para array
		profAtualizado.especialidades = JSON.parse(
			profAtualizado.especialidades
		);
		profAtualizado.dias_trabalho = JSON.parse(profAtualizado.dias_trabalho);

		res.status(200).json(profAtualizado);
	} catch (error) {
		console.error('Erro ao atualizar profissional:', error);
		res.status(500).json({
			message: 'Erro interno ao atualizar profissional.',
		});
	} finally {
		if (db) await db.close();
	}
});

/**
 * DELETE /api/profissionais/:id
 * Deleta um profissional.
 */
router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();
		const profissional = await db.get(
			'SELECT * FROM profissionais WHERE id = ? AND estabelecimento_id = ?',
			[id, estabelecimentoId]
		);
		if (!profissional) {
			return res.status(404).json({
				message:
					'Profissional não encontrado ou não pertence a este estabelecimento.',
			});
		}

		await db.run('DELETE FROM profissionais WHERE id = ?', [id]);
		res.status(200).json({ message: 'Profissional deletado com sucesso.' });
	} catch (error) {
		console.error('Erro ao deletar profissional:', error);
		// Check for foreign key constraint error (if appointments exist for this professional)
		if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
			return res
				.status(400)
				.json({
					message:
						'Não é possível deletar o profissional pois existem agendamentos vinculados a ele.',
				});
		}
		res.status(500).json({
			message: 'Erro interno ao deletar profissional.',
		});
	} finally {
		if (db) await db.close();
	}
});

export default router;
