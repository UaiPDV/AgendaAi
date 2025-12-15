import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, isEstabelecimento } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();
router.use(authenticateToken);
router.use(isEstabelecimento);

/**
 * @openapi
 * /produtos:
 *   get:
 *     summary: Lista produtos do estabelecimento logado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos
 *       401:
 *         description: Token ausente ou inválido
 *   post:
 *     summary: Cria um produto
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
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               categoria:
 *                 type: string
 *               estoque:
 *                 type: integer
 *               ativo:
 *                 type: boolean
 *             required: [nome, preco]
 *     responses:
 *       201:
 *         description: Produto criado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 * /produtos/{id}:
 *   get:
 *     summary: Busca um produto por ID
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
 *         description: Produto retornado
 *       404:
 *         description: Produto não encontrado
 */

/**
 * GET /api/produtos
 * Lista todos os produtos do estabelecimento logado
 */
router.get('/', async (req, res) => {
	let db;
	try {
		db = await openDb();
		const estabelecimentoId = req.user.id;

		const produtos = await db.all(
			`SELECT * FROM produtos WHERE estabelecimento_id = ? ORDER BY nome ASC`,
			[estabelecimentoId]
		);

		res.status(200).json(produtos);
	} catch (error) {
		console.error('Erro ao listar produtos:', error);
		res.status(500).json({ message: 'Erro ao listar produtos' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * GET /api/produtos/:id
 * Busca um produto específico
 */
router.get('/:id', isEstabelecimento, async (req, res) => {
	const { id } = req.params;
	let db;
	try {
		db = await openDb();
		const estabelecimentoId = req.user.id;

		const produto = await db.get(
			`SELECT * FROM produtos WHERE id = ? AND estabelecimento_id = ?`,
			[id, estabelecimentoId]
		);

		if (!produto) {
			return res.status(404).json({ message: 'Produto não encontrado' });
		}

		res.status(200).json(produto);
	} catch (error) {
		console.error('Erro ao buscar produto:', error);
		res.status(500).json({ message: 'Erro ao buscar produto' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * POST /api/produtos
 * Cria um novo produto
 */
router.post('/', isEstabelecimento, async (req, res) => {
	const {
		nome,
		descricao,
		preco,
		categoria,
		estoque,
		ativo = true,
	} = req.body;
	const estabelecimentoId = req.user.id;

	if (!nome || !preco) {
		return res
			.status(400)
			.json({ message: 'Nome e preço são obrigatórios' });
	}

	let db;
	try {
		db = await openDb();
		const id = uuidv4();

		await db.run(
			`INSERT INTO produtos (id, estabelecimento_id, nome, descricao, preco, categoria, estoque, ativo)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				id,
				estabelecimentoId,
				nome,
				descricao || null,
				parseFloat(preco),
				categoria || null,
				estoque || 0,
				ativo ? 1 : 0,
			]
		);

		const produto = await db.get(`SELECT * FROM produtos WHERE id = ?`, [
			id,
		]);

		res.status(201).json(produto);
	} catch (error) {
		console.error('Erro ao criar produto:', error);
		res.status(500).json({ message: 'Erro ao criar produto' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * PUT /api/produtos/:id
 * Atualiza um produto
 */
router.put('/:id', isEstabelecimento, async (req, res) => {
	const { id } = req.params;
	const { nome, descricao, preco, categoria, estoque, ativo } = req.body;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();

		// Verifica se o produto existe e pertence ao estabelecimento
		const produtoExistente = await db.get(
			`SELECT * FROM produtos WHERE id = ? AND estabelecimento_id = ?`,
			[id, estabelecimentoId]
		);

		if (!produtoExistente) {
			return res.status(404).json({ message: 'Produto não encontrado' });
		}

		await db.run(
			`UPDATE produtos SET 
                nome = ?, 
                descricao = ?, 
                preco = ?, 
                categoria = ?, 
                estoque = ?, 
                ativo = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND estabelecimento_id = ?`,
			[
				nome || produtoExistente.nome,
				descricao !== undefined
					? descricao
					: produtoExistente.descricao,
				preco !== undefined
					? parseFloat(preco)
					: produtoExistente.preco,
				categoria !== undefined
					? categoria
					: produtoExistente.categoria,
				estoque !== undefined ? estoque : produtoExistente.estoque,
				ativo !== undefined ? (ativo ? 1 : 0) : produtoExistente.ativo,
				id,
				estabelecimentoId,
			]
		);

		const produto = await db.get(`SELECT * FROM produtos WHERE id = ?`, [
			id,
		]);

		res.status(200).json(produto);
	} catch (error) {
		console.error('Erro ao atualizar produto:', error);
		res.status(500).json({ message: 'Erro ao atualizar produto' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * DELETE /api/produtos/:id
 * Remove um produto
 */
router.delete('/:id', isEstabelecimento, async (req, res) => {
	const { id } = req.params;
	const estabelecimentoId = req.user.id;

	let db;
	try {
		db = await openDb();

		const produto = await db.get(
			`SELECT * FROM produtos WHERE id = ? AND estabelecimento_id = ?`,
			[id, estabelecimentoId]
		);

		if (!produto) {
			return res.status(404).json({ message: 'Produto não encontrado' });
		}

		await db.run(
			`DELETE FROM produtos WHERE id = ? AND estabelecimento_id = ?`,
			[id, estabelecimentoId]
		);

		res.status(200).json({ message: 'Produto removido com sucesso' });
	} catch (error) {
		console.error('Erro ao remover produto:', error);
		res.status(500).json({ message: 'Erro ao remover produto' });
	} finally {
		if (db) await db.close();
	}
});

export default router;
