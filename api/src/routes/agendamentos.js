import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middlewares/auth.js';
import { openDb } from '../database.js';
import { verificarDisponibilidadeSimples } from '../utils/availabilityHelper.js'; // Helper simplificado

const router = Router();
router.use(authenticateToken);

/**
 * @openapi
 * /api/agendamentos:
 *   get:
 *     tags: [Cliente - Agendamentos, Estabelecimento - Agendamentos]
 *     summary: Lista agendamentos do usuário logado (filtros para estabelecimento)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: data_inicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: data_fim
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: profissional_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *   post:
 *     tags: [Cliente - Agendamentos]
 *     summary: Cria um agendamento (cliente)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [estabelecimentoId, servicoId, profissionalId, data, horario]
 *             properties:
 *               estabelecimentoId:
 *                 type: string
 *               servicoId:
 *                 type: string
 *               profissionalId:
 *                 type: string
 *               data:
 *                 type: string
 *                 format: date
 *               horario:
 *                 type: string
 *                 example: '14:00'
 *     responses:
 *       201:
 *         description: Agendamento criado
 *       409:
 *         description: Horário indisponível
 * /api/agendamentos/{id}:
 *   patch:
 *     tags: [Estabelecimento - Agendamentos, Cliente - Agendamentos]
 *     summary: Atualiza status do agendamento
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmado, cancelado, concluido, nao_compareceu]
 *     responses:
 *       200:
 *         description: Status atualizado
 * /api/agendamentos/{id}/reagendar:
 *   put:
 *     tags: [Cliente - Agendamentos, Estabelecimento - Agendamentos]
 *     summary: Reagenda um agendamento
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
 *             required: [data, horario]
 *             properties:
 *               data:
 *                 type: string
 *                 format: date
 *               horario:
 *                 type: string
 *               profissionalId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agendamento reagendado
 *       409:
 *         description: Novo horário indisponível
 *   delete:
 *     tags: [Cliente - Agendamentos, Estabelecimento - Agendamentos]
 *     summary: Exclui um agendamento
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
 *         description: Agendamento removido
 */

/**
 * GET /api/agendamentos
 * Lista agendamentos com filtros opcionais para estabelecimentos.
 * Query Params (para estabelecimentos): ?data_inicio=YYYY-MM-DD&data_fim=YYYY-MM-DD&status=...&profissional_id=...&page=1&limit=10
 */
router.get('/', async (req, res) => {
	const user = req.user;
	const {
		data_inicio,
		data_fim,
		status,
		profissional_id,
		page = 1,
		limit = 10,
	} = req.query; // Filtros e Paginação
	let db;
	try {
		db = await openDb();
		let query = `
            SELECT a.*, u.nome as usuario_nome, p.nome as profissional_nome_real, s.nome as servico_nome_real
            FROM agendamentos a
            LEFT JOIN usuarios u ON a.usuario_id = u.id
            LEFT JOIN profissionais p ON a.profissional_id = p.id
            LEFT JOIN servicos s ON a.servico_id = s.id
        `;
		const params = [];
		const whereClauses = [];

		if (user.tipo === 'cliente') {
			whereClauses.push('a.usuario_id = ?');
			params.push(user.id);
		} else if (user.tipo === 'estabelecimento') {
			whereClauses.push('a.estabelecimento_id = ?');
			params.push(user.id);

			// Aplicar filtros para estabelecimento
			if (data_inicio) {
				whereClauses.push('a.data >= ?');
				params.push(data_inicio);
			}
			if (data_fim) {
				whereClauses.push('a.data <= ?');
				params.push(data_fim);
			}
			if (status) {
				// Permitir múltiplos status separados por vírgula? Ex: status=concluido,cancelado
				const statusList = status
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
				if (statusList.length > 0) {
					whereClauses.push(
						`a.status IN (${statusList.map(() => '?').join(',')})`
					);
					params.push(...statusList);
				}
			}
			if (profissional_id) {
				whereClauses.push('a.profissional_id = ?');
				params.push(profissional_id);
			}
		}

		if (whereClauses.length > 0) {
			query += ` WHERE ${whereClauses.join(' AND ')}`;
		}

		query += ' ORDER BY a.data DESC, a.horario DESC';

		// Aplicar paginação (apenas para estabelecimentos, para simplificar)
		let totalCount = 0;
		if (user.tipo === 'estabelecimento') {
			const countResult = await db.get(
				`SELECT COUNT(a.id) as count FROM agendamentos a ${
					whereClauses.length > 0
						? `WHERE ${whereClauses.join(' AND ')}`
						: ''
				}`,
				params
			);
			totalCount = countResult?.count || 0;

			const offset =
				(Math.max(1, parseInt(page)) - 1) *
				Math.max(1, parseInt(limit));
			query += ' LIMIT ? OFFSET ?';
			params.push(Math.max(1, parseInt(limit)), offset);
		}

		const agendamentos = await db.all(query, params);

		if (user.tipo === 'estabelecimento') {
			res.status(200).json({
				agendamentos,
				pagination: {
					currentPage: parseInt(page),
					limit: parseInt(limit),
					totalItems: totalCount,
					totalPages: Math.ceil(totalCount / parseInt(limit)),
				},
			});
		} else {
			res.status(200).json(agendamentos); // Clientes recebem lista simples
		}
	} catch (error) {
		console.error('Erro ao listar agendamentos:', error);
		res.status(500).json({
			message: 'Erro interno ao listar agendamentos.',
		});
	} finally {
		if (db) await db.close();
	}
});

