import Link from 'next/link';
import {
	Calendar,
	Receipt,
	History,
	UserCircle,
	Wallet,
	CreditCard,
	Bell,
	Star,
	Settings,
	Store,
	ChevronRight,
} from 'lucide-react';

export default function MenuPage() {
	return (
		<div className="p-4 sm:p-6 md:p-10">
			<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
				Menu
			</h2>
			<p className="mt-1 text-gray-500 dark:text-gray-400">
				Acesse todas as funcionalidades
			</p>

			{/* Ações Rápidas */}
			<div className="mt-8">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
					Ações Rápidas
				</h3>
				<div className="grid grid-cols-2 gap-3 sm:gap-4">
					<Link
						href="/Agendar"
						className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center"
					>
						<Calendar className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
						<span className="text-sm sm:text-base font-medium">
							Agendar
						</span>
					</Link>
					<Link
						href="/agendamentos"
						className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex flex-col items-center justify-center text-center"
					>
						<Receipt className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-gray-700 dark:text-gray-300" />
						<span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
							Agendamentos
						</span>
					</Link>
					<Link
						href="/financas"
						className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex flex-col items-center justify-center text-center"
					>
						<Wallet className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-gray-700 dark:text-gray-300" />
						<span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
							Finanças
						</span>
					</Link>
					<Link
						href="/dados"
						className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex flex-col items-center justify-center text-center"
					>
						<UserCircle className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-gray-700 dark:text-gray-300" />
						<span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
							Meus Dados
						</span>
					</Link>
				</div>
			</div>

			{/* Todas as Páginas */}
			<div className="mt-10">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
					Todas as Páginas
				</h3>
				<div className="space-y-3">
					<Link
						href="/Agendar"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
							<Calendar className="w-5 h-5 text-gray-700 dark:text-gray-300" />
						</div>
						<div className="flex-1">
							<p className="font-semibold text-gray-800 dark:text-gray-200">
								Agendar Serviço
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Escolha e reserve horários
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/agendamentos"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
							<Receipt className="w-5 h-5 text-gray-700 dark:text-gray-300" />
						</div>
						<div className="flex-1">
							<p className="font-semibold text-gray-800 dark:text-gray-200">
								Meus Agendamentos
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Acompanhe seus horários
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/historico"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
							<History className="w-5 h-5 text-gray-700 dark:text-gray-300" />
						</div>
						<div className="flex-1">
							<p className="font-semibold text-gray-800 dark:text-gray-200">
								Histórico
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Serviços anteriores
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/dados"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
							<UserCircle className="w-5 h-5 text-gray-700 dark:text-gray-300" />
						</div>
						<div className="flex-1">
							<p className="font-semibold text-gray-800 dark:text-gray-200">
								Meus Dados
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Informações pessoais
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/financas"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
							<Wallet className="w-5 h-5 text-gray-700 dark:text-gray-300" />
						</div>
						<div className="flex-1">
							<p className="font-semibold text-gray-800 dark:text-gray-200">
								Minhas Finanças
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Gastos e pagamentos
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/pagamentos"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
							<CreditCard className="w-5 h-5 text-gray-700 dark:text-gray-300" />
						</div>
						<div className="flex-1">
							<p className="font-semibold text-gray-800 dark:text-gray-200">
								Formas de Pagamento
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Métodos de pagamento
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/notificacoes"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
							<Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
						</div>
						<div className="flex-1">
							<p className="font-semibold text-gray-800 dark:text-gray-200">
								Notificações
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Preferências de avisos
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/avaliacoes"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
							<Star className="w-5 h-5 text-gray-700 dark:text-gray-300" />
						</div>
						<div className="flex-1">
							<p className="font-semibold text-gray-800 dark:text-gray-200">
								Avaliações
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Avalie os serviços
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/configuracoes"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
							<Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
						</div>
						<div className="flex-1">
							<p className="font-semibold text-gray-800 dark:text-gray-200">
								Configurações
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Ajustes da conta
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>
				</div>
			</div>

			{/* Link para Estabelecimento */}
			<div className="mt-8 mb-6">
				<Link
					href="/estabelecimento"
					className="block bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
				>
					<div className="flex items-center">
						<Store className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
						<div className="flex-1">
							<p className="font-semibold text-blue-900 dark:text-blue-200">
								Área do Estabelecimento
							</p>
							<p className="text-sm text-blue-700 dark:text-blue-300">
								Gerencie seu negócio
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
					</div>
				</Link>
			</div>
		</div>
	);
}
