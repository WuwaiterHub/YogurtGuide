// App 版建置：base 改成 `/`、輸出到 dist-app，再把站內「資料夾式」連結改成明確的 index.html。
// Capacitor 的本機伺服器不會把 `/powders/` 對到 `/powders/index.html`（預設會全部導回首頁），所以要改寫。
//
// 參數（可同時給）：
//   --sync     同步到 android/
//   --debug    同步後出 debug APK
//   --bundle   同步後出上架用 AAB（要先有 android/key.properties）
//   --publish  把 dist-app 壓成 Live Update 網頁包，放進網站的 dist/app-bundle/（要先跑過網站的 npm run build）
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { zipSync } from 'fflate';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const appDir = join(root, 'dist-app');
const siteDir = join(root, 'dist');
const androidDir = join(root, 'android');
const officialOrigin = 'https://yogurtguide.wuwaiter.com';

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

function listFiles(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? listFiles(path) : [path];
	});
}

/** 從 src/config/platforms.ts 讀 nativeBuild，避免兩邊各寫一份。 */
function readNativeBuild() {
	const text = readFileSync(join(root, 'src', 'config', 'platforms.ts'), 'utf8');
	const match = text.match(/nativeBuild:\s*(\d+)/);
	if (!match) throw new Error('platforms.ts 找不到 nativeBuild');
	return Number(match[1]);
}

function buildAppSite() {
	run('npx astro build', { env: { CAP_BUILD: '1' } });
	let changed = 0;
	for (const file of listFiles(appDir).filter((path) => path.endsWith('.html'))) {
		const before = readFileSync(file, 'utf8');
		const after = rewriteDirectoryLinks(before);
		if (after !== before) {
			writeFileSync(file, after);
			changed++;
		}
	}
	console.log(`[app] 改寫 ${changed} 個 HTML 的站內連結`);
}

/** 把 dist-app 壓成 zip（index.html 在 zip 根目錄），寫到 dist/app-bundle/，並產生 latest.json。 */
function publishBundle() {
	if (!existsSync(siteDir)) {
		console.error('[app] 找不到 dist/，請先跑網站的 npm run build。');
		process.exit(1);
	}
	const commit = process.env.WORKERS_CI_COMMIT_SHA ?? process.env.GITHUB_SHA ?? '';
	const bundleId = commit || `local-${Date.now()}`;

	const entries = {};
	for (const file of listFiles(appDir)) {
		entries[relative(appDir, file).split(sep).join('/')] = readFileSync(file);
	}
	const zip = zipSync(entries, { level: 9 });
	const checksum = createHash('sha256').update(zip).digest('hex');

	const outDir = join(siteDir, 'app-bundle');
	rmSync(outDir, { recursive: true, force: true });
	mkdirSync(outDir, { recursive: true });
	const zipName = `${bundleId}.zip`;
	writeFileSync(join(outDir, zipName), zip);
	writeFileSync(
		join(outDir, 'latest.json'),
		JSON.stringify({
			bundleId,
			url: `${officialOrigin}/app-bundle/${zipName}`,
			checksum,
			minNativeBuild: readNativeBuild(),
		}),
	);
	console.log(`[app] 網頁包 ${zipName}：${(zip.length / 1024 / 1024).toFixed(1)} MB`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const flags = new Set(process.argv.slice(2));
	buildAppSite();

	if (flags.has('--publish')) publishBundle();

	if (flags.has('--sync') || flags.has('--debug') || flags.has('--bundle')) {
		run('npx cap sync android');
		// Windows 不一定會從目前資料夾找執行檔，所以用完整路徑呼叫 gradlew。
		const gradlew = `"${join(androidDir, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew')}"`;
		if (flags.has('--debug')) run(`${gradlew} assembleDebug`, { cwd: androidDir });
		if (flags.has('--bundle')) {
			if (!existsSync(join(androidDir, 'key.properties'))) {
				console.error('[app] 缺 android/key.properties，AAB 無法簽章。範本見 android/key.properties.example。');
				process.exit(1);
			}
			run(`${gradlew} bundleRelease`, { cwd: androidDir });
		}
	}
}
