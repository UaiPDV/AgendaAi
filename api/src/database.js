import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configura o caminho para o arquivo do banco de dados
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// O arquivo ficará em /api/database/agendaai.sqlite
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
 * Cria as tabelas no banco de dados se elas não existirem.
 * Converte a sintaxe do PostgreSQL (da especificação) para SQLite.
 */
async function createSchema(db) {
	console.log('Verificando e criando tabelas...');

	// Habilita chaves estrangeiras no SQLite
	await db.exec('PRAGMA foreign_keys = ON;');

	// Tabela de Usuários (Clientes)
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    );
  `);

	// Tabela de Estabelecimentos
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
      horario_funcionamento TEXT,
      tipo TEXT DEFAULT 'estabelecimento',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    );
  `);

	// Tabela de Serviços
	await db.exec(`
    CREATE TABLE IF NOT EXISTS servicos (
      id TEXT PRIMARY KEY,
      estabelecimento_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco NUMERIC NOT NULL,
      duracao INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos (id) ON DELETE CASCADE
    );
  `);

	// Tabela de Profissionais
	await db.exec(`
    CREATE TABLE IF NOT EXISTS profissionais (
      id TEXT PRIMARY KEY,
      estabelecimento_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      telefone TEXT,
      especialidades TEXT, -- Armazenado como JSON string: '["Corte", "Barba"]'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos (id) ON DELETE CASCADE
    );
  `);

	// Tabela de Clientes
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

	// Tabela de Agendamentos
	await db.exec(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id TEXT PRIMARY KEY,
      usuario_id TEXT NOT NULL,
      estabelecimento_id INTEGER NOT NULL,
      servico_id TEXT NOT NULL,
      profissional_id TEXT NOT NULL,
      data TEXT NOT NULL,
      horario TEXT NOT NULL,
      status TEXT DEFAULT 'pendente',
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

	// (Outras tabelas como transacoes, pagamentos, avaliacoes, notificacoes podem ser adicionadas aqui seguindo o mesmo padrão)

	console.log('Tabelas criadas com sucesso (se não existiam).');
}

/**
 * Função principal para inicializar o banco de dados.
 * Usada pelo script `npm run setup` e pela inicialização do app.
 */
export async function initDb() {
	let db;
	try {
		db = await openDb();
		await createSchema(db);
	} catch (error) {
		console.error('Erro ao inicializar o banco de dados:', error);
		throw error;
	} finally {
		if (db) {
			await db.close();
		}
	}
}

// Executa a inicialização se o script for chamado diretamente
// (ex: `node src/database.js` ou `npm run setup`)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	console.log('Executando setup do banco de dados...');
	initDb()
		.then(() => {
			console.log('Setup do banco de dados concluído.');
		})
		.catch((err) => {
			console.error('Falha no setup do banco de dados:', err);
			process.exit(1);
		});
}
