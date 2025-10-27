import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configura o caminho para o arquivo do banco de dados
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_FILE = join(__dirname, '..', 'database', 'agendaai.sqlite');

/**
 * Abre uma conexão com o banco de dados SQLite.
 */
export async function openDb() {
	return open({
		filename: DB_FILE,
		driver: sqlite3.Database,
	});
}

/**
 * Cria/Atualiza as tabelas no banco de dados se elas não existirem.
 */
async function createOrUpdateSchema(db) {
	console.log('Verificando e atualizando tabelas...');

	// Habilita chaves estrangeiras no SQLite
	await db.exec('PRAGMA foreign_keys = ON;');

	// --- Tabelas Originais (com adições) ---
	await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      telefone TEXT,
      cpf TEXT UNIQUE,
      data_nascimento TEXT,
      tipo TEXT DEFAULT 'cliente',
      -- Novas colunas para preferências
      notif_lembretes INTEGER DEFAULT 1,
      notif_promocoes INTEGER DEFAULT 1,
      pref_tema_escuro INTEGER DEFAULT 0,
      pref_idioma TEXT DEFAULT 'pt-BR',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    );
  `);
	// Adicionar colunas ausentes a usuarios (safe ALTER TABLE)
	try {
		await db.exec(
			'ALTER TABLE usuarios ADD COLUMN notif_lembretes INTEGER DEFAULT 1;'
		);
	} catch (e) {
		/* Ignora se já existe */
	}
	try {
		await db.exec(
			'ALTER TABLE usuarios ADD COLUMN notif_promocoes INTEGER DEFAULT 1;'
		);
	} catch (e) {
		/* Ignora se já existe */
	}
	try {
		await db.exec(
			'ALTER TABLE usuarios ADD COLUMN pref_tema_escuro INTEGER DEFAULT 0;'
		);
	} catch (e) {
		/* Ignora se já existe */
	}
	try {
		await db.exec(
			"ALTER TABLE usuarios ADD COLUMN pref_idioma TEXT DEFAULT 'pt-BR';"
		);
	} catch (e) {
		/* Ignora se já existe */
	}

	await db.exec(`
    CREATE TABLE IF NOT EXISTS estabelecimentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      telefone TEXT,
      endereco TEXT,
      imagem TEXT,
      avaliacao REAL DEFAULT 0.0,
      total_avaliacoes INTEGER DEFAULT 0,
      horario_funcionamento TEXT, -- Campo legado, preferir configuracoes
      tipo TEXT DEFAULT 'estabelecimento',
       -- Novas colunas para preferências
      notif_novos_agendamentos INTEGER DEFAULT 1,
      notif_resumo_diario INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    );
  `);
	// Adicionar colunas ausentes a estabelecimentos
	try {
		await db.exec(
			'ALTER TABLE estabelecimentos ADD COLUMN notif_novos_agendamentos INTEGER DEFAULT 1;'
		);
	} catch (e) {
		/* Ignora se já existe */
	}
	try {
		await db.exec(
			'ALTER TABLE estabelecimentos ADD COLUMN notif_resumo_diario INTEGER DEFAULT 0;'
		);
	} catch (e) {
		/* Ignora se já existe */
	}

	await db.exec(`
    CREATE TABLE IF NOT EXISTS servicos (
      id TEXT PRIMARY KEY,
      estabelecimento_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco NUMERIC NOT NULL,
      duracao INTEGER NOT NULL,
      -- Novas colunas
      categoria TEXT,
      icone TEXT,
      ativo INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos (id) ON DELETE CASCADE
    );
  `);
	// Adicionar colunas ausentes a servicos
	try {
		await db.exec('ALTER TABLE servicos ADD COLUMN categoria TEXT;');
	} catch (e) {
		/* Ignora se já existe */
	}
	try {
		await db.exec('ALTER TABLE servicos ADD COLUMN icone TEXT;');
	} catch (e) {
		/* Ignora se já existe */
	}
	try {
		await db.exec(
			'ALTER TABLE servicos ADD COLUMN ativo INTEGER DEFAULT 1;'
		);
	} catch (e) {
		/* Ignora se já existe */
	}

	await db.exec(`
    CREATE TABLE IF NOT EXISTS profissionais (
      id TEXT PRIMARY KEY,
      estabelecimento_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      telefone TEXT,
      especialidades TEXT, -- JSON '["Corte", "Barba"]'
      -- Novas colunas para horário individual
      horario_entrada TEXT, -- Formato 'HH:MM'
      horario_saida TEXT,   -- Formato 'HH:MM'
      dias_trabalho TEXT, -- JSON '[1,2,3,4,5]' (0=Dom, 6=Sab)
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos (id) ON DELETE CASCADE
    );
  `);
	// Adicionar colunas ausentes a profissionais
	try {
		await db.exec(
			'ALTER TABLE profissionais ADD COLUMN horario_entrada TEXT;'
		);
	} catch (e) {
		/* Ignora se já existe */
	}
	try {
		await db.exec(
			'ALTER TABLE profissionais ADD COLUMN horario_saida TEXT;'
		);
	} catch (e) {
		/* Ignora se já existe */
	}
	try {
		await db.exec(
			'ALTER TABLE profissionais ADD COLUMN dias_trabalho TEXT;'
		);
	} catch (e) {
		/* Ignora se já existe */
	}

	await db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id TEXT PRIMARY KEY,
      estabelecimento_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      email TEXT,
      telefone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos (id) ON DELETE CASCADE
    );
  `);

	// Atualizar tabela agendamentos para incluir o novo status
	// SQLite não suporta ALTER TABLE para modificar CHECK constraints diretamente.
	// A forma segura seria criar uma nova tabela, copiar os dados e renomear.
	// Para simplificar, vamos remover a constraint e confiar na validação da aplicação.
	// OU, se a tabela já existe com a constraint antiga, esta recriação não fará nada.
	// A melhor abordagem é garantir que a tabela seja criada corretamente da primeira vez.
	await db.exec(`DROP TABLE IF EXISTS agendamentos_temp_migration;`); // Limpa se falhou antes
	await db.exec(`
    CREATE TABLE IF NOT EXISTS agendamentos_temp_migration (
      id TEXT PRIMARY KEY,
      usuario_id TEXT NOT NULL,
      estabelecimento_id INTEGER NOT NULL,
      servico_id TEXT NOT NULL,
      profissional_id TEXT NOT NULL,
      data TEXT NOT NULL, -- YYYY-MM-DD
      horario TEXT NOT NULL, -- HH:MM
      status TEXT DEFAULT 'pendente', -- CHECK removido temporariamente
      servico_nome TEXT,
      profissional_nome TEXT,
      preco NUMERIC,
      estabelecimento_nome TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
      FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos (id) ON DELETE CASCADE,
      FOREIGN KEY (servico_id) REFERENCES servicos (id) ON DELETE CASCADE,
      FOREIGN KEY (profissional_id) REFERENCES profissionais (id) ON DELETE CASCADE
    );
  `);
	// Copiar dados se a tabela agendamentos já existe
	try {
		const hasOldTable = await db.get(
			"SELECT name FROM sqlite_master WHERE type='table' AND name='agendamentos';"
		);
		if (hasOldTable) {
			await db.exec(
				`INSERT INTO agendamentos_temp_migration SELECT * FROM agendamentos;`
			);
			await db.exec(`DROP TABLE agendamentos;`);
		}
	} catch (e) {
		/* Tabela agendamentos não existe, tudo bem */
	}

	// Recriar tabela agendamentos com a constraint correta (ou criar se for a primeira vez)
	await db.exec(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id TEXT PRIMARY KEY,
      usuario_id TEXT NOT NULL,
      estabelecimento_id INTEGER NOT NULL,
      servico_id TEXT NOT NULL,
      profissional_id TEXT NOT NULL,
      data TEXT NOT NULL, -- YYYY-MM-DD
      horario TEXT NOT NULL, -- HH:MM
      -- Status atualizados com CHECK constraint
      status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'confirmado', 'cancelado', 'concluido', 'nao_compareceu')),
      servico_nome TEXT,
      profissional_nome TEXT,
      preco NUMERIC,
      estabelecimento_nome TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
      FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos (id) ON DELETE CASCADE,
      FOREIGN KEY (servico_id) REFERENCES servicos (id) ON DELETE CASCADE,
      FOREIGN KEY (profissional_id) REFERENCES profissionais (id) ON DELETE CASCADE
    );
  `);
	// Copiar dados de volta se a tabela temporária foi usada
	try {
		const hasTempTable = await db.get(
			"SELECT name FROM sqlite_master WHERE type='table' AND name='agendamentos_temp_migration';"
		);
		if (hasTempTable) {
			await db.exec(
				`INSERT INTO agendamentos SELECT * FROM agendamentos_temp_migration;`
			);
			await db.exec(`DROP TABLE agendamentos_temp_migration;`);
			console.log(
				'Tabela agendamentos migrada para incluir novo status.'
			);
		}
	} catch (e) {
		/* Tabela temp não existe, tudo bem */
	}

	await db.exec(`
    CREATE TABLE IF NOT EXISTS configuracoes_estabelecimento (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				estabelecimentoId INTEGER NOT NULL UNIQUE,
				padraoFuncionamento TEXT DEFAULT 'seg-dom' CHECK(padraoFuncionamento IN ('seg-sex', 'seg-sab', 'seg-dom', 'personalizado')),
				diasTrabalho TEXT DEFAULT '[1,2,3,4,5,6,0]', -- JSON array [0-6]
				horarioAbertura TEXT DEFAULT '08:00',
				horarioFechamento TEXT DEFAULT '18:00',
				possuiIntervalo INTEGER DEFAULT 0,
				intervaloInicio TEXT,
				intervaloFim TEXT,
				horariosIndividuaisAtivo INTEGER DEFAULT 0,
				fecharFeriadosNacionais INTEGER DEFAULT 0,
				fecharFeriadosMunicipais INTEGER DEFAULT 0,
				feriadosPersonalizados TEXT DEFAULT '[]', -- JSON array [{nome, data 'DD/MM'}] ou ['YYYY-MM-DD']
				datasBloqueadas TEXT DEFAULT '[]', -- JSON array ['YYYY-MM-DD']
				duracaoPadrao INTEGER DEFAULT 30,
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
			);
    `);

	// --- Novas Tabelas ---

	await db.exec(`
    CREATE TABLE IF NOT EXISTS avaliacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agendamento_id TEXT NOT NULL UNIQUE, -- Garante uma avaliação por agendamento
      usuario_id TEXT NOT NULL,
      estabelecimento_id INTEGER NOT NULL,
      profissional_id TEXT, -- Pode ser nulo se a avaliação for geral
      nota INTEGER NOT NULL CHECK(nota >= 1 AND nota <= 5),
      comentario TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agendamento_id) REFERENCES agendamentos (id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
      FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos (id) ON DELETE CASCADE,
      FOREIGN KEY (profissional_id) REFERENCES profissionais (id) ON DELETE SET NULL
    );
  `);

	await db.exec(`
    CREATE TABLE IF NOT EXISTS formas_pagamento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('credito', 'debito', 'pix')), -- Simplificado
      descricao TEXT NOT NULL, -- Ex: 'Cartão final 1234' ou 'Chave PIX email@...'
      token_gateway TEXT, -- ID ou token do método no gateway de pagamento (simulado)
      principal INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
    );
  `);

	console.log('Tabelas verificadas/atualizadas com sucesso.');
}

/**
 * Função principal para inicializar o banco de dados.
 */
export async function initDb() {
	let db;
	try {
		db = await openDb();
		await createOrUpdateSchema(db); // Usa a função atualizada
	} catch (error) {
		console.error('Erro ao inicializar o banco de dados:', error);
		throw error;
	} finally {
		if (db) {
			await db.close();
		}
	}
}

// Executa a inicialização/atualização se o script for chamado diretamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	console.log('Executando setup/update do banco de dados...');
	initDb()
		.then(() => {
			console.log('Setup/update do banco de dados concluído.');
		})
		.catch((err) => {
			console.error('Falha no setup/update do banco de dados:', err);
			process.exit(1);
		});
}
