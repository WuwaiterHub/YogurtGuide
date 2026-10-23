// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// 正式網址是 Cloudflare 自訂網域。GitHub Pages 仍放在 /YogurtGuide/ 底下，頁面 canonical 指回正式網址。
// Cloudflare Workers Builds 會注入 WORKERS_CI=1。base 結尾必須有 `/`。
const officialSite = 'https://yogurtguide.wuwaiter.com';
// App 版（Capacitor）由 scripts/build-app.mjs 設 CAP_BUILD=1，網站放在 App 的根目錄，base 也是 `/`。
const onCloudflare = process.env.WORKERS_CI === '1';
const forApp = process.env.CAP_BUILD === '1';

export default defineConfig({
	site: officialSite,
	base: onCloudflare || forApp ? '/' : '/YogurtGuide/',
	integrations: onCloudflare ? [sitemap()] : [],
});
