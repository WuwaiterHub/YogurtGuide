import assert from 'node:assert/strict';
import test from 'node:test';
import { rewriteDirectoryLinks } from '../scripts/build-app.mjs';

test('App 版把站內資料夾連結改成 index.html，其他連結不動', () => {
	const cases = [
		['<a href="/powders/">', '<a href="/powders/index.html">'],
		['<a href="/powders/#angel">', '<a href="/powders/index.html#angel">'],
		['<a href="/">', '<a href="/">'],
		['<a href="https://example.com/a/">', '<a href="https://example.com/a/">'],
		['<link href="/fonts/fonts.css">', '<link href="/fonts/fonts.css">'],
		['<a href="//cdn.example.com/x/">', '<a href="//cdn.example.com/x/">'],
	];
	for (const [input, expected] of cases) assert.equal(rewriteDirectoryLinks(input), expected);
});
