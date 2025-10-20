import { Geist, Geist_Mono } from 'next/font/google';
import { PropsWithChildren } from '@/types';
import { metadata as appMetadata } from '@/config';
import { sidebarInitScript, themeInitScript } from '@/lib/scripts';
import Providers from '@/components/Providers';
import '@/styles/globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata = appMetadata;

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: themeInitScript + sidebarInitScript,
					}}
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable}`}
				suppressHydrationWarning
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
