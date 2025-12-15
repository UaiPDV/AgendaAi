import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, isEstabelecimento } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();
router.use(authenticateToken);
router.use(isEstabelecimento);

/**
 * @openapi
 * /contas-receber:
 *   get:
 *     summary: Lista contas a receber
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
         
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
 *     responses:
 *       200:
 *         description: Lista de contas a receber
 *       401:
 *         description: Token ausente ou inválido
 * /contas-receber/resumo:
 *   get:
 *     summary: Resumo financeiro das contas a receber
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo calculado
 *       401:
 *         description: Token ausente ou inválido
 */

/**
 * GET /api/contas-receber
 * Lista todas as contas a receber do estabelecimento
 */
router.get('/', async (req, res) => {
	const { status, data_inicio, data_fim } = req.query;
	let db;
	try {
		db = await openDb();
		const estabelecimentoId = req.user.id;

		let query = `SELECT * FROM contas_receber WHERE estabelecimento_id = ?`;
		const params = [estabelecimentoId];

		if (status) {
			query += ` AND status = ?`;
			params.push(status);
		}

		if (data_inicio) {
			query += ` AND data_vencimento >= ?`;
			params.push(data_inicio);
		}

		if (data_fim) {
			query += ` AND data_vencimento <= ?`;
			params.push(data_fim);
		}

		query += ` ORDER BY data_vencimento ASC`;

		const contas = await db.all(query, params);

		res.status(200).json(contas);
	} catch (error) {
		console.error('Erro ao listar contas a receber:', error);
		res.status(500).json({ message: 'Erro ao listar contas a receber' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * GET /api/contas-receber/resumo
 * Resumo das contas a receber (total pendente, vencidas, etc)
 */
router.get('/resumo', isEstabelecimento, async (req, res) => {
	let db;
	try {
		db = await openDb();
		const estabelecimentoId = req.user.id;
		const hoje = new Date().toISOString().split('T')[0];

		// Total a receber
		const totalReceber = await db.get(
			`SELECT SUM(valor) as total FROM contas_receber 
             WHERE estabelecimento_id = ? AND status = 'pendente'`,
			[estabelecimentoId]
		);

		// Total vencido
		const totalVencido = await db.get(
			`SELECT SUM(valor) as total FROM contas_receber 
             WHERE estabelecimento_id = ? AND status = 'pendente' AND data_vencimento < ?`,
			[estabelecimentoId, hoje]
		);

		// Total recebido no mês
		const mesAtual = new Date().toISOString().slice(0, 7); // YYYY-MM
		const totalRecebidoMes = await db.get(
			`SELECT SUM(valor) as total FROM contas_receber 
             WHERE estabelecimento_id = ? AND status = 'recebido' 
             AND strftime('%Y-%m', data_recebimento) = ?`,
			[estabelecimentoId, mesAtual]
		);

		// Próximo recebimento
		const proximoRecebimento = await db.get(
			`SELECT * FROM contas_receber 
             WHERE estabelecimento_id = ? AND status = 'pendente' AND data_vencimento >= ?
             ORDER BY data_vencimento ASC LIMIT 1`,
			[estabelecimentoId, hoje]
		);

		res.status(200).json({
			totalReceber: totalReceber?.total || 0,
			totalVencido: totalVencido?.total || 0,
			totalRecebidoMes: totalRecebidoMes?.total || 0,
			proximoRecebimento: proximoRecebimento || null,
		});
	} catch (error) {
		console.error('Erro ao buscar resumo de contas a receber:', error);
		res.status(500).json({
			message: 'Erro ao buscar resumo de contas a receber',
		});
	} finally {
		if (db) await db.close();
	}
});

/**
 * POST /api/contas-receber
 * Cria uma nova conta a receber
 */
router.post('/', isEstabelecimento, async (req, res) => {
	const {
		descricao,
		valor,
		data_vencimento,
		categoria,
		cliente,
		observacoes,
	} = req.body;
	const estabelecimentoId = req.user.id;

	if (!descricao || !valor || !data_vencimento) {
		return res.status(400).json({
			message: 'Descrição, valor e data de vencimento são obrigatórios',
		});
	}

	let db;
	try {
		db = await openDb();
		const id = uuidv4();

		await db.run(
			`INSERT INTO contas_receber 
            (id, estabelecimento_id, descricao, valor, data_vencimento, categoria, cliente, observacoes, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendente')`,
			[
				id,
				estabelecimentoId,
				descricao,
				parseFloat(valor),
				data_vencimento,
				categoria || null,
				cliente || null,
				observacoes || null,
			]
		);

		const conta = await db.get(
			`SELECT * FROM contas_receber WHERE id = ?`,
			[id]
		);

		res.status(201).json(conta);
	} catch (error) {
		console.error('Erro ao criar conta a receber:', error);
		res.status(500).json({ message: 'Erro ao criar conta a receber' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * PUT /api/contas-receber/:id
 * Atualiza uma conta a receber
 */
router.put('/:id', isEstabelecimento, async (req, res) => {
	const { id } = req.params;
	const {
		descricao,
		valor,
		data_vencimento,
		categoria,
		cliente,
		observacoes,
	} = req.body;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();

		const contaExistente = await db.get(
			`SELECT * FROM contas_receber WHERE id = ? AND estabelecimento_id = ?`,
			[id, estabelecimentoId]
		);

		if (!contaExistente) {
			return res.status(404).json({ message: 'Conta não encontrada' });
		}

		await db.run(
			`UPDATE contas_receber SET 
                descricao = ?, 
                valor = ?, 
                data_vencimento = ?, 
                categoria = ?, 
                cliente = ?, 
                observacoes = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND estabelecimento_id = ?`,
			[
				descricao || contaExistente.descricao,
				valor !== undefined ? parseFloat(valor) : contaExistente.valor,
				data_vencimento || contaExistente.data_vencimento,
				categoria !== undefined ? categoria : contaExistente.categoria,
				cliente !== undefined ? cliente : contaExistente.cliente,
				observacoes !== undefined
					? observacoes
					: contaExistente.observacoes,
				id,
				estabelecimentoId,
			]
		);

		const conta = await db.get(
			`SELECT * FROM contas_receber WHERE id = ?`,
			[id]
		);

		res.status(200).json(conta);
	} catch (error) {
		console.error('Erro ao atualizar conta a receber:', error);
		res.status(500).json({ message: 'Erro ao atualizar conta a receber' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * PATCH /api/contas-receber/:id/receber
 * Marca uma conta como recebida
 */
router.patch('/:id/receber', isEstabelecimento, async (req, res) => {
	const { id } = req.params;
	const { data_recebimento } = req.body;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();

		const conta = await db.get(
			`SELECT * FROM contas_receber WHERE id = ? AND estabelecimento_id = ?`,
			[id, estabelecimentoId]
		);

		if (!conta) {
			return res.status(404).json({ message: 'Conta não encontrada' });
		}

		if (conta.status === 'recebido') {
			return res.status(400).json({ message: 'Conta já foi recebida' });
		}

		const dataReceb =
			data_recebimento || new Date().toISOString().split('T')[0];

		await db.run(
			`UPDATE contas_receber SET 
                status = 'recebido', 
                data_recebimento = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND estabelecimento_id = ?`,
			[dataReceb, id, estabelecimentoId]
		);

		const contaAtualizada = await db.get(
			`SELECT * FROM contas_receber WHERE id = ?`,
			[id]
		);

		res.status(200).json(contaAtualizada);
	} catch (error) {
		console.error('Erro ao marcar conta como recebida:', error);
		res.status(500).json({
			message: 'Erro ao marcar conta como recebida',
		});
	} finally {
		if (db) await db.close();
	}
});

/**
 * DELETE /api/contas-receber/:id
 * Remove uma conta a receber
 */
router.delete('/:id', isEstabelecimento, async (req, res) => {
	const { id } = req.params;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();

		const conta = await db.get(
			`SELECT * FROM contas_receber WHERE id = ? AND estabelecimento_id = ?`,
			[id, estabelecimentoId]
		);

		if (!conta) {
			return res.status(404).json({ message: 'Conta não encontrada' });
		}

		await db.run(
			`DELETE FROM contas_receber WHERE id = ? AND estabelecimento_id = ?`,
			[id, estabelecimentoId]
		);

		res.status(200).json({ message: 'Conta removida com sucesso' });
	} catch (error) {
		console.error('Erro ao remover conta a receber:', error);
		res.status(500).json({ message: 'Erro ao remover conta a receber' });
	} finally {
		if (db) await db.close();
	}
});

export default router;
