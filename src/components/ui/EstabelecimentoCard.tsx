/**
 * Card de Estabelecimento
 */

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Clock } from 'lucide-react';
import type { Estabelecimento } from '@/types';

interface EstabelecimentoCardProps {
	estabelecimento: Estabelecimento;
}

export function EstabelecimentoCard({
	estabelecimento,
}: EstabelecimentoCardProps) {
	const { id, nome, endereco, avaliacao, imagem } = estabelecimento;

	// Some type definitions in the repo use camelCase (horarioFuncionamento)
	// while others use snake_case (horario_funcionamento). Read both
	// defensively to avoid TypeScript mismatches and runtime issues.
	const _est = estabelecimento as unknown as Record<string, unknown>;
	const horario =
		typeof _est.horarioFuncionamento === 'string'
			? (_est.horarioFuncionamento as string)
			: typeof _est.horario_funcionamento === 'string'
			? (_est.horario_funcionamento as string)
			: 'Horário não disponível';

	return (
		<Link
			href={`/Agendar/${id}`}
			className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
		>
			{/* Imagem */}
			<div className="relative h-48 bg-gray-200 dark:bg-gray-700">
				{imagem ? (
					// Use unoptimized to bypass Next.js image loader for external URLs that may block optimization
					<Image
						src={imagem}
						alt={nome}
						fill
						className="object-cover"
						unoptimized
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-gray-400">
						Sem imagem
					</div>
				)}
				{/* Fallback absolute img for cases where next/image still fails in development */}
				<style jsx>{`
					.fallback-img {
						display: none;
					}
				`}</style>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={imagem}
					alt={nome}
					className="fallback-img absolute inset-0 w-full h-full object-cover"
					onError={(e) => {
						// If next/image fails, show the raw img by removing display none
						const el = e.currentTarget as HTMLImageElement;
						el.style.display = 'block';
					}}
				/>
			</div>

			{/* Conteúdo */}
			<div className="p-4">
				{/* Nome */}
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
					{nome}
				</h3>

				{/* Avaliação */}
				<div className="flex items-center gap-1 mb-3">
					<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
					<span className="text-sm font-medium text-gray-900 dark:text-white">
						{avaliacao ? avaliacao.toFixed(1) : '0.0'}
					</span>
				</div>

				{/* Endereço */}
				<div className="flex items-start gap-2 mb-2">
					<MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{endereco}
					</p>
				</div>

				{/* Horário */}
				<div className="flex items-center gap-2">
					<Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{horario}
					</p>
				</div>
			</div>
		</Link>
	);
}
