import { Router } from 'express';
import { authenticateToken, isCliente } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

// Apenas clientes autenticados podem criar avaliações
router.use(authenticateToken);
router.use(isCliente);

/**
 * POST /api/avaliacoes
 * Cria uma nova avaliação para um agendamento concluído.
 */
router.post('/', async (req, res) => {
	const { agendamento_id, nota, comentario } = req.body;
	const usuarioId = req.user.id;

	if (!agendamento_id || !nota) {
		return res
			.status(400)
			.json({ message: 'Agendamento ID e nota são obrigatórios.' });
	}

	if (nota < 1 || nota > 5) {
		return res.status(400).json({ message: 'Nota deve ser entre 1 e 5.' });
	}

	let db;
	try {
		db = await openDb();

		// 1. Verifica se o agendamento existe, pertence ao usuário e está concluído
		const agendamento = await db.get(
			'SELECT id, estabelecimento_id, profissional_id, status FROM agendamentos WHERE id = ? AND usuario_id = ?',
			[agendamento_id, usuarioId]
		);

		if (!agendamento) {
			return res
				.status(404)
				.json({
					message:
						'Agendamento não encontrado ou não pertence a você.',
				});
		}
		if (agendamento.status !== 'concluido') {
			return res
				.status(403)
				.json({
					message: 'Só é possível avaliar agendamentos concluídos.',
				});
		}

		// 2. Tenta inserir a avaliação (UNIQUE constraint no agendamento_id impede duplicatas)
		const result = await db.run(
			`INSERT INTO avaliacoes (agendamento_id, usuario_id, estabelecimento_id, profissional_id, nota, comentario)
             VALUES (?, ?, ?, ?, ?, ?)`,
			[
				agendamento_id,
				usuarioId,
				agendamento.estabelecimento_id,
				agendamento.profissional_id, // Inclui o profissional
				nota,
				comentario || null,
			]
		);

		// 3. Opcional: Atualizar a média e total na tabela estabelecimentos (melhor fazer via trigger ou cálculo na leitura)
		// Por simplicidade, não faremos aqui. A leitura GET /estabelecimentos/:id calculará a média.

		const novaAvaliacao = await db.get(
			`
            SELECT av.*, u.nome as usuario_nome
            FROM avaliacoes av
            JOIN usuarios u ON av.usuario_id = u.id
            WHERE av.id = ?
        `,
			[result.lastID]
		);

		res.status(201).json(novaAvaliacao);
	} catch (error) {
		console.error('Erro ao criar avaliação:', error);
		// Verifica erro de chave única (avaliação já existe)
		if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			return res
				.status(409)
				.json({ message: 'Este agendamento já foi avaliado.' });
		}
		res.status(500).json({ message: 'Erro interno ao criar avaliação.' });
	} finally {
		if (db) await db.close();
	}
});

// Outras rotas (GET /api/avaliacoes/me, PUT /:id, DELETE /:id) podem ser adicionadas se necessário

export default router;
