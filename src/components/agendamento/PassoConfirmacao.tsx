/**
 * Passo 3: Confirmação do Agendamento
 */

import type { Servico, Profissional } from '@/types';
import { ChevronLeft, Calendar, Clock, User, DollarSign } from 'lucide-react';

interface PassoConfirmacaoProps {
	servico: Servico;
	profissional: Profissional;
	data: string;
	horario: string;
	onConfirmar: () => void;
	onVoltar: () => void;
}

export function PassoConfirmacao({
	servico,
	profissional,
	data,
	horario,
	onConfirmar,
	onVoltar,
}: PassoConfirmacaoProps) {
	return (
		<div>
			<h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
				Passo 3: Confirme seu agendamento
			</h3>

			<div className="bg-gray-50 dark:bg-gray-900 border-l-4 border-gray-800 dark:border-gray-600 rounded-r-lg p-6 space-y-4">
				<div className="flex items-start gap-3">
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
						<Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
					</div>
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Serviço
						</p>
						<p className="font-semibold text-gray-900 dark:text-white">
							{servico.nome}
						</p>
						{servico.descricao && (
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
								{servico.descricao}
							</p>
						)}
					</div>
				</div>

				<div className="flex items-start gap-3">
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
						<User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
					</div>
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Profissional
						</p>
						<p className="font-semibold text-gray-900 dark:text-white">
							{profissional.nome}
						</p>
					</div>
				</div>

				<div className="flex items-start gap-3">
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
						<Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
					</div>
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Data
						</p>
						<p className="font-semibold text-gray-900 dark:text-white">
							{data}
						</p>
					</div>
				</div>

				<div className="flex items-start gap-3">
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
						<Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
					</div>
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Horário
						</p>
						<p className="font-semibold text-gray-900 dark:text-white">
							{horario}
						</p>
					</div>
				</div>

				<div className="flex items-start gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
					<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
						<DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
					</div>
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Preço
						</p>
						<p className="text-2xl font-bold text-gray-900 dark:text-white">
							R$ {servico.preco}
						</p>
					</div>
				</div>
			</div>

			{/* Botões de Navegação */}
			<div className="mt-6 flex justify-between items-center">
				<button
					onClick={onVoltar}
					className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2"
				>
					<ChevronLeft className="w-4 h-4" />
					Voltar
				</button>
				<button
					onClick={onConfirmar}
					className="bg-gray-800 dark:bg-gray-700 text-white font-semibold px-8 py-3 rounded-md hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
				>
					Confirmar Agendamento
				</button>
			</div>
		</div>
	);
}
