import { Router } from 'express';
import authRoutes from './auth.js';
import usuarioRoutes from './usuarios.js';
import estabelecimentoRoutes from './estabelecimentos.js';
import agendamentoRoutes from './agendamentos.js';
import servicoRoutes from './servicos.js';
import profissionalRoutes from './profissionais.js';
import configuracoesRoutes from './configuracoes.js';
import clienteRoutes from './clientes.js';

const router = Router();

// Agrupa todas as rotas da API
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/estabelecimentos', estabelecimentoRoutes);
router.use('/agendamentos', agendamentoRoutes);
router.use('/configuracoes', configuracoesRoutes);

// Rotas para CUD de serviços, profissionais e clientes (GET é feito por /estabelecimentos/:id/...)
router.use('/servicos', servicoRoutes);
router.use('/profissionais', profissionalRoutes);
router.use('/clientes', clienteRoutes);

export default router;
