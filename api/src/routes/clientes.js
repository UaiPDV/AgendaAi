/**
 * Rotas de Clientes
 *
 * Endpoints para gerenciar os clientes de um estabelecimento.
 */

import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

/**
 * GET /api/clientes/:id
 * Busca um cliente específico por ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
	let db;
	try {
		const { id } = req.params;

		db = await openDb();
		const cliente = await db.get(
			`SELECT * FROM clientes WHERE id = ?`,
			[id]
		);

		if (!cliente) {
			return res.status(404).json({ message: 'Cliente não encontrado' });
		}

		res.json(cliente);
	} catch (error) {
		console.error('Erro ao buscar cliente:', error);
		res.status(500).json({ message: 'Erro ao buscar cliente' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * PUT /api/clientes/:id
 * Atualiza um cliente existente
 */
router.put('/:id', authenticateToken, async (req, res) => {
	let db;
	try {
		const { id } = req.params;
		const { nome, email, telefone } = req.body;

		// Validação
		if (!nome?.trim()) {
			return res.status(400).json({ message: 'Nome é obrigatório' });
		}

		db = await openDb();

		// Verifica se o cliente existe
		const clienteExiste = await db.get(
			`SELECT id FROM clientes WHERE id = ?`,
			[id]
		);

		if (!clienteExiste) {
			return res.status(404).json({ message: 'Cliente não encontrado' });
		}

		// Atualiza o cliente
		await db.run(
			`UPDATE clientes 
			 SET nome = ?, email = ?, telefone = ?, updated_at = CURRENT_TIMESTAMP
			 WHERE id = ?`,
			[nome.trim(), email || null, telefone || null, id]
		);

		// Retorna o cliente atualizado
		const clienteAtualizado = await db.get(
			`SELECT * FROM clientes WHERE id = ?`,
			[id]
		);

		res.json(clienteAtualizado);
	} catch (error) {
		console.error('Erro ao atualizar cliente:', error);
		res.status(500).json({ message: 'Erro ao atualizar cliente' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * DELETE /api/clientes/:id
 * Remove um cliente
 */
router.delete('/:id', authenticateToken, async (req, res) => {
	let db;
	try {
		const { id } = req.params;

		db = await openDb();

		// Verifica se o cliente existe
		const clienteExiste = await db.get(
			`SELECT id FROM clientes WHERE id = ?`,
			[id]
		);

		if (!clienteExiste) {
			return res.status(404).json({ message: 'Cliente não encontrado' });
		}

		// Remove o cliente
		await db.run(`DELETE FROM clientes WHERE id = ?`, [id]);

		res.json({ message: 'Cliente removido com sucesso' });
	} catch (error) {
		console.error('Erro ao remover cliente:', error);
		res.status(500).json({ message: 'Erro ao remover cliente' });
	} finally {
		if (db) await db.close();
	}
});

export default router;
