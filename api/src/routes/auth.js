import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { openDb } from '../database.js';

const router = Router();

/**
 * Gera um token JWT para um usuário.
 */
const generateToken = (user) => {
	const payload = {
		id: user.id,
		tipo: user.tipo,
		email: user.email,
	};
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: '7d', // Token expira em 7 dias
	});
};

/**
 * POST /api/auth/register
 * Registra um novo CLIENTE.
 */
router.post('/register', async (req, res) => {
	const { nome, email, senha, telefone, cpf, dataNascimento } = req.body;

	if (!nome || !email || !senha) {
		return res
			.status(400)
			.json({ message: 'Nome, email e senha são obrigatórios.' });
	}

	let db;
	try {
		db = await openDb();

		// Verifica se o email ou CPF já existem
		const existingUser = await db.get(
			'SELECT * FROM usuarios WHERE email = ? OR cpf = ?',
			[email, cpf]
		);
		if (existingUser) {
			return res
				.status(400)
				.json({ message: 'Email ou CPF já cadastrado.' });
		}

		// Criptografa a senha
		const senhaHash = await bcrypt.hash(senha, 10);
		const userId = uuidv4();

		// Insere no banco
		await db.run(
			'INSERT INTO usuarios (id, nome, email, senha, telefone, cpf, data_nascimento, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
			[
				userId,
				nome,
				email,
				senhaHash,
				telefone,
				cpf,
				dataNascimento,
				'cliente',
			]
		);

		// Prepara a resposta (sem a senha)
		const newUser = { id: userId, nome, email, tipo: 'cliente' };
		const token = generateToken(newUser);

		res.status(201).json({ success: true, user: newUser, token });
	} catch (error) {
		console.error('Erro no registro:', error);
		res.status(500).json({ message: 'Erro interno ao registrar usuário.' });
	} finally {
		if (db) await db.close();
	}
});

/**
 * POST /api/auth/register/estabelecimento
 * Registra um novo ESTABELECIMENTO.
 */
router.post('/register/estabelecimento', async (req, res) => {
	const { nome, email, senha, telefone, endereco, horarioFuncionamento } =
		req.body;

	if (!nome || !email || !senha) {
		return res
			.status(400)
			.json({ message: 'Nome, email e senha são obrigatórios.' });
	}

	let db;
	try {
		db = await openDb();
		const existingEstab = await db.get(
			'SELECT * FROM estabelecimentos WHERE email = ?',
			[email]
		);
		if (existingEstab) {
			return res.status(400).json({ message: 'Email já cadastrado.' });
		}

		const senhaHash = await bcrypt.hash(senha, 10);

		const result = await db.run(
			'INSERT INTO estabelecimentos (nome, email, senha, telefone, endereco, horario_funcionamento, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[
				nome,
				email,
				senhaHash,
				telefone,
				endereco,
				horarioFuncionamento,
				'estabelecimento',
			]
		);

		const newEstabId = result.lastID;
		const newEstab = {
			id: newEstabId,
			nome,
			email,
			tipo: 'estabelecimento',
		};
		const token = generateToken(newEstab);

		res.status(201).json({ success: true, user: newEstab, token });
	} catch (error) {
		console.error('Erro no registro de estabelecimento:', error);
		res.status(500).json({
			message: 'Erro interno ao registrar estabelecimento.',
		});
	} finally {
		if (db) await db.close();
	}
});

/**
 * POST /api/auth/login
 * Autentica um cliente ou um estabelecimento.
 */
router.post('/login', async (req, res) => {
	const { email, senha } = req.body;

	if (!email || !senha) {
		return res
			.status(400)
			.json({ message: 'Email e senha são obrigatórios.' });
	}

	let db;
	try {
		db = await openDb();
		let user = null;
		let tipo = null;

		// 1. Tenta encontrar como cliente (usuário)
		user = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
		if (user) {
			tipo = 'cliente';
		} else {
			// 2. Se não for cliente, tenta encontrar como estabelecimento
			user = await db.get(
				'SELECT * FROM estabelecimentos WHERE email = ?',
				[email]
			);
			if (user) {
				tipo = 'estabelecimento';
			}
		}

		// 3. Se não encontrou em nenhuma tabela
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: 'Credenciais inválidas.' });
		}

		// 4. Compara a senha
		const senhaValida = await bcrypt.compare(senha, user.senha);
		if (!senhaValida) {
			return res
				.status(401)
				.json({ success: false, message: 'Credenciais inválidas.' });
		}

		// 5. Gera o token e envia a resposta
		const userResponse = {
			id: user.id,
			nome: user.nome,
			email: user.email,
			tipo: user.tipo,
		};

		const token = generateToken(userResponse);

		res.status(200).json({ success: true, user: userResponse, token });
	} catch (error) {
		console.error('Erro no login:', error);
		res.status(500).json({
			message: 'Erro interno ao tentar fazer login.',
		});
	} finally {
		if (db) await db.close();
	}
});

export default router;
