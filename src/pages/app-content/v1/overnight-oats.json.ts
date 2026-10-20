import type { APIRoute } from 'astro';
import { overnightOatsDocument, stableStringify } from '../../../lib/content-api/payloads';

export const GET: APIRoute = async () => {
	const body = stableStringify(await overnightOatsDocument());
	return new Response(body, {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'public, max-age=300',
		},
	});
};
