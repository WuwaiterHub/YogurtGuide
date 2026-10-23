// App 版建置：base 改成 `/`，再把站內「資料夾式」連結改成明確的 index.html，最後同步到 android/。
// 加 --debug 出 debug APK，加 --bundle 出上架用 AAB（要先有 android/key.properties）。
// Capacitor 的本機伺服器不會把 `/powders/` 對到 `/powders/index.html`（預設會全部導回首頁），所以要改寫。
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');

function run(command, { cwd = root, env = {} } = {}) {
	const result = spawnSync(command, {
		cwd,
		stdio: 'inherit',
		shell: true,
		env: { ...process.env, ...env },
	});
	if (result.status !== 0) process.exit(result.status ?? 1);
}

/** 只改站內絕對路徑：href="/xxx/" 或 href="/xxx/#id" → href="/xxx/index.html"（保留 #id）。 */
export function rewriteDirectoryLinks(html) {
	return html.replace(/(href|src)="(\/[^"#?]*\/)((?:[?#][^"]*)?)"/g, (_, attr, path, rest) => {
		if (path.startsWith('//')) return `${attr}="${path}${rest}"`;
		return `${attr}="${path}index.html${rest}"`;
	});
}

function htmlFiles(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) return htmlFiles(path);
		return name.endsWith('.html') ? [path] : [];
	});
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	run('npx astro build', { env: { CAP_BUILD: '1' } });
	let changed = 0;
	for (const file of htmlFiles(distDir)) {
		const before = readFileSync(file, 'utf8');
		const after = rewriteDirectoryLinks(before);
		if (after !== before) {
			writeFileSync(file, after);
			changed++;
		}
	}
	console.log(`[app] 改寫 ${changed} 個 HTML 的站內連結`);
	run('npx cap sync android');

	// Windows 不一定會從目前資料夾找執行檔，所以用完整路徑呼叫 gradlew。
	const androidDir = join(root, 'android');
	const gradlew = `"${join(androidDir, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew')}"`;
	if (process.argv.includes('--debug')) run(`${gradlew} assembleDebug`, { cwd: androidDir });
	if (process.argv.includes('--bundle')) {
		if (!existsSync(join(androidDir, 'key.properties'))) {
			console.error('[app] 缺 android/key.properties，AAB 無法簽章。範本見 android/key.properties.example。');
			process.exit(1);
		}
		run(`${gradlew} bundleRelease`, { cwd: androidDir });
	}
}
