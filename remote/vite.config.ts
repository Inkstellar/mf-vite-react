import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'fs';
import { defineConfig, loadEnv } from 'vite';

// Load package.json using require (works in Vite config context)
const { dependencies } = require('./package.json');

export default defineConfig(({ mode }) => {
	const selfEnv = loadEnv(mode, process.cwd());
	return {
		server: {
			fs: {
				allow: ['.', '../shared'],
			},
		},
		build: {
			target: 'chrome89',
		},
		plugins: [
			{
				name: 'generate-environment',
				options: function () {
					console.info('selfEnv', selfEnv);
					writeFileSync('./src/environment.ts', `export default ${JSON.stringify(selfEnv, null, 2)};`);
				},
			},
			federation({
				filename: 'remoteEntry.js',
				name: 'remote',
				exposes: {
					'./Services': './src/pages/Services.tsx',
					'./Portfolio': './src/pages/Portfolio.tsx',
					'./Users': './src/pages/Users.tsx',
					'./config': './src/config/navigation.ts',
				},
				remotes: {},
				shared: {
					react: {
						requiredVersion: dependencies.react,
						singleton: true,
					},
					'react-router-dom': {
						requiredVersion: dependencies.react,
						singleton: true,
					},
				},
			}),
			react(),
		],
	};
});
