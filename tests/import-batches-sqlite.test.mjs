import assert from 'node:assert/strict';
import test from 'node:test';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { importBatches, openTableDatabase, readBatchFiles, tableNames } from '../scripts/import-batches-sqlite.mjs';

const here = dirname(fileURLToPath(import.meta.url));
// 欄位比對只用測試專用的固定批次；真實批次改內容不會讓測試失敗。
const fixturesDir = join(here, 'fixtures', 'batches');
const batchesDir = join(here, '..', 'src', 'content', 'batches');

function openMemoryDatabases() {
	return Object.fromEntries(tableNames.map((tableName) => [tableName, openTableDatabase(':memory:', tableName)]));
}

function importInto(dir) {
	const batches = readBatchFiles(dir);
	const databases = openMemoryDatabases();
	importBatches(databases, batches);
	return { batches, databases };
}

function closeAll(databases) {
	for (const db of Object.values(databases)) db.close();
}

test('新菌粉批次的欄位、食材、照片都寫得進 SQLite', () => {
	const { databases } = importInto(fixturesDir);

	const batch = databases.batches.prepare('SELECT * FROM batches WHERE id = ?').get('t001-20260101');
	assert.equal(batch.date, '2026-01-01');
	assert.equal(batch.title_en, 'Test batch: new powder');
	assert.equal(batch.equipment_device, '優格機');
	assert.equal(batch.equipment_vessel, '玻璃罐');
	assert.equal(batch.culture_name, '測試菌粉');
	assert.equal(batch.culture_source, 'new-powder');
	assert.equal(batch.culture_generation, null);
	assert.equal(batch.result_set, '8/10');
	assert.equal(batch.result_texture, '7/10');
	assert.equal(batch.result_acidity, '3/10');
	assert.equal(batch.draft, 0);

	const ingredients = databases.batch_ingredients
		.prepare('SELECT type, brand, amount FROM batch_ingredients WHERE batch_id = ? ORDER BY position')
		.all('t001-20260101');
	assert.deepEqual(
		ingredients.map((row) => ({ ...row })),
		[
			{ type: 'fresh-milk', brand: '測試鮮奶', amount: '400ml' },
			{ type: 'milk-powder', brand: '測試奶粉', amount: '40ml' },
			{ type: 'water', brand: null, amount: '260ml' },
		],
	);

	const photos = databases.batch_photos
		.prepare('SELECT path FROM batch_photos WHERE batch_id = ? ORDER BY position')
		.all('t001-20260101');
	assert.deepEqual(
		photos.map((row) => row.path),
		['batches/t001/01.png', 'batches/t001/02.png'],
	);
	closeAll(databases);
});

test('傳代批次的代數、草稿、缺漏欄位寫得進 SQLite', () => {
	const { databases } = importInto(fixturesDir);

	const batch = databases.batches.prepare('SELECT * FROM batches WHERE id = ?').get('t002-20260102');
	assert.equal(batch.culture_source, 'mother');
	assert.equal(batch.culture_amount, '60ml');
	assert.equal(batch.culture_generation, 2);
	assert.equal(batch.title_en, null);
	assert.equal(batch.equipment_device, null);
	assert.equal(batch.result_texture, null);
	assert.equal(batch.draft, 1);

	const photoCount = databases.batch_photos
		.prepare('SELECT COUNT(*) AS n FROM batch_photos WHERE batch_id = ?')
		.get('t002-20260102').n;
	assert.equal(photoCount, 0);
	closeAll(databases);
});

test('所有真實批次都匯入得了，筆數對得上', () => {
	const { batches, databases } = importInto(batchesDir);

	const count = (db, table) => databases[db].prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n;
	const ingredientTotal = batches.reduce((sum, { data }) => sum + (data.ingredients ?? []).length, 0);
	const photoTotal = batches.reduce((sum, { data }) => sum + (data.photos ?? []).length, 0);

	assert.ok(batches.length > 0);
	assert.equal(count('batches', 'batches'), batches.length);
	assert.equal(count('batch_ingredients', 'batch_ingredients'), ingredientTotal);
	assert.equal(count('batch_photos', 'batch_photos'), photoTotal);
	closeAll(databases);
});

test('每個檔只有一張表，表名與檔名相同', () => {
	const databases = openMemoryDatabases();
	for (const tableName of tableNames) {
		const tables = databases[tableName].prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
		assert.deepEqual(
			tables.map((row) => row.name),
			[tableName],
		);
	}
	closeAll(databases);
});
