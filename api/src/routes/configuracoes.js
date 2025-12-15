import { Router } from 'express';
import { openDb } from '../database.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

/**
 * @openapi
 * /api/configuracoes/me:
 *   get:
 *     tags: [Estabelecimento - Configuracoes]
 *     summary: Retorna configurações do estabelecimento logado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configurações retornadas
 *       403:
 *         description: Apenas estabelecimentos
 *   put:
 *     tags: [Estabelecimento - Configuracoes]
 *     summary: Atualiza configurações do estabelecimento logado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               padraoFuncionamento:
 *                 type: string
 *               diasTrabalho:
 *                 type: array
 *                 items:
 *                   type: integer
 *               horarioAbertura:
 *                 type: string
 *               horarioFechamento:
 *                 type: string
 *               possuiIntervalo:
 *                 type: boolean
 *               intervaloInicio:
 *                 type: string
 *               intervaloFim:
 *                 type: string
 *               horariosIndividuaisAtivo:
 *                 type: boolean
 *               fecharFeriadosNacionais:
 *                 type: boolean
 *               fecharFeriadosMunicipais:
 *                 type: boolean
 *               feriadosPersonalizados:
 *                 type: array
 *                 items:
 *                   type: string
 *               datasBloqueadas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Datas em formato YYYY-MM-DD
 *               duracaoPadrao:
 *                 type: integer
 *               antecedenciaMinima:
 *                 type: integer
 *               antecedenciaMinimaAtivo:
 *                 type: boolean
 *               limiteAgendamentosSimultaneos:
 *                 type: integer
 *               limiteAgendamentosAtivo:
 *                 type: boolean
 *               confirmacaoAutomatica:
 *                 type: boolean
 *               bufferEntreServicos:
 *                 type: integer
 *               bufferEntreServicosAtivo:
 *                 type: boolean
 *               cancelamentoAntecedencia:
 *                 type: integer
 *               cancelamentoAntecedenciaAtivo:
 *                 type: boolean
 *               reagendamentoPermitido:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Configurações atualizadas
 */

/**
 * GET /api/configuracoes/me
 * Busca as configurações do estabelecimento logado
 */
