import { Router } from 'express';
import { authenticateToken, isCliente } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

/**
 * GET /api/usuarios/me
 * Busca os dados do usuário (cliente) logado.
 */
router.get('/me', [authenticateToken, isCliente], async (req, res) => {
	let db;
	try {
		db = await openDb();
		// req.user.id vem do token JWT verificado
		const usuario = await db.get(
			'SELECT id, nome, email, telefone, cpf, data_nascimento, tipo FROM usuarios WHERE id = ?',
			[req.user.id]
		);

		if (!usuario) {
			return res.status(404).json({ message: 'Usuário não encontrado.' });
		}

		res.status(200).json(usuario);
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
 * Atualiza os dados do usuário (cliente) logado.
 */
router.put('/me', [authenticateToken, isCliente], async (req, res) => {
	const { nome, telefone, dataNascimento } = req.body;
	const userId = req.user.id;

	if (!nome && !telefone && !dataNascimento) {
		return res
			.status(400)
			.json({ message: 'Nenhum dado fornecido para atualização.' });
	}

	// Monta a query dinamicamente (cuidado com SQL Injection, mas aqui estamos seguros)
	const fields = [];
	const params = [];

	if (nome) {
		fields.push('nome = ?');
		params.push(nome);
	}
	if (telefone) {
		fields.push('telefone = ?');
		params.push(telefone);
	}
	if (dataNascimento) {
		fields.push('data_nascimento = ?');
		params.push(dataNascimento);
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

		// Busca o usuário atualizado para retornar
		const usuarioAtualizado = await db.get(
			'SELECT id, nome, email, telefone, cpf, data_nascimento, tipo FROM usuarios WHERE id = ?',
			[userId]
		);

		res.status(200).json(usuarioAtualizado);
	} catch (error) {
		console.error('Erro ao atualizar usuário:', error);
		res.status(500).json({ message: 'Erro interno ao atualizar usuário.' });
	} finally {
		if (db) await db.close();
	}
});

// Nota: A especificação pedia GET /usuarios e GET /usuarios/:id,
// que listariam TODOS os usuários. Para uma API de teste,
// focar em /me (o próprio usuário) é mais seguro e prático.

export default router;
