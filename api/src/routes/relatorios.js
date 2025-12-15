import { Router } from 'express';
import { authenticateToken, isEstabelecimento } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

router.use(authenticateToken);
router.use(isEstabelecimento);

/**
 * @openapi
 * /api/relatorios/servicos-mais-agendados:
 *   get:
 *     tags: [Estabelecimento - Relatorios]
 *     summary: Retorna top serviços mais agendados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de serviços
 * /api/relatorios/desempenho-profissionais:
 *   get:
 *     tags: [Estabelecimento - Relatorios]
 *     summary: Retorna desempenho por profissional
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de desempenho
 * /api/relatorios/taxa-cancelamento:
 *   get:
 *     tags: [Estabelecimento - Relatorios]
 *     summary: Retorna taxa de cancelamento
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Taxa calculada
 */

/**
 * GET /api/relatorios/servicos-mais-agendados
 * Retorna contagem de agendamentos concluídos por serviço.
 * (Implementação SIMPLIFICADA)
 */
router.get('/servicos-mais-agendados', async (req, res) => {
	const estabelecimentoId = req.user.id;
	let db;
	try {
		db = await openDb();
		const servicos = await db.all(
			`
            SELECT servico_nome, COUNT(id) as count
            FROM agendamentos
            WHERE estabelecimento_id = ? AND status = 'concluido'
            GROUP BY servico_nome
            ORDER BY count DESC
            LIMIT 10 -- Limita aos top 10 por exemplo
        `,
			[estabelecimentoId]
		);
		res.status(200).json(servicos);
	} catch (error) {
		console.error('Erro ao buscar serviços mais agendados:', error);
		res.status(500).json({ message: 'Erro interno ao buscar relatório.' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * GET /api/relatorios/desempenho-profissionais
 * Retorna contagem de agendamentos concluídos por profissional.
 * (Implementação SIMPLIFICADA)
 */
router.get('/desempenho-profissionais', async (req, res) => {
	const estabelecimentoId = req.user.id;
	let db;
	try {
		db = await openDb();
		const desempenho = await db.all(
			`
            SELECT profissional_nome, COUNT(id) as count
            FROM agendamentos
            WHERE estabelecimento_id = ? AND status = 'concluido'
            GROUP BY profissional_nome
            ORDER BY count DESC
        `,
			[estabelecimentoId]
		);
		res.status(200).json(desempenho);
	} catch (error) {
		console.error('Erro ao buscar desempenho dos profissionais:', error);
		res.status(500).json({ message: 'Erro interno ao buscar relatório.' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * GET /api/relatorios/taxa-cancelamento
 * Retorna a contagem de cancelados vs total (simplificado).
 * (Implementação SIMPLIFICADA)
 */
router.get('/taxa-cancelamento', async (req, res) => {
	const estabelecimentoId = req.user.id;
	// Poderia aceitar query params para período (ex: ?periodo=30d)
	let db;
	try {
		db = await openDb();
		const totais = await db.get(
			`
            SELECT
                COUNT(id) as total,
                SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) as cancelados
            FROM agendamentos
            WHERE estabelecimento_id = ?
            -- AND date(data) >= date('now', '-30 days') -- Exemplo de filtro por período
        `,
			[estabelecimentoId]
		);

		const taxa =
			totais.total > 0 ? (totais.cancelados / totais.total) * 100 : 0;

		res.status(200).json({
			totalAgendamentos: totais.total || 0,
			agendamentosCancelados: totais.cancelados || 0,
			taxaCancelamentoPercentual: parseFloat(taxa.toFixed(1)),
		});
	} catch (error) {
		console.error('Erro ao buscar taxa de cancelamento:', error);
		res.status(500).json({ message: 'Erro interno ao buscar relatório.' });
	} finally {
		if (db) await db.close();
	}
});

export default router;
