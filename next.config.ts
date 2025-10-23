import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'placehold.co',
			},
			{
				protocol: 'https',
				hostname: 'via.placeholder.com',
			},
			{
				protocol: 'https',
				hostname: 'frizzar.com.br',
			},
			{
				protocol: 'https',
				hostname: 'dkfbh8idjneas.cloudfront.net',
			},
			{
				protocol: 'https',
				hostname: 'compraevendadeouro-rgaldi.com.br',
			},
		],
	},
};

export default nextConfig;
