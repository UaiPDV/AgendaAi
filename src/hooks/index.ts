/**
 * Exportação central de todos os hooks customizados
 */

// Hooks de Domínio (Business Logic)
export { useTheme } from './useTheme';
export { useSidebar } from './useSidebar';
export { useAuth, useAuthRedirect } from './useAuth';
export { useAuthentication } from './useAuthentication';
export { useIsClient } from './useIsClient';
export { useEstabelecimentos, useEstabelecimento } from './useEstabelecimentos';
export { useEstabelecimentoLogado } from './useEstabelecimentoLogado';
export { useAgendamentos } from './useAgendamentos';
export { useFinancas } from './useFinancas';
export { useRelatorios } from './useRelatorios';
export { usePagamentos } from './usePagamentos';
export { useUsuario } from './useUsuario';
export { useAvaliacoes } from './useAvaliacoes';
export { useServicos } from './useServicos';
export { useProfissionais } from './useProfissionais';
export { useClientes } from './useClientes';
export { useConfig } from './useConfig';
export { useDashboardMetrics } from './useDashboardMetrics';

// Hooks Financeiros
export { useProdutos } from './useProdutos';
export { useContasPagar } from './useContasPagar';
export { useContasReceber } from './useContasReceber';

// Hooks Utilitários (Helpers)
export { useSuccessToast } from './useSuccessToast';
export { useFilter, useFilteredData } from './useFilter';
export { useSearch } from './useSearch';
export { useForm } from './useForm';
