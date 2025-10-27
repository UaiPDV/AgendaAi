import Link from 'next/link';
import {
	LayoutDashboard,
	Calendar,
	History,
	Briefcase,
	Users,
	UserCog,
	Store,
	BarChart3,
	Settings,
	ChevronRight,
	Home,
	Package,
	TrendingDown,
	TrendingUp,
	LineChart,
	User,
} from 'lucide-react';

export default function MenuEstabelecimentoPage() {
	return (
		<div className="p-4 sm:p-6 md:p-10">
			<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
				Menu
			</h2>
			<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
				Gerencie seu estabelecimento
			</p>

			{/* Principal */}
			<div className="mt-6">
				<h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
					<Home className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
					Principal
				</h3>
				<div className="space-y-2">
					<Link
						href="/estabelecimento/dashboard"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
							<LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Dashboard
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Visão geral do negócio
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/estabelecimento/agenda"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
							<Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Agenda
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Agendamentos de hoje e futuros
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/estabelecimento/historico"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
							<History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Histórico
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Agendamentos passados
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>
				</div>
			</div>

			{/* Gerenciamento */}
			<div className="mt-8">
				<h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
					<Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
					Gerenciamento
				</h3>
				<div className="space-y-2">
					<Link
						href="/estabelecimento/servicos"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mr-3">
							<Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Serviços
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Gerencie seus serviços
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/estabelecimento/produtos"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3">
							<Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Produtos
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Gerencie seus produtos
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/estabelecimento/profissionais"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mr-3">
							<Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Profissionais
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Gerencie sua equipe
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/estabelecimento/clientes"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mr-3">
							<UserCog className="w-5 h-5 text-pink-600 dark:text-pink-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Clientes
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Visualize seus clientes
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/estabelecimento/config"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
							<Store className="w-5 h-5 text-purple-600 dark:text-purple-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Config. Estabelecimento
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Horários e bloqueios
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>
				</div>
			</div>

			{/* Financeiro */}
			<div className="mt-8">
				<h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
					<BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
					Financeiro
				</h3>
				<div className="space-y-2">
					<Link
						href="/estabelecimento/contas-receber"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
							<TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Receitas
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Contas a receber
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/estabelecimento/contas-pagar"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-3">
							<TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Despesas
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Contas a pagar
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/estabelecimento/financeiro"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
							<LineChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Receita vs Despesa
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Comparação financeira
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>

					<Link
						href="/estabelecimento/relatorios"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
							<BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Relatórios
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Análises e estatísticas
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>
				</div>
			</div>

			{/* Outros */}
			<div className="mt-8 mb-6">
				<h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
					<Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
					Outros
				</h3>
				<div className="space-y-2">
					<Link
						href="/estabelecimento/configuracoes"
						className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
							<Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
								Configurações
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Ajustes gerais da conta
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-gray-400" />
					</Link>
				</div>
			</div>

			{/* Link para Área do Cliente */}
			<div className="mt-8 mb-6">
				<Link
					href="/Agendar"
					className="block bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
				>
					<div className="flex items-center">
						<User className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
						<div className="flex-1">
							<p className="font-semibold text-blue-900 dark:text-blue-200">
								Área do Cliente
							</p>
							<p className="text-sm text-blue-700 dark:text-blue-300">
								Agendar serviços
							</p>
						</div>
						<ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
					</div>
				</Link>
			</div>
		</div>
	);
}
