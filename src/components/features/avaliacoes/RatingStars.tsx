import { Star } from 'lucide-react';
import { RATING_OPTIONS } from '@/constants/app';

interface RatingStarsProps {
	rating: number;
	onRatingChange?: (rating: number) => void;
	readonly?: boolean;
	size?: 'sm' | 'md' | 'lg';
}

export function RatingStars({
	rating,
	onRatingChange,
	readonly = false,
	size = 'md',
}: RatingStarsProps) {
	const sizes = {
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-8 h-8',
	};

	return (
		<div className="flex items-center gap-1">
			{RATING_OPTIONS.map((star) => {
				const isActive = star <= rating;

				if (readonly) {
					return (
						<Star
							key={star}
							className={`${sizes[size]} ${
								isActive
									? 'fill-amber-400 text-amber-400'
									: 'text-gray-300 dark:text-gray-600'
							}`}
						/>
					);
				}

				return (
					<button
						key={star}
						type="button"
						onClick={() => onRatingChange?.(star)}
						className="transition-transform hover:scale-110"
					>
						<Star
							className={`${sizes[size]} ${
								isActive
									? 'fill-amber-400 text-amber-400'
									: 'text-gray-300 dark:text-gray-600'
							}`}
						/>
					</button>
				);
			})}
		</div>
	);
}
