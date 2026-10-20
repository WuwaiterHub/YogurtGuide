import type { APIRoute } from 'astro';
import { contentFiles, sha256, stableStringify } from '../../../lib/content-api/payloads';

export const GET: APIRoute = async () => {
	const files = await contentFiles();
	const body = stableStringify({
		schemaVersion: 1,
		contentRevision: sha256(files.map((file) => file.sha256).join('\n')),
		minAppVersion: '0',
		files: files.map(({ name, sha256: fileSha, bytes }) => ({
			name,
			sha256: fileSha,
			bytes,
		})),
	});
	return new Response(body, {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'public, max-age=60',
		},
	});
};
