import type { APIRoute } from 'astro';

// 部署檢查用：記下這次建置的 commit。Cloudflare Workers Builds 帶 WORKERS_CI_COMMIT_SHA，GitHub Actions 帶 GITHUB_SHA。
export const GET: APIRoute = () => {
	const commit = process.env.WORKERS_CI_COMMIT_SHA ?? process.env.GITHUB_SHA ?? '';
	return new Response(JSON.stringify({ commit }), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
};
