import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { openDb } from '../database.js';

const router = Router();
router.use(authenticateToken);

/**
 * GET /api/financas/me
 * Retorna dados financeiros agregados para o usuário logado (cliente ou estabelecimento).
 * (Implementação SIMPLIFICADA)
 */
router.get('/me', async (req, res) => {
	const userId = req.user.id;
	const userType = req.user.tipo;
	const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
	const firstDayOfMonth = today.substring(0, 8) + '01'; // YYYY-MM-01

	let db;
	try {
		db = await openDb();

		if (userType === 'cliente') {
			// Gasto Total (Mês) para Cliente
			const gastoMes = await db.get(
				`SELECT SUM(preco) as total FROM agendamentos
                 WHERE usuario_id = ? AND data >= ? AND data <= ? AND status = 'concluido'`,
				[userId, firstDayOfMonth, today]
			);
			// Gasto Total (Geral)
			const gastoTotal = await db.get(
				`SELECT SUM(preco) as total FROM agendamentos
                 WHERE usuario_id = ? AND status = 'concluido'`,
				[userId]
			);
			// Opcional: Pagamentos pendentes (simulado, verificar status != 'concluido'?)
			const pendentes = await db.get(
				`SELECT SUM(preco) as total FROM agendamentos
                 WHERE usuario_id = ? AND status IN ('confirmado', 'pendente') AND date(data) <= date('now')`, // Simplificado: agendamentos passados não concluídos
				[userId]
			);

			res.status(200).json({
				tipo: 'cliente',
				gastoMes: gastoMes?.total || 0,
				gastoTotal: gastoTotal?.total || 0,
				pagamentosPendentes: pendentes?.total || 0,
			});
		} else if (userType === 'estabelecimento') {
			// Ganhos do Mês para Estabelecimento (já calculado em /dashboard/metrics)
			const ganhosMes = await db.get(
				`SELECT SUM(preco) as total FROM agendamentos
                 WHERE estabelecimento_id = ? AND data >= ? AND data <= ? AND status = 'concluido'`,
				[userId, firstDayOfMonth, today]
			);
			// Ganho Total (Geral)
			const ganhoTotal = await db.get(
				`SELECT SUM(preco) as total FROM agendamentos
                 WHERE estabelecimento_id = ? AND status = 'concluido'`,
				[userId]
			);

			res.status(200).json({
				tipo: 'estabelecimento',
				ganhosMes: ganhosMes?.total || 0,
				ganhoTotal: ganhoTotal?.total || 0,
			});
		} else {
			res.status(403).json({ message: 'Tipo de usuário inválido.' });
		}
	} catch (error) {
		console.error('Erro ao buscar dados financeiros:', error);
		res.status(500).json({
			message: 'Erro interno ao buscar dados financeiros.',
		});
	} finally {
		if (db) await db.close();
	}
});

export default router;