// --- Rotas POST, PATCH, PUT /reagendar, DELETE permanecem as mesmas da versão anterior ---
// (O código abaixo é igual ao anterior, apenas para manter o arquivo completo)

/**
 * POST /api/agendamentos
 * Cria um novo agendamento. (Apenas clientes)
 */
router.post('/', async (req, res) => {
	if (req.user.tipo !== 'cliente') {
		return res
			.status(403)
			.json({ message: 'Apenas clientes podem criar agendamentos.' });
	}

	const {
		estabelecimentoId,
		servicoId,
		profissionalId,
		data, // YYYY-MM-DD
		horario, // HH:MM
	} = req.body;

	const usuarioId = req.user.id;
	const agendamentoId = uuidv4();

	if (
		!estabelecimentoId ||
		!servicoId ||
		!profissionalId ||
		!data ||
		!horario
	) {
		return res
			.status(400)
			.json({ message: 'Campos obrigatórios ausentes.' });
	}

	let db;
	try {
		db = await openDb();

		// Validação de disponibilidade (SIMPLIFICADA)
		const disponivel = await verificarDisponibilidadeSimples(
			db,
			data,
			horario,
			profissionalId,
			null
		);
		if (!disponivel) {
			return res.status(409).json({ message: 'Horário indisponível.' }); // 409 Conflict
		}

		const servico = await db.get(
			'SELECT nome, preco FROM servicos WHERE id = ?',
			[servicoId]
		);
		const profissional = await db.get(
			'SELECT nome FROM profissionais WHERE id = ?',
			[profissionalId]
		);
		const estabelecimento = await db.get(
			'SELECT nome FROM estabelecimentos WHERE id = ?',
			[estabelecimentoId]
		);

		if (!servico || !profissional || !estabelecimento) {
			return res
				.status(404)
				.json({
					message:
						'Serviço, profissional ou estabelecimento não encontrado.',
				});
		}

		await db.run(
			`INSERT INTO agendamentos (
        id, usuario_id, estabelecimento_id, servico_id, profissional_id,
        data, horario, status, servico_nome, profissional_nome, preco, estabelecimento_nome
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				agendamentoId,
				usuarioId,
				estabelecimentoId,
				servicoId,
				profissionalId,
				data,
				horario,
				'pendente',
				servico.nome,
				profissional.nome,
				servico.preco,
				estabelecimento.nome,
			]
		);

		const novoAgendamento = await db.get(
			'SELECT * FROM agendamentos WHERE id = ?',
			[agendamentoId]
		);
		res.status(201).json(novoAgendamento);
	} catch (error) {
		console.error('Erro ao criar agendamento:', error);
		res.status(500).json({ message: 'Erro interno ao criar agendamento.' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * PATCH /api/agendamentos/:id
 * Atualiza o status de um agendamento.
 */
router.patch('/:id', async (req, res) => {
	const { status } = req.body;
	const { id } = req.params;
	const user = req.user;

	const validStatus = [
		'confirmado',
		'cancelado',
		'concluido',
		'nao_compareceu',
	];
	if (!status || !validStatus.includes(status)) {
		return res
			.status(400)
			.json({
				message: `Status inválido. Válidos: ${validStatus.join(', ')}.`,
			});
	}

	let db;
	try {
		db = await openDb();
		let agendamento;

		if (user.tipo === 'cliente') {
			agendamento = await db.get(
				'SELECT * FROM agendamentos WHERE id = ? AND usuario_id = ?',
				[id, user.id]
			);
		} else {
			// Estabelecimento
			agendamento = await db.get(
				'SELECT * FROM agendamentos WHERE id = ? AND estabelecimento_id = ?',
				[id, user.id]
			);
		}

		if (!agendamento) {
			return res
				.status(404)
				.json({
					message: 'Agendamento não encontrado ou não autorizado.',
				});
		}

		if (user.tipo === 'cliente' && status !== 'cancelado') {
			return res
				.status(403)
				.json({ message: 'Clientes só podem cancelar agendamentos.' });
		}

		await db.run(
			'UPDATE agendamentos SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
			[status, id]
		);

		const agendamentoAtualizado = await db.get(
			'SELECT * FROM agendamentos WHERE id = ?',
			[id]
		);
		res.status(200).json(agendamentoAtualizado);
	} catch (error) {
		console.error('Erro ao atualizar status do agendamento:', error);
		res.status(500).json({
			message: 'Erro interno ao atualizar agendamento.',
		});
	} finally {
		if (db) await db.close();
	}
});

/**
 * PUT /api/agendamentos/:id/reagendar
 * Reagenda um agendamento existente.
 */
router.put('/:id/reagendar', async (req, res) => {
	const { data, horario, profissionalId } = req.body;
	const { id } = req.params;
	const user = req.user;

	if (!data || !horario) {
		return res
			.status(400)
			.json({ message: 'Nova data e horário são obrigatórios.' });
	}

	let db;
	try {
		db = await openDb();
		let agendamento;

		if (user.tipo === 'cliente') {
			agendamento = await db.get(
				'SELECT * FROM agendamentos WHERE id = ? AND usuario_id = ?',
				[id, user.id]
			);
		} else {
			// Estabelecimento
			agendamento = await db.get(
				'SELECT * FROM agendamentos WHERE id = ? AND estabelecimento_id = ?',
				[id, user.id]
			);
		}

		if (!agendamento) {
			return res
				.status(404)
				.json({
					message: 'Agendamento não encontrado ou não autorizado.',
				});
		}

		if (['concluido', 'cancelado'].includes(agendamento.status)) {
			return res
				.status(403)
				.json({
					message: `Não é possível reagendar um agendamento ${agendamento.status}.`,
				});
		}

		const profIdParaVerificar =
			profissionalId || agendamento.profissional_id;

		const disponivel = await verificarDisponibilidadeSimples(
			db,
			data,
			horario,
			profIdParaVerificar,
			id
		);
		if (!disponivel) {
			return res
				.status(409)
				.json({ message: 'Novo horário indisponível.' });
		}

		const fieldsToUpdate = ['data = ?', 'horario = ?'];
		const params = [data, horario];

		if (profissionalId && profissionalId !== agendamento.profissional_id) {
			const novoProfissional = await db.get(
				'SELECT nome FROM profissionais WHERE id = ? AND estabelecimento_id = ?',
				[profissionalId, agendamento.estabelecimento_id]
			);
			if (!novoProfissional) {
				return res
					.status(404)
					.json({
						message:
							'Novo profissional não encontrado neste estabelecimento.',
					});
			}
			fieldsToUpdate.push('profissional_id = ?');
			params.push(profissionalId);
			fieldsToUpdate.push('profissional_nome = ?');
			params.push(novoProfissional.nome);
		}

		fieldsToUpdate.push('updated_at = CURRENT_TIMESTAMP');
		params.push(id);

		await db.run(
			`UPDATE agendamentos SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
			params
		);

		const agendamentoReagendado = await db.get(
			'SELECT * FROM agendamentos WHERE id = ?',
			[id]
		);
		res.status(200).json(agendamentoReagendado);
	} catch (error) {
		console.error('Erro ao reagendar:', error);
		res.status(500).json({ message: 'Erro interno ao reagendar.' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * DELETE /api/agendamentos/:id
 * Deleta um agendamento.
 */
router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	const user = req.user;

	let db;
	try {
		db = await openDb();
		let agendamento;

		if (user.tipo === 'cliente') {
			agendamento = await db.get(
				'SELECT * FROM agendamentos WHERE id = ? AND usuario_id = ?',
				[id, user.id]
			);
		} else {
			agendamento = await db.get(
				'SELECT * FROM agendamentos WHERE id = ? AND estabelecimento_id = ?',
				[id, user.id]
			);
		}

		if (!agendamento) {
			return res
				.status(404)
				.json({
					message: 'Agendamento não encontrado ou não autorizado.',
				});
		}

		await db.run('DELETE FROM agendamentos WHERE id = ?', [id]);
		res.status(200).json({ message: 'Agendamento deletado com sucesso.' });
	} catch (error) {
		console.error('Erro ao deletar agendamento:', error);
		if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
			return res
				.status(400)
				.json({
					message:
						'Não é possível deletar o agendamento pois existe uma avaliação vinculada a ele.',
				});
		}
		res.status(500).json({
			message: 'Erro interno ao deletar agendamento.',
		});
	} finally {
		if (db) await db.close();
	}
});

export default router;
