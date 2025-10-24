import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, isEstabelecimento } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

// Protege todas as rotas de profissionais (CUD)
router.use(authenticateToken);
router.use(isEstabelecimento);

/**
 * POST /api/profissionais
 * Cria um novo profissional para o estabelecimento logado.
 */
router.post('/', async (req, res) => {
	const { nome, telefone, especialidades } = req.body;
	const estabelecimentoId = req.user.id;

	if (!nome) {
		return res.status(400).json({ message: 'Nome é obrigatório.' });
	}

	// Converte array de especialidades em string JSON para salvar no SQLite
	const especialidadesJSON = JSON.stringify(especialidades || []);
	const profissionalId = uuidv4();

	let db;
	try {
		db = await openDb();
		await db.run(
			'INSERT INTO profissionais (id, estabelecimento_id, nome, telefone, especialidades) VALUES (?, ?, ?, ?, ?)',
			[
				profissionalId,
				estabelecimentoId,
				nome,
				telefone,
				especialidadesJSON,
			]
		);

		const novoProfissional = await db.get(
			'SELECT * FROM profissionais WHERE id = ?',
			[profissionalId]
		);
		// Converte de volta para array
		novoProfissional.especialidades = JSON.parse(
			novoProfissional.especialidades
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
	const { nome, telefone, especialidades } = req.body;
	const { id } = req.params;
	const estabelecimentoId = req.user.id;

	const especialidadesJSON = JSON.stringify(especialidades || []);

	let db;
	try {
		db = await openDb();
		const profissional = await db.get(
			'SELECT * FROM profissionais WHERE id = ? AND estabelecimento_id = ?',
			[id, estabelecimentoId]
		);
		if (!profissional) {
			return res
				.status(404)
				.json({
					message:
						'Profissional não encontrado ou não pertence a este estabelecimento.',
				});
		}

		await db.run(
			'UPDATE profissionais SET nome = ?, telefone = ?, especialidades = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
			[nome, telefone, especialidadesJSON, id]
		);

		const profAtualizado = await db.get(
			'SELECT * FROM profissionais WHERE id = ?',
			[id]
		);
		profAtualizado.especialidades = JSON.parse(
			profAtualizado.especialidades
		);

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
			return res
				.status(404)
				.json({
					message:
						'Profissional não encontrado ou não pertence a este estabelecimento.',
				});
		}

		await db.run('DELETE FROM profissionais WHERE id = ?', [id]);
		res.status(200).json({ message: 'Profissional deletado com sucesso.' });
	} catch (error) {
		console.error('Erro ao deletar profissional:', error);
		res.status(500).json({
			message: 'Erro interno ao deletar profissional.',
		});
	} finally {
		if (db) await db.close();
	}
});

export default router;
