import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const gitignorePath = join(root, '.gitignore');

if (!existsSync(gitignorePath)) {
	console.error('[❌] .gitignore 不存在');
	process.exit(1);
}

const text = readFileSync(gitignorePath, 'utf8');
const missing = [];

function has(pattern) {
	return text.split(/\r?\n/).some((line) => {
		const trimmed = line.replace(/#.*$/, '').trim();
		return trimmed === pattern || trimmed === pattern.replace(/\/$/, '');
	});
}

const required = [
	['.env', ['.env']],
	['node_modules/', ['node_modules/', 'node_modules']],
	['.astro/', ['.astro/', '.astro']],
	['dist/', ['dist/', 'dist']],
	['*.jks', ['*.jks']],
	['*.keystore', ['*.keystore']],
];

for (const [label, options] of required) {
	if (!options.some((opt) => has(opt))) missing.push(label);
}

const hasCursor = has('.cursor/') || has('.cursor');
if (!hasCursor) missing.push('.cursor/');

if (missing.length) {
	console.error('[❌] .gitignore 缺少：');
	for (const item of missing) console.error(`  - ${item}`);
	process.exit(1);
}

console.log('[✅] .gitignore 檢查通過');
