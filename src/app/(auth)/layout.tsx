import { PropsWithChildren } from '@/types';

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
			<div className="w-full max-w-md">{children}</div>
		</div>
	);
}
