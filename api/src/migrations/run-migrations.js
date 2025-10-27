/**
 * Script para executar todas as migrações
 */

import { openDb } from '../database.js';
import {
	createProdutosTable,
	createContasPagarTable,
	createContasReceberTable,
} from './create-financial-tables.js';

async function runMigrations() {
	console.log('🔄 Iniciando migrações...');
	let db;

	try {
		db = await openDb();

		// Migração: criar tabela configuracoes_estabelecimento
		console.log('📦 Criando tabela configuracoes_estabelecimento...');
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
				feriadosPersonalizados TEXT DEFAULT '[]',
				
				-- Bloqueio de datas
				datasBloqueadas TEXT DEFAULT '[]',
				
				-- Duração padrão dos agendamentos (minutos)
				duracaoPadrao INTEGER DEFAULT 30,
				
				-- Configurações adicionais
				antecedenciaMinima INTEGER DEFAULT 2,
				antecedenciaMinimaAtivo INTEGER DEFAULT 1,
				limiteAgendamentosSimultaneos INTEGER DEFAULT 3,
				limiteAgendamentosAtivo INTEGER DEFAULT 0,
				confirmacaoAutomatica INTEGER DEFAULT 0,
				bufferEntreServicos INTEGER DEFAULT 10,
				bufferEntreServicosAtivo INTEGER DEFAULT 1,
				cancelamentoAntecedencia INTEGER DEFAULT 24,
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

		// Novas migrações para módulo financeiro e produtos
		console.log('📦 Criando tabela produtos...');
		await createProdutosTable(db);
		console.log('✅ Tabela produtos criada com sucesso');

		console.log('📦 Criando tabela contas_pagar...');
		await createContasPagarTable(db);
		console.log('✅ Tabela contas_pagar criada com sucesso');

		console.log('📦 Criando tabela contas_receber...');
		await createContasReceberTable(db);
		console.log('✅ Tabela contas_receber criada com sucesso');

		console.log('✅ Todas as migrações concluídas!');
	} catch (err) {
		console.error('❌ Erro ao executar migrações:', err);
		throw err;
	} finally {
		if (db) await db.close();
	}
}

// Executar
runMigrations()
	.then(() => {
		console.log('✨ Processo concluído');
		process.exit(0);
	})
	.catch((err) => {
		console.error('💥 Falha:', err);
		process.exit(1);
	});
