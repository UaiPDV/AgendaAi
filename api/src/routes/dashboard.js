import { Router } from 'express';
import { authenticateToken, isEstabelecimento } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();

router.use(authenticateToken);
router.use(isEstabelecimento);

/**
 * @openapi
 * /api/dashboard/metrics:
 *   get:
 *     tags: [Estabelecimento - Dashboard]
 *     summary: Retorna métricas do dashboard do estabelecimento
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas retornadas
 */

/**
 * GET /api/dashboard/metrics
 * Retorna métricas básicas para o dashboard do estabelecimento.
 * (Implementação SIMPLIFICADA)
 */
router.get('/metrics', async (req, res) => {
	const estabelecimentoId = req.user.id;
	const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
	const firstDayOfMonth = today.substring(0, 8) + '01'; // YYYY-MM-01

	let db;
	try {
		db = await openDb();

		// Agendamentos Hoje (Confirmados ou Pendentes)
		const agendamentosHoje = await db.get(
			`SELECT COUNT(id) as count FROM agendamentos
             WHERE estabelecimento_id = ? AND data = ? AND status IN ('confirmado', 'pendente')`,
			[estabelecimentoId, today]
		);

		// Faturamento Hoje (Concluídos)
		const faturamentoHoje = await db.get(
			`SELECT SUM(preco) as total FROM agendamentos
             WHERE estabelecimento_id = ? AND data = ? AND status = 'concluido'`,
			[estabelecimentoId, today]
		);

		// Faturamento Mês (Concluídos no mês atual)
		const faturamentoMes = await db.get(
			`SELECT SUM(preco) as total FROM agendamentos
             WHERE estabelecimento_id = ? AND data >= ? AND data <= ? AND status = 'concluido'`,
			[estabelecimentoId, firstDayOfMonth, today] // Simplificado: usa data atual como fim do mês
		);

		// Opcional: Clientes Ativos (ex: que agendaram nos últimos 90 dias) - Query mais complexa
		const clientesAtivos = await db.get(
			`SELECT COUNT(DISTINCT usuario_id) as count FROM agendamentos
              WHERE estabelecimento_id = ? AND date(data) >= date('now', '-90 days')`,
			[estabelecimentoId]
		);

		// Opcional: Avaliação Média (calculada)
		const avaliacaoMedia = await db.get(
			`SELECT AVG(nota) as media FROM avaliacoes WHERE estabelecimento_id = ?`,
			[estabelecimentoId]
		);

		// Taxa de Ocupação e Serviços Realizados são mais complexos e omitidos na versão simples

		res.status(200).json({
			agendamentosHoje: agendamentosHoje?.count || 0,
			faturamentoHoje: faturamentoHoje?.total || 0,
			faturamentoMes: faturamentoMes?.total || 0,
			clientesAtivos: clientesAtivos?.count || 0, // Adicionado
			avaliacaoMedia: avaliacaoMedia?.media
				? parseFloat(avaliacaoMedia.media.toFixed(1))
				: 0, // Adicionado
			// taxaOcupacao: 'N/A', // Omitido
			// servicosRealizadosMes: 'N/A', // Omitido
		});
	} catch (error) {
		console.error('Erro ao buscar métricas do dashboard:', error);
		res.status(500).json({ message: 'Erro interno ao buscar métricas.' });
	} finally {
		if (db) await db.close();
	}
});

// Outros endpoints de dashboard podem ser adicionados aqui

export default router;
