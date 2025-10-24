import { DollarSign, TrendingUp, Clock } from 'lucide-react';
import { StatCard } from '@/components/ui/app';
import { formatarMoeda, formatarData } from '@/lib/utils/formatters';
import type { ResumoFinanceiro } from '@/types';

interface FinancasStatsProps {
	resumo: ResumoFinanceiro;
}

export function FinancasStats({ resumo }: FinancasStatsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<StatCard
				icon={TrendingUp}
				iconColor="text-blue-500"
				label="Gasto do Mês"
				value={formatarMoeda(resumo.gastoMes)}
			/>

			<StatCard
				icon={Clock}
				iconColor="text-yellow-500"
				label="Pendente"
				value={formatarMoeda(resumo.gastoPendente)}
			/>

			<StatCard
				icon={DollarSign}
				iconColor="text-emerald-500"
				label="Próximo Pagamento"
				value={formatarMoeda(resumo.proximoPagamento.valor)}
				subtitle={
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{formatarData(resumo.proximoPagamento.data)}
					</p>
				}
			/>
		</div>
	);
}
