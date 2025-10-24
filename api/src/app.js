import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import allRoutes from './routes/index.js';
import { initDb } from './database.js';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Inicializa o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares essenciais
app.use(cors()); // Habilita o CORS para permitir requisições do frontend
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota principal da API
app.use('/api', allRoutes);

// Rota de "saúde" para verificar se a API está online
app.get('/', (req, res) => {
	res.status(200).json({ message: 'API do AgendaAi está funcional!' });
});

// Inicializa o servidor
app.listen(PORT, async () => {
	try {
		// Tenta inicializar o banco de dados (criar tabelas se não existirem)
		// O script `npm run setup` é a forma preferida de fazer isso
		await initDb();
		console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
	} catch (error) {
		console.error(
			'Erro ao conectar ou inicializar o banco de dados:',
			error
		);
		process.exit(1); // Encerra o processo se o DB falhar
	}
});
