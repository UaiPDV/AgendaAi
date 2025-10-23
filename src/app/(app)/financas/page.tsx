'use client';

/**
 * Página Finanças - Resumo financeiro e transações
 */

import { useFinancas } from '@/hooks';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';
import {
	DollarSign,
	TrendingUp,
	Clock,
	CheckCircle,
	XCircle,
} from 'lucide-react';

export default function FinancasPage() {
	const { transacoes, resumo, loading, error } = useFinancas();

	const formatarData = (dataStr: string) => {
		const [ano, mes, dia] = dataStr.split('-');
		return `${dia}/${mes}/${ano}`;
	};

	const statusIcons = {
		pago: <CheckCircle className="w-5 h-5 text-green-500" />,
		pendente: <Clock className="w-5 h-5 text-yellow-500" />,
		cancelado: <XCircle className="w-5 h-5 text-red-500" />,
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			{/* Header */}
			<div className="max-w-7xl mx-auto mb-8">
				<div className="flex items-center gap-3 mb-2">
					<DollarSign className="w-8 h-8 text-emerald-500" />
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Minhas Finanças
					</h1>
				</div>
				<p className="text-gray-600 dark:text-gray-400">
					Acompanhe seus gastos e pagamentos
				</p>
			</div>

			{/* Loading State */}
			{loading && <LoadingSpinner />}

			{/* Error State */}
			{error && <ErrorMessage message={error} />}

			{/* Conteúdo */}
			{!loading && !error && resumo && (
				<div className="max-w-7xl mx-auto space-y-6">
					{/* Cards de Resumo */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Gasto do Mês */}
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
							<div className="flex items-center gap-3 mb-2">
								<TrendingUp className="w-6 h-6 text-blue-500" />
								<h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Gasto do Mês
								</h3>
							</div>
							<p className="text-3xl font-bold text-gray-900 dark:text-white">
								R$ {resumo.gastoMes.toFixed(2)}
							</p>
						</div>

						{/* Pendente */}
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
							<div className="flex items-center gap-3 mb-2">
								<Clock className="w-6 h-6 text-yellow-500" />
								<h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Pendente
								</h3>
							</div>
							<p className="text-3xl font-bold text-gray-900 dark:text-white">
								R$ {resumo.gastoPendente.toFixed(2)}
							</p>
						</div>

						{/* Próximo Pagamento */}
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
							<div className="flex items-center gap-3 mb-2">
								<DollarSign className="w-6 h-6 text-emerald-500" />
								<h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Próximo Pagamento
								</h3>
							</div>
							<p className="text-3xl font-bold text-gray-900 dark:text-white">
								R$ {resumo.proximoPagamento.valor.toFixed(2)}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
								{formatarData(resumo.proximoPagamento.data)}
							</p>
						</div>
					</div>

					{/* Lista de Transações */}
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							Histórico de Transações
						</h2>

						{transacoes.length === 0 ? (
							<p className="text-center text-gray-600 dark:text-gray-400 py-8">
								Nenhuma transação encontrada
							</p>
						) : (
							<div className="space-y-4">
								{transacoes.map((transacao) => (
									<div
										key={transacao.id}
										className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
									>
										<div className="flex items-center gap-4">
											{statusIcons[transacao.status]}
											<div>
												<p className="font-medium text-gray-900 dark:text-white">
													{transacao.descricao}
												</p>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{formatarData(
														transacao.data
													)}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold text-gray-900 dark:text-white">
												R$ {transacao.valor.toFixed(2)}
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
												{transacao.status}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
