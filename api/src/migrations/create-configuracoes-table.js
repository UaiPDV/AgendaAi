/**
 * Migração: Criar tabela configuracoes_estabelecimento
 *
 * Esta tabela armazena todas as configurações de funcionamento
 * de cada estabelecimento (horários, feriados, bloqueios, etc.)
 */

import { openDb } from '../database.js';

const migration = async () => {
	let db;
	try {
		db = await openDb();
		const sql = `
			CREATE TABLE IF NOT EXISTS configuracoes_estabelecimento (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				estabelecimentoId INTEGER NOT NULL UNIQUE,
				
				-- Padrão de funcionamento
				padraoFuncionamento TEXT DEFAULT 'seg-dom' CHECK(padraoFuncionamento IN ('seg-sex', 'seg-sab', 'seg-dom', 'personalizado')),
				
				-- Dias de trabalho (JSON array de números 0-6, onde 0=domingo)
				diasTrabalho TEXT DEFAULT '[1,2,3,4,5,6,0]',
				
				-- Horários padrão
				horarioAbertura TEXT DEFAULT '08:00',
				horarioFechamento TEXT DEFAULT '18:00',
				
				-- Intervalo para almoço
				possuiIntervalo INTEGER DEFAULT 0,
				intervaloInicio TEXT,
				intervaloFim TEXT,
				
				-- Horários individuais por profissional
				horariosIndividuaisAtivo INTEGER DEFAULT 0,
				
				-- Feriados
				fecharFeriadosNacionais INTEGER DEFAULT 0,
				fecharFeriadosMunicipais INTEGER DEFAULT 0,
				feriadosPersonalizados TEXT DEFAULT '[]', -- JSON array de {id, nome, data}
				
				-- Bloqueio de datas
				datasBloqueadas TEXT DEFAULT '[]', -- JSON array de strings YYYY-MM-DD
				
				-- Duração padrão dos agendamentos (minutos)
				duracaoPadrao INTEGER DEFAULT 30,
				
				-- Configurações adicionais
				antecedenciaMinima INTEGER DEFAULT 2, -- horas
				antecedenciaMinimaAtivo INTEGER DEFAULT 1,
				limiteAgendamentosSimultaneos INTEGER DEFAULT 3,
				limiteAgendamentosAtivo INTEGER DEFAULT 0,
				confirmacaoAutomatica INTEGER DEFAULT 0,
				bufferEntreServicos INTEGER DEFAULT 10, -- minutos
				bufferEntreServicosAtivo INTEGER DEFAULT 1,
				cancelamentoAntecedencia INTEGER DEFAULT 24, -- horas
				cancelamentoAntecedenciaAtivo INTEGER DEFAULT 1,
				reagendamentoPermitido INTEGER DEFAULT 1,
				
				createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
				updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
				
				FOREIGN KEY (estabelecimentoId) REFERENCES estabelecimentos(id) ON DELETE CASCADE
			)
		`;

		await db.run(sql);
		console.log(
			'✅ Tabela configuracoes_estabelecimento criada com sucesso'
		);
	} catch (err) {
		console.error(
			'❌ Erro ao criar tabela configuracoes_estabelecimento:',
			err
		);
		throw err;
	} finally {
		if (db) await db.close();
	}
};

// Executar migração se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
	console.log('🔄 Iniciando migração...');
	migration()
		.then(() => {
			console.log('✅ Migração concluída');
			process.exit(0);
		})
		.catch((err) => {
			console.error('❌ Erro na migração:', err);
			process.exit(1);
		});
}

export default migration;
