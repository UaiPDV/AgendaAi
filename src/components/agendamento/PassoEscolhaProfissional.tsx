/**
 * Passo 1: Escolha do Profissional
 */

import type { Profissional } from '@/types';
import { User, ChevronRight } from 'lucide-react';

interface PassoEscolhaProfissionalProps {
	profissionais: Profissional[];
	onSelecionar: (profissional: Profissional) => void;
}

export function PassoEscolhaProfissional({
	profissionais,
	onSelecionar,
}: PassoEscolhaProfissionalProps) {
	return (
		<div>
			<h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
				Passo 1: Escolha o profissional
			</h3>

			{profissionais.length === 0 ? (
				<p className="text-gray-600 dark:text-gray-400">
					Nenhum profissional disponível
				</p>
			) : (
				<div className="space-y-3">
					{profissionais.map((profissional) => (
						<button
							key={profissional.id}
							onClick={() => onSelecionar(profissional)}
							className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all group"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
									<User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
								</div>
								<div className="text-left">
									<p className="font-medium text-gray-900 dark:text-white">
										{profissional.nome}
									</p>
									{profissional.especialidades &&
										profissional.especialidades.length >
											0 && (
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{profissional.especialidades.join(
													', '
												)}
											</p>
										)}
								</div>
							</div>
							<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
						</button>
					))}
				</div>
			)}
		</div>
	);
}
