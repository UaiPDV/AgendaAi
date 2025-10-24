import jwt from 'jsonwebtoken';

/**
 * Middleware para verificar o token JWT.
 * Protege rotas que exigem autenticação.
 */
export const authenticateToken = (req, res, next) => {
	// Pega o token do header 'Authorization'
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

	if (token == null) {
		// 401 Unauthorized - Nenhum token fornecido
		return res
			.status(401)
			.json({ message: 'Token de autenticação ausente.' });
	}

	// Verifica a validade do token
	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			// 403 Forbidden - Token inválido ou expirado
			return res
				.status(403)
				.json({ message: 'Token inválido ou expirado.' });
		}

		// Adiciona os dados do usuário (payload do token) ao objeto `req`
		req.user = user;
		next(); // Continua para a próxima função (o controller da rota)
	});
};

/**
 * Middleware opcional para verificar se o usuário é um estabelecimento.
 * Deve ser usado *depois* do authenticateToken.
 */
export const isEstabelecimento = (req, res, next) => {
	if (req.user && req.user.tipo === 'estabelecimento') {
		next();
	} else {
		// 403 Forbidden - Permissão insuficiente
		return res
			.status(403)
			.json({ message: 'Acesso restrito a estabelecimentos.' });
	}
};

/**
 * Middleware opcional para verificar se o usuário é um cliente.
 * Deve ser usado *depois* do authenticateToken.
 */
export const isCliente = (req, res, next) => {
	if (req.user && req.user.tipo === 'cliente') {
		next();
	} else {
		// 403 Forbidden - Permissão insuficiente
		return res.status(403).json({ message: 'Acesso restrito a clientes.' });
	}
};
