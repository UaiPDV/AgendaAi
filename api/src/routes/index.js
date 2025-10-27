import { Router } from 'express';
import authRoutes from './auth.js';
import usuarioRoutes from './usuarios.js';
import estabelecimentoRoutes from './estabelecimentos.js';
import agendamentoRoutes from './agendamentos.js';
import servicoRoutes from './servicos.js';
import profissionalRoutes from './profissionais.js';
import configuracoesRoutes from './configuracoes.js';
import clienteRoutes from './clientes.js';
import avaliacaoRoutes from './avaliacoes.js';
import dashboardRoutes from './dashboard.js';
import relatorioRoutes from './relatorios.js';
import financasRoutes from './financas.js';
import produtosRoutes from './produtos.js';
import contasPagarRoutes from './contas-pagar.js';
import contasReceberRoutes from './contas-receber.js';

const router = Router();

// Agrupa todas as rotas da API
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/estabelecimentos', estabelecimentoRoutes);
router.use('/agendamentos', agendamentoRoutes);
router.use('/configuracoes', configuracoesRoutes);

// Rotas CUD específicas
router.use('/servicos', servicoRoutes);
router.use('/profissionais', profissionalRoutes);
router.use('/clientes', clienteRoutes);
router.use('/produtos', produtosRoutes);

// Rotas financeiras
router.use('/financas', financasRoutes);
router.use('/contas-pagar', contasPagarRoutes);
router.use('/contas-receber', contasReceberRoutes);

// Novas rotas modulares
router.use('/avaliacoes', avaliacaoRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/relatorios', relatorioRoutes);

export default router;
