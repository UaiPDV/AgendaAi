import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

// Protege todas as rotas de agendamento
router.use(authenticateToken);

/**
 * GET /api/agendamentos
 * Lista agendamentos.
 * - Se for cliente, lista os seus.
 * - Se for estabelecimento, lista os do seu estabelecimento.
 */
router.get('/', async (req, res) => {
	const user = req.user;
	let db;
	try {
		db = await openDb();
		let query = 'SELECT * FROM agendamentos';
		const params = [];

		if (user.tipo === 'cliente') {
			query += ' WHERE usuario_id = ?';
			params.push(user.id);
		} else if (user.tipo === 'estabelecimento') {
			query += ' WHERE estabelecimento_id = ?';
			params.push(user.id);
		}

		// Adiciona ordenação
		query += ' ORDER BY data DESC, horario DESC';

		const agendamentos = await db.all(query, params);
		res.status(200).json(agendamentos);
	} catch (error) {
		console.error('Erro ao listar agendamentos:', error);
		res.status(500).json({
			message: 'Erro interno ao listar agendamentos.',
		});
	} finally {
		if (db) await db.close();
	}
});

/**
 * POST /api/agendamentos
 * Cria um novo agendamento.
 * Apenas clientes podem criar.
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
		data,
		horario,
		servicoNome, // O frontend manda esses dados desnormalizados
		profissionalNome,
		preco,
		estabelecimentoNome,
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
		// (Validação de horário disponível deveria ir aqui)

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
				'pendente', // Status inicial
				servicoNome,
				profissionalNome,
				preco,
				estabelecimentoNome,
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
 * Atualiza o status de um agendamento (confirmar, cancelar, concluir).
 */
router.patch('/:id', async (req, res) => {
	const { status } = req.body;
	const { id } = req.params;
	const user = req.user;

	if (!status || !['confirmado', 'cancelado', 'concluido'].includes(status)) {
		return res.status(400).json({ message: 'Status inválido.' });
	}

	let db;
	try {
		db = await openDb();
		let agendamento;

		// Verifica se o agendamento existe e pertence ao usuário/estabelecimento
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

		// Clientes só podem cancelar
		if (user.tipo === 'cliente' && status !== 'cancelado') {
			return res
				.status(403)
				.json({ message: 'Clientes só podem cancelar agendamentos.' });
		}

		// Atualiza o status
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
 * DELETE /api/agendamentos/:id
 * Deleta um agendamento (geralmente usado por clientes ao cancelar).
 */
router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	const user = req.user;

	let db;
	try {
		db = await openDb();
		let agendamento;

		// Verifica se o agendamento existe e pertence ao usuário/estabelecimento
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

		// Apenas agendamentos pendentes ou cancelados podem ser deletados
		// ou se o usuário for um estabelecimento (dono)
		if (
			user.tipo === 'cliente' &&
			!['pendente', 'cancelado'].includes(agendamento.status)
		) {
			return res
				.status(403)
				.json({
					message:
						'Você só pode deletar agendamentos pendentes ou cancelados. Para outros, use a opção de "cancelar".',
				});
		}

		await db.run('DELETE FROM agendamentos WHERE id = ?', [id]);
		res.status(200).json({ message: 'Agendamento deletado com sucesso.' });
	} catch (error) {
		console.error('Erro ao deletar agendamento:', error);
		res.status(500).json({
			message: 'Erro interno ao deletar agendamento.',
		});
	} finally {
		if (db) await db.close();
	}
});

export default router;
