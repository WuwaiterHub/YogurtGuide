import { createHash } from 'node:crypto';
import { getCollection } from 'astro:content';

const officialOrigin = 'https://yogurtguide.wuwaiter.com';

export function stableStringify(value: unknown): string {
	return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(sortValue);
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>)
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([key, item]) => [key, sortValue(item)]),
		);
	}
	return value;
}

export function sha256(text: string): string {
	return createHash('sha256').update(text).digest('hex');
}

function refId(ref: { id: string } | string | undefined): string | undefined {
	if (!ref) return undefined;
	return typeof ref === 'string' ? ref : ref.id;
}

export async function powdersDocument() {
	const powders = (await getCollection('starterPowders', ({ data }) => !data.draft)).sort(
		(a, b) => a.data.sortOrder - b.data.sortOrder,
	);
	return {
		schemaVersion: 1,
		items: powders.map(({ id, data }) => ({
			id,
			brand: data.brand,
			brandSlug: data.brandSlug,
			productName: data.productName,
			packSize: data.packSize ?? '',
			contents: data.contents ?? '',
			temperature: data.temperature ?? '',
			fermentTime: data.fermentTime ?? '',
			strains: data.strains,
			strainGap: data.strainGap ?? '',
			price:
				data.priceAmount && data.priceCurrency
					? {
							amount: data.priceAmount,
							currency: data.priceCurrency,
							unit: data.priceUnit,
							asOf: data.priceAsOf,
						}
					: null,
			review: data.reviewTier === 'none' ? '' : data.review,
			imageUrl: data.packImage ? `${officialOrigin}/${data.packImage}` : '',
			imageUrls: [data.packImage, ...data.packImages.map((image) => image.src)]
				.filter(Boolean)
				.map((src) => `${officialOrigin}/${src}`),
		})),
	};
}

export async function overnightOatsDocument() {
	const recipes = (await getCollection('overnightOats', ({ data }) => !data.draft)).sort((a, b) =>
		a.data.title.localeCompare(b.data.title, 'zh-Hant'),
	);
	return {
		schemaVersion: 1,
		items: recipes.map(({ id, data }) => ({
			id,
			title: data.title,
			servings: data.servings,
			soakHours: data.soakHours,
			texture: data.texture,
			ingredients: data.ingredients.map((item) => ({
				name: item.name,
				amount: item.amount,
				unit: item.unit,
				foodId: refId(item.foodRef),
				additiveId: refId(item.additiveRef),
				note: item.note ?? '',
			})),
			steps: data.steps,
		})),
	};
}

export async function contentFiles() {
	const documents = [
		{ name: 'powders.json', document: await powdersDocument() },
		{ name: 'overnight-oats.json', document: await overnightOatsDocument() },
	];
	return documents.map(({ name, document }) => {
		const body = stableStringify(document);
		return { name, body, sha256: sha256(body), bytes: Buffer.byteLength(body) };
	});
}
