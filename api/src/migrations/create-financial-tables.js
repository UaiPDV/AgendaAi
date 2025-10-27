import { openDb } from '../database.js';

export async function createProdutosTable() {
	const db = await openDb();
	await db.exec(`
        CREATE TABLE IF NOT EXISTS produtos (
            id TEXT PRIMARY KEY,
            estabelecimento_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL,
            categoria TEXT,
            estoque INTEGER DEFAULT 0,
            ativo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (estabelecimento_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `);
	await db.close();
	console.log('Tabela produtos criada com sucesso!');
}

export async function createContasPagarTable() {
	const db = await openDb();
	await db.exec(`
        CREATE TABLE IF NOT EXISTS contas_pagar (
            id TEXT PRIMARY KEY,
            estabelecimento_id INTEGER NOT NULL,
            descricao TEXT NOT NULL,
            valor REAL NOT NULL,
            data_vencimento DATE NOT NULL,
            data_pagamento DATE,
            categoria TEXT,
            fornecedor TEXT,
            observacoes TEXT,
            status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'pago', 'cancelado')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (estabelecimento_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `);
	await db.close();
	console.log('Tabela contas_pagar criada com sucesso!');
}

export async function createContasReceberTable() {
	const db = await openDb();
	await db.exec(`
        CREATE TABLE IF NOT EXISTS contas_receber (
            id TEXT PRIMARY KEY,
            estabelecimento_id INTEGER NOT NULL,
            descricao TEXT NOT NULL,
            valor REAL NOT NULL,
            data_vencimento DATE NOT NULL,
            data_recebimento DATE,
            categoria TEXT,
            cliente TEXT,
            observacoes TEXT,
            status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'recebido', 'cancelado')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (estabelecimento_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `);
	await db.close();
	console.log('Tabela contas_receber criada com sucesso!');
}
