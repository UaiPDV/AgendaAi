import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, isEstabelecimento } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();
router.use(authenticateToken);
router.use(isEstabelecimento);

/**
 * GET /api/contas-pagar
 * Lista todas as contas a pagar do estabelecimento
 */
router.get('/', async (req, res) => {
	const { status, data_inicio, data_fim } = req.query;
	let db;
	try {
		db = await openDb();
		const estabelecimentoId = req.user.id;

		let query = `SELECT * FROM contas_pagar WHERE estabelecimento_id = ?`;
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
		console.error('Erro ao listar contas a pagar:', error);
		res.status(500).json({ message: 'Erro ao listar contas a pagar' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * GET /api/contas-pagar/resumo
 * Resumo das contas a pagar (total pendente, vencidas, etc)
 */
router.get('/resumo', isEstabelecimento, async (req, res) => {
	let db;
	try {
		db = await openDb();
		const estabelecimentoId = req.user.id;
		const hoje = new Date().toISOString().split('T')[0];

		// Total pendente
		const totalPendente = await db.get(
			`SELECT SUM(valor) as total FROM contas_pagar 
             WHERE estabelecimento_id = ? AND status = 'pendente'`,
			[estabelecimentoId]
		);

		// Total vencido
		const totalVencido = await db.get(
			`SELECT SUM(valor) as total FROM contas_pagar 
             WHERE estabelecimento_id = ? AND status = 'pendente' AND data_vencimento < ?`,
			[estabelecimentoId, hoje]
		);

		// Total pago no mês
		const mesAtual = new Date().toISOString().slice(0, 7); // YYYY-MM
		const totalPagoMes = await db.get(
			`SELECT SUM(valor) as total FROM contas_pagar 
             WHERE estabelecimento_id = ? AND status = 'pago' 
             AND strftime('%Y-%m', data_pagamento) = ?`,
			[estabelecimentoId, mesAtual]
		);

		// Próximo vencimento
		const proximoVencimento = await db.get(
			`SELECT * FROM contas_pagar 
             WHERE estabelecimento_id = ? AND status = 'pendente' AND data_vencimento >= ?
             ORDER BY data_vencimento ASC LIMIT 1`,
			[estabelecimentoId, hoje]
		);

		res.status(200).json({
			totalPendente: totalPendente?.total || 0,
			totalVencido: totalVencido?.total || 0,
			totalPagoMes: totalPagoMes?.total || 0,
			proximoVencimento: proximoVencimento || null,
		});
	} catch (error) {
		console.error('Erro ao buscar resumo de contas a pagar:', error);
		res.status(500).json({
			message: 'Erro ao buscar resumo de contas a pagar',
		});
	} finally {
		if (db) await db.close();
	}
});

/**
 * POST /api/contas-pagar
 * Cria uma nova conta a pagar
 */
router.post('/', isEstabelecimento, async (req, res) => {
	const {
		descricao,
		valor,
		data_vencimento,
		categoria,
		fornecedor,
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
			`INSERT INTO contas_pagar 
            (id, estabelecimento_id, descricao, valor, data_vencimento, categoria, fornecedor, observacoes, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendente')`,
			[
				id,
				estabelecimentoId,
				descricao,
				parseFloat(valor),
				data_vencimento,
				categoria || null,
				fornecedor || null,
				observacoes || null,
			]
		);

		const conta = await db.get(`SELECT * FROM contas_pagar WHERE id = ?`, [
			id,
		]);

		res.status(201).json(conta);
	} catch (error) {
		console.error('Erro ao criar conta a pagar:', error);
		res.status(500).json({ message: 'Erro ao criar conta a pagar' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * PUT /api/contas-pagar/:id
 * Atualiza uma conta a pagar
 */
router.put('/:id', isEstabelecimento, async (req, res) => {
	const { id } = req.params;
	const {
		descricao,
		valor,
		data_vencimento,
		categoria,
		fornecedor,
		observacoes,
	} = req.body;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();

		const contaExistente = await db.get(
			`SELECT * FROM contas_pagar WHERE id = ? AND estabelecimento_id = ?`,
			[id, estabelecimentoId]
		);

		if (!contaExistente) {
			return res.status(404).json({ message: 'Conta não encontrada' });
		}

		await db.run(
			`UPDATE contas_pagar SET 
                descricao = ?, 
                valor = ?, 
                data_vencimento = ?, 
                categoria = ?, 
                fornecedor = ?, 
                observacoes = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND estabelecimento_id = ?`,
			[
				descricao || contaExistente.descricao,
				valor !== undefined ? parseFloat(valor) : contaExistente.valor,
				data_vencimento || contaExistente.data_vencimento,
				categoria !== undefined ? categoria : contaExistente.categoria,
				fornecedor !== undefined
					? fornecedor
					: contaExistente.fornecedor,
				observacoes !== undefined
					? observacoes
					: contaExistente.observacoes,
				id,
				estabelecimentoId,
			]
		);

		const conta = await db.get(`SELECT * FROM contas_pagar WHERE id = ?`, [
			id,
		]);

		res.status(200).json(conta);
	} catch (error) {
		console.error('Erro ao atualizar conta a pagar:', error);
		res.status(500).json({ message: 'Erro ao atualizar conta a pagar' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * PATCH /api/contas-pagar/:id/pagar
 * Marca uma conta como paga
 */
router.patch('/:id/pagar', isEstabelecimento, async (req, res) => {
	const { id } = req.params;
	const { data_pagamento } = req.body;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();

		const conta = await db.get(
			`SELECT * FROM contas_pagar WHERE id = ? AND estabelecimento_id = ?`,
			[id, estabelecimentoId]
		);

		if (!conta) {
			return res.status(404).json({ message: 'Conta não encontrada' });
		}

		if (conta.status === 'pago') {
			return res.status(400).json({ message: 'Conta já foi paga' });
		}

		const dataPgto =
			data_pagamento || new Date().toISOString().split('T')[0];

		await db.run(
			`UPDATE contas_pagar SET 
                status = 'pago', 
                data_pagamento = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND estabelecimento_id = ?`,
			[dataPgto, id, estabelecimentoId]
		);

		const contaAtualizada = await db.get(
			`SELECT * FROM contas_pagar WHERE id = ?`,
			[id]
		);

		res.status(200).json(contaAtualizada);
	} catch (error) {
		console.error('Erro ao marcar conta como paga:', error);
		res.status(500).json({ message: 'Erro ao marcar conta como paga' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * DELETE /api/contas-pagar/:id
 * Remove uma conta a pagar
 */
router.delete('/:id', isEstabelecimento, async (req, res) => {
	const { id } = req.params;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();

		const conta = await db.get(
			`SELECT * FROM contas_pagar WHERE id = ? AND estabelecimento_id = ?`,
			[id, estabelecimentoId]
		);

		if (!conta) {
			return res.status(404).json({ message: 'Conta não encontrada' });
		}

		await db.run(
			`DELETE FROM contas_pagar WHERE id = ? AND estabelecimento_id = ?`,
			[id, estabelecimentoId]
		);

		res.status(200).json({ message: 'Conta removida com sucesso' });
	} catch (error) {
		console.error('Erro ao remover conta a pagar:', error);
		res.status(500).json({ message: 'Erro ao remover conta a pagar' });
	} finally {
		if (db) await db.close();
	}
});

export default router;
