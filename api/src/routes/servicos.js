import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, isEstabelecimento } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

// Protege todas as rotas de serviços (CUD)
router.use(authenticateToken);
router.use(isEstabelecimento);

/**
 * POST /api/servicos
 * Cria um novo serviço para o estabelecimento logado.
 */
router.post('/', async (req, res) => {
	const { nome, descricao, preco, duracao } = req.body;
	const estabelecimentoId = req.user.id; // ID do estabelecimento logado

	if (!nome || !preco || !duracao) {
		return res
			.status(400)
			.json({ message: 'Nome, preço e duração são obrigatórios.' });
	}

	const servicoId = uuidv4();
	let db;
	try {
		db = await openDb();
		await db.run(
			'INSERT INTO servicos (id, estabelecimento_id, nome, descricao, preco, duracao) VALUES (?, ?, ?, ?, ?, ?)',
			[servicoId, estabelecimentoId, nome, descricao, preco, duracao]
		);

		const novoServico = await db.get(
			'SELECT * FROM servicos WHERE id = ?',
			[servicoId]
		);
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
	const { nome, descricao, preco, duracao } = req.body;
	const { id } = req.params;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();
		// Verifica se o serviço pertence ao estabelecimento logado
		const servico = await db.get(
			'SELECT * FROM servicos WHERE id = ? AND estabelecimento_id = ?',
			[id, estabelecimentoId]
		);
		if (!servico) {
			return res
				.status(404)
				.json({
					message:
						'Serviço não encontrado ou não pertence a este estabelecimento.',
				});
		}

		// Atualiza
		await db.run(
			'UPDATE servicos SET nome = ?, descricao = ?, preco = ?, duracao = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
			[nome, descricao, preco, duracao, id]
		);

		const servicoAtualizado = await db.get(
			'SELECT * FROM servicos WHERE id = ?',
			[id]
		);
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
		// Verifica se o serviço pertence ao estabelecimento logado
		const servico = await db.get(
			'SELECT * FROM servicos WHERE id = ? AND estabelecimento_id = ?',
			[id, estabelecimentoId]
		);
		if (!servico) {
			return res
				.status(404)
				.json({
					message:
						'Serviço não encontrado ou não pertence a este estabelecimento.',
				});
		}

		await db.run('DELETE FROM servicos WHERE id = ?', [id]);
		res.status(200).json({ message: 'Serviço deletado com sucesso.' });
	} catch (error) {
		console.error('Erro ao deletar serviço:', error);
		res.status(500).json({ message: 'Erro interno ao deletar serviço.' });
	} finally {
		if (db) await db.close();
	}
});

export default router;
