import { existsSync, readdirSync, readFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const tableNames = ['batches', 'batch_ingredients', 'batch_photos'];

export const tableSchemas = {
	batches: `
CREATE TABLE batches (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  date TEXT NOT NULL,
  ambient_temp_c TEXT,
  peak_heat_c TEXT,
  inoculation_temp_c TEXT,
  incubation_temp_c TEXT NOT NULL,
  incubation_time_h TEXT NOT NULL,
  equipment_device TEXT,
  equipment_vessel TEXT,
  equipment_note TEXT,
  culture_source TEXT NOT NULL,
  culture_name TEXT NOT NULL,
  culture_origin TEXT NOT NULL,
  culture_amount TEXT,
  culture_generation INTEGER,
  culture_id TEXT,
  method_id TEXT,
  result_set TEXT NOT NULL,
  result_texture TEXT,
  result_acidity TEXT,
  result_whey TEXT,
  result_flavor TEXT,
  result_overall TEXT,
  photo_album_url TEXT,
  draft INTEGER NOT NULL DEFAULT 0
);`,
	batch_ingredients: `
CREATE TABLE batch_ingredients (
  id INTEGER PRIMARY KEY,
  batch_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  type TEXT NOT NULL,
  brand TEXT,
  amount TEXT NOT NULL,
  note TEXT
);`,
	batch_photos: `
CREATE TABLE batch_photos (
  id INTEGER PRIMARY KEY,
  batch_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  path TEXT NOT NULL
);`,
};

function parseJsonish(text, id, key) {
	try {
		return JSON.parse(text);
	} catch {
		const quotedKeys = text.replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":');
		try {
			return JSON.parse(quotedKeys);
		} catch (error) {
			throw new Error(`${id} 的 ${key} 不是 JSON：${text}`, { cause: error });
		}
	}
}

export function parseBatchMarkdown(text, id) {
	const match = text.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) throw new Error(`沒有 frontmatter：${id}`);
	const lines = match[1].split(/\r?\n/);
	const data = {};
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (!line.trim()) continue;
		const kv = line.match(/^([A-Za-z0-9]+):\s*(.*)$/);
		if (!kv) throw new Error(`${id} 無法解析：${line}`);
		const key = kv[1];
		const raw = kv[2];
		if (raw === '') {
			const items = [];
			while (lines[i + 1]?.match(/^\s+-\s+/)) {
				i += 1;
				items.push(parseJsonish(lines[i].replace(/^\s+-\s+/, ''), id, key));
			}
			data[key] = items;
		} else if (raw.startsWith('{') || raw.startsWith('[')) {
			data[key] = parseJsonish(raw, id, key);
		} else if (raw === 'true' || raw === 'false') {
			data[key] = raw === 'true';
		} else if (/^-?\d+$/.test(raw)) {
			data[key] = Number(raw);
		} else if (raw.startsWith('"')) {
			data[key] = JSON.parse(raw);
		} else {
			data[key] = raw;
		}
	}
	return data;
}

function textOrNull(value) {
	if (value == null || value === '') return null;
	return String(value);
}

export function readBatchFiles(batchesDir) {
	return readdirSync(batchesDir)
		.filter((name) => name.endsWith('.md'))
		.sort()
		.map((name) => {
			const id = name.replace(/\.md$/, '');
			const data = parseBatchMarkdown(readFileSync(join(batchesDir, name), 'utf8'), id);
			return { id, data };
		});
}