router.get('/me', authenticateToken, async (req, res) => {
	const estabelecimentoId = req.user.estabelecimentoId || req.user.id;

	if (!estabelecimentoId) {
		return res.status(403).json({
			error: 'Acesso negado. Apenas estabelecimentos podem acessar configurações.',
		});
	}

	let db;
	try {
		db = await openDb();
		const sql = `SELECT * FROM configuracoes_estabelecimento WHERE estabelecimentoId = ?`;
		let config = await db.get(sql, [estabelecimentoId]);

		if (!config) {
			// Se não existe, criar configuração padrão
			const configPadrao = {
				estabelecimentoId,
				padraoFuncionamento: 'seg-dom',
				diasTrabalho: JSON.stringify([1, 2, 3, 4, 5, 6, 0]),
				horarioAbertura: '08:00',
				horarioFechamento: '18:00',
				possuiIntervalo: 0,
				intervaloInicio: null,
				intervaloFim: null,
				horariosIndividuaisAtivo: 0,
				fecharFeriadosNacionais: 0,
				fecharFeriadosMunicipais: 0,
				feriadosPersonalizados: JSON.stringify([]),
				datasBloqueadas: JSON.stringify([]),
				duracaoPadrao: 30,
				antecedenciaMinima: 2,
				antecedenciaMinimaAtivo: 1,
				limiteAgendamentosSimultaneos: 3,
				limiteAgendamentosAtivo: 0,
				confirmacaoAutomatica: 0,
				bufferEntreServicos: 10,
				bufferEntreServicosAtivo: 1,
				cancelamentoAntecedencia: 24,
				cancelamentoAntecedenciaAtivo: 1,
				reagendamentoPermitido: 1,
			};

			const insertSql = `
				INSERT INTO configuracoes_estabelecimento (
					estabelecimentoId, padraoFuncionamento, diasTrabalho,
					horarioAbertura, horarioFechamento, possuiIntervalo,
					intervaloInicio, intervaloFim, horariosIndividuaisAtivo,
					fecharFeriadosNacionais, fecharFeriadosMunicipais,
					feriadosPersonalizados, datasBloqueadas, duracaoPadrao,
					antecedenciaMinima, antecedenciaMinimaAtivo,
					limiteAgendamentosSimultaneos, limiteAgendamentosAtivo,
					confirmacaoAutomatica, bufferEntreServicos, bufferEntreServicosAtivo,
					cancelamentoAntecedencia, cancelamentoAntecedenciaAtivo,
					reagendamentoPermitido
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`;

			const result = await db.run(insertSql, [
				configPadrao.estabelecimentoId,
				configPadrao.padraoFuncionamento,
				configPadrao.diasTrabalho,
				configPadrao.horarioAbertura,
				configPadrao.horarioFechamento,
				configPadrao.possuiIntervalo,
				configPadrao.intervaloInicio,
				configPadrao.intervaloFim,
				configPadrao.horariosIndividuaisAtivo,
				configPadrao.fecharFeriadosNacionais,
				configPadrao.fecharFeriadosMunicipais,
				configPadrao.feriadosPersonalizados,
				configPadrao.datasBloqueadas,
				configPadrao.duracaoPadrao,
				configPadrao.antecedenciaMinima,
				configPadrao.antecedenciaMinimaAtivo,
				configPadrao.limiteAgendamentosSimultaneos,
				configPadrao.limiteAgendamentosAtivo,
				configPadrao.confirmacaoAutomatica,
				configPadrao.bufferEntreServicos,
				configPadrao.bufferEntreServicosAtivo,
				configPadrao.cancelamentoAntecedencia,
				configPadrao.cancelamentoAntecedenciaAtivo,
				configPadrao.reagendamentoPermitido,
			]);

			config = {
				id: result.lastID,
				...configPadrao,
			};
		}

		// Parse dos campos JSON
		const response = {
			...config,
			diasTrabalho: JSON.parse(config.diasTrabalho),
			feriadosPersonalizados: JSON.parse(config.feriadosPersonalizados),
			datasBloqueadas: JSON.parse(config.datasBloqueadas),
			possuiIntervalo: Boolean(config.possuiIntervalo),
			horariosIndividuaisAtivo: Boolean(config.horariosIndividuaisAtivo),
			fecharFeriadosNacionais: Boolean(config.fecharFeriadosNacionais),
			fecharFeriadosMunicipais: Boolean(config.fecharFeriadosMunicipais),
			antecedenciaMinimaAtivo: Boolean(config.antecedenciaMinimaAtivo),
			limiteAgendamentosAtivo: Boolean(config.limiteAgendamentosAtivo),
			confirmacaoAutomatica: Boolean(config.confirmacaoAutomatica),
			bufferEntreServicosAtivo: Boolean(config.bufferEntreServicosAtivo),
			cancelamentoAntecedenciaAtivo: Boolean(
				config.cancelamentoAntecedenciaAtivo
			),
			reagendamentoPermitido: Boolean(config.reagendamentoPermitido),
		};

		res.json(response);
	} catch (err) {
		console.error('Erro ao buscar configurações:', err);
		res.status(500).json({ error: 'Erro ao buscar configurações' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * PUT /api/configuracoes/me
 * Atualiza as configurações do estabelecimento logado
 */
router.put('/me', authenticateToken, async (req, res) => {
	const estabelecimentoId = req.user.estabelecimentoId || req.user.id;

	if (!estabelecimentoId) {
		return res.status(403).json({
			error: 'Acesso negado. Apenas estabelecimentos podem atualizar configurações.',
		});
	}

	const {
		padraoFuncionamento,
		diasTrabalho,
		horarioAbertura,
		horarioFechamento,
		possuiIntervalo,
		intervaloInicio,
		intervaloFim,
		horariosIndividuaisAtivo,
		fecharFeriadosNacionais,
		fecharFeriadosMunicipais,
		feriadosPersonalizados,
		datasBloqueadas,
		duracaoPadrao,
		antecedenciaMinima,
		antecedenciaMinimaAtivo,
		limiteAgendamentosSimultaneos,
		limiteAgendamentosAtivo,
		confirmacaoAutomatica,
		bufferEntreServicos,
		bufferEntreServicosAtivo,
		cancelamentoAntecedencia,
		cancelamentoAntecedenciaAtivo,
		reagendamentoPermitido,
	} = req.body;

	let db;
	try {
		db = await openDb();

		const sql = `
			UPDATE configuracoes_estabelecimento SET
				padraoFuncionamento = COALESCE(?, padraoFuncionamento),
				diasTrabalho = COALESCE(?, diasTrabalho),
				horarioAbertura = COALESCE(?, horarioAbertura),
				horarioFechamento = COALESCE(?, horarioFechamento),
				possuiIntervalo = COALESCE(?, possuiIntervalo),
				intervaloInicio = ?,
				intervaloFim = ?,
				horariosIndividuaisAtivo = COALESCE(?, horariosIndividuaisAtivo),
				fecharFeriadosNacionais = COALESCE(?, fecharFeriadosNacionais),
				fecharFeriadosMunicipais = COALESCE(?, fecharFeriadosMunicipais),
				feriadosPersonalizados = COALESCE(?, feriadosPersonalizados),
				datasBloqueadas = COALESCE(?, datasBloqueadas),
				duracaoPadrao = COALESCE(?, duracaoPadrao),
				antecedenciaMinima = COALESCE(?, antecedenciaMinima),
				antecedenciaMinimaAtivo = COALESCE(?, antecedenciaMinimaAtivo),
				limiteAgendamentosSimultaneos = COALESCE(?, limiteAgendamentosSimultaneos),
				limiteAgendamentosAtivo = COALESCE(?, limiteAgendamentosAtivo),
				confirmacaoAutomatica = COALESCE(?, confirmacaoAutomatica),
				bufferEntreServicos = COALESCE(?, bufferEntreServicos),
				bufferEntreServicosAtivo = COALESCE(?, bufferEntreServicosAtivo),
				cancelamentoAntecedencia = COALESCE(?, cancelamentoAntecedencia),
				cancelamentoAntecedenciaAtivo = COALESCE(?, cancelamentoAntecedenciaAtivo),
				reagendamentoPermitido = COALESCE(?, reagendamentoPermitido),
				updatedAt = CURRENT_TIMESTAMP
			WHERE estabelecimentoId = ?
		`;

		const result = await db.run(sql, [
			padraoFuncionamento,
			diasTrabalho ? JSON.stringify(diasTrabalho) : null,
			horarioAbertura,
			horarioFechamento,
			possuiIntervalo !== undefined ? (possuiIntervalo ? 1 : 0) : null,
			intervaloInicio || null,
			intervaloFim || null,
			horariosIndividuaisAtivo !== undefined
				? horariosIndividuaisAtivo
					? 1
					: 0
				: null,
			fecharFeriadosNacionais !== undefined
				? fecharFeriadosNacionais
					? 1
					: 0
				: null,
			fecharFeriadosMunicipais !== undefined
				? fecharFeriadosMunicipais
					? 1
					: 0
				: null,
			feriadosPersonalizados
				? JSON.stringify(feriadosPersonalizados)
				: null,
			datasBloqueadas ? JSON.stringify(datasBloqueadas) : null,
			duracaoPadrao,
			antecedenciaMinima,
			antecedenciaMinimaAtivo !== undefined
				? antecedenciaMinimaAtivo
					? 1
					: 0
				: null,
			limiteAgendamentosSimultaneos,
			limiteAgendamentosAtivo !== undefined
				? limiteAgendamentosAtivo
					? 1
					: 0
				: null,
			confirmacaoAutomatica !== undefined
				? confirmacaoAutomatica
					? 1
					: 0
				: null,
			bufferEntreServicos,
			bufferEntreServicosAtivo !== undefined
				? bufferEntreServicosAtivo
					? 1
					: 0
				: null,
			cancelamentoAntecedencia,
			cancelamentoAntecedenciaAtivo !== undefined
				? cancelamentoAntecedenciaAtivo
					? 1
					: 0
				: null,
			reagendamentoPermitido !== undefined
				? reagendamentoPermitido
					? 1
					: 0
				: null,
			estabelecimentoId,
		]);

		if (result.changes === 0) {
			await db.close();
			return res
				.status(404)
				.json({ error: 'Configuração não encontrada' });
		}

		// Buscar configuração atualizada
		const config = await db.get(
			'SELECT * FROM configuracoes_estabelecimento WHERE estabelecimentoId = ?',
			[estabelecimentoId]
		);

		const response = {
			...config,
			diasTrabalho: JSON.parse(config.diasTrabalho),
			feriadosPersonalizados: JSON.parse(config.feriadosPersonalizados),
			datasBloqueadas: JSON.parse(config.datasBloqueadas),
			possuiIntervalo: Boolean(config.possuiIntervalo),
			horariosIndividuaisAtivo: Boolean(config.horariosIndividuaisAtivo),
			fecharFeriadosNacionais: Boolean(config.fecharFeriadosNacionais),
			fecharFeriadosMunicipais: Boolean(config.fecharFeriadosMunicipais),
			antecedenciaMinimaAtivo: Boolean(config.antecedenciaMinimaAtivo),
			limiteAgendamentosAtivo: Boolean(config.limiteAgendamentosAtivo),
			confirmacaoAutomatica: Boolean(config.confirmacaoAutomatica),
			bufferEntreServicosAtivo: Boolean(config.bufferEntreServicosAtivo),
			cancelamentoAntecedenciaAtivo: Boolean(
				config.cancelamentoAntecedenciaAtivo
			),
			reagendamentoPermitido: Boolean(config.reagendamentoPermitido),
		};

		res.json(response);
	} catch (err) {
		console.error('Erro ao atualizar configurações:', err);
		res.status(500).json({ error: 'Erro ao atualizar configurações' });
	} finally {
		if (db) await db.close();
	}
});

export default router;