export function importBatches(databases, batches) {
	const batchDb = databases.batches;
	const ingredientDb = databases.batch_ingredients;
	const photoDb = databases.batch_photos;
	batchDb.exec('BEGIN');
	ingredientDb.exec('BEGIN');
	photoDb.exec('BEGIN');
	const insertBatch = batchDb.prepare(`
		INSERT INTO batches (
			id, title, title_en, date, ambient_temp_c, peak_heat_c, inoculation_temp_c,
			incubation_temp_c, incubation_time_h, equipment_device, equipment_vessel, equipment_note,
			culture_source, culture_name, culture_origin, culture_amount, culture_generation,
			culture_id, method_id, result_set, result_texture, result_acidity, result_whey,
			result_flavor, result_overall, photo_album_url, draft
		) VALUES (
			?, ?, ?, ?, ?, ?, ?,
			?, ?, ?, ?, ?,
			?, ?, ?, ?, ?,
			?, ?, ?, ?, ?, ?,
			?, ?, ?, ?
		)
	`);
	const insertIngredient = ingredientDb.prepare(`
		INSERT INTO batch_ingredients (batch_id, position, type, brand, amount, note)
		VALUES (?, ?, ?, ?, ?, ?)
	`);
	const insertPhoto = photoDb.prepare(`
		INSERT INTO batch_photos (batch_id, position, path) VALUES (?, ?, ?)
	`);
	try {
		for (const { id, data } of batches) {
			const equipment = data.equipment ?? {};
			insertBatch.run(
				id,
				data.title,
				textOrNull(data.titleEn),
				data.date,
				textOrNull(data.ambientTempC),
				textOrNull(data.peakHeatC),
				textOrNull(data.inoculationTempC),
				data.incubationTempC,
				data.incubationTimeH,
				textOrNull(equipment.device),
				textOrNull(equipment.vessel),
				textOrNull(equipment.note),
				data.cultureSource,
				data.cultureName,
				data.cultureOrigin,
				textOrNull(data.cultureAmount),
				data.cultureGeneration ?? null,
				textOrNull(data.culture),
				textOrNull(data.method),
				data.resultSet,
				textOrNull(data.resultTexture),
				textOrNull(data.resultAcidity),
				textOrNull(data.resultWhey),
				textOrNull(data.resultFlavor),
				textOrNull(data.resultOverall),
				textOrNull(data.photoAlbumUrl),
				data.draft ? 1 : 0,
			);
			for (const [position, item] of (data.ingredients ?? []).entries()) {
				insertIngredient.run(id, position, item.type, textOrNull(item.brand), item.amount, textOrNull(item.note));
			}
			for (const [position, path] of (data.photos ?? []).entries()) {
				insertPhoto.run(id, position, path);
			}
		}
		for (const db of [batchDb, ingredientDb, photoDb]) db.exec('COMMIT');
	} catch (error) {
		for (const db of [batchDb, ingredientDb, photoDb]) db.exec('ROLLBACK');
		throw error;
	}
}

export function openTableDatabase(filePath, tableName) {
	const sql = tableSchemas[tableName];
	if (!sql) throw new Error(`沒有這個表：${tableName}`);
	if (filePath !== ':memory:') mkdirSync(dirname(filePath), { recursive: true });
	const db = new DatabaseSync(filePath);
	db.exec(sql);
	return db;
}

export function tableFilePath(dataDir, tableName) {
	return join(dataDir, `${tableName}.sqlite`);
}

function run() {
	const batchesDir = join(projectRoot, 'src', 'content', 'batches');
	const dataDir = join(projectRoot, 'data');
	const combinedPath = join(dataDir, 'yogurtguide.sqlite');
	if (existsSync(combinedPath)) unlinkSync(combinedPath);
	for (const tableName of tableNames) {
		const filePath = tableFilePath(dataDir, tableName);
		if (existsSync(filePath)) unlinkSync(filePath);
	}
	const databases = Object.fromEntries(
		tableNames.map((tableName) => [tableName, openTableDatabase(tableFilePath(dataDir, tableName), tableName)]),
	);
	const batches = readBatchFiles(batchesDir);
	importBatches(databases, batches);
	const count = databases.batches.prepare('SELECT COUNT(*) AS n FROM batches').get().n;
	for (const tableName of tableNames) {
		console.log(`${tableName}：${tableFilePath(dataDir, tableName)}`);
		databases[tableName].close();
	}
	console.log(`已寫入 ${count} 筆批次`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	run();
}
