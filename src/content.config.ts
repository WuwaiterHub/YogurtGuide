import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const cultures = defineCollection({
	loader: glob({ base: './src/content/cultures', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		titleEn: z.string(),
		summary: z.string(),
		species: z.string().optional(),
		classificationNote: z.string().optional(),
		temperatureClass: z.enum(['thermophilic', 'mesophilic']),
		form: z.string().optional(),
		source: z.string().optional(),
		tempRangeC: z.string().optional(),
		timeRangeH: z.string().optional(),
		flavorProfile: z.string().optional(),
		textureProfile: z.string().optional(),
		reuseHint: z.string().optional(),
		sortOrder: z.number().default(100),
		draft: z.boolean().default(false),
	}),
});

const methods = defineCollection({
	loader: glob({ base: './src/content/methods', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		titleEn: z.string(),
		summary: z.string(),
		equipment: z.array(z.string()).default([]),
		suitableCultures: z.array(reference('cultures')).default([]),
		draft: z.boolean().default(false),
	}),
});

const ingredientSchema = z.object({
	type: z.enum(['fresh-milk', 'milk-powder', 'water', 'other']),
	brand: z.string().optional(),
	amount: z.string(),
	note: z.string().optional(),
});

const batches = defineCollection({
	loader: glob({ base: './src/content/batches', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		titleEn: z.string().optional(),
		date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
		ambientTempC: z.string().optional(),
		peakHeatC: z.string().optional(),
		inoculationTempC: z.string().optional(),
		incubationTempC: z.string(),
		incubationTimeH: z.string(),
		equipment: z.object({
			device: z.string().optional(),
			vessel: z.string().optional(),
			note: z.string().optional(),
		}),
		ingredients: z.array(ingredientSchema).default([]),
		cultureSource: z.enum(['mother', 'new-powder', 'commercial-yogurt', 'other']),
		cultureName: z.string(),
		cultureOrigin: z.string(),
		cultureAmount: z.string().optional(),
		cultureGeneration: z.number().int().nonnegative().optional(),
		culture: reference('cultures').optional(),
		method: reference('methods').optional(),
		resultSet: z.string(),
		resultAcidity: z.string().optional(),
		resultTexture: z.string().optional(),
		resultWhey: z.string().optional(),
		resultFlavor: z.string().optional(),
		resultOverall: z.string().optional(),
		photoAlbumUrl: z.string().url().optional(),
		photos: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
	}),
});

const additives = defineCollection({
	loader: glob({ base: './src/content/additives', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		titleEn: z.string(),
		summary: z.string(),
		sortOrder: z.number().default(100),
		draft: z.boolean().default(false),
	}),
});

const foods = defineCollection({
	loader: glob({ base: './src/content/foods', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		titleEn: z.string(),
		summary: z.string(),
		sortOrder: z.number().default(100),
		draft: z.boolean().default(false),
	}),
});

const glossary = defineCollection({
	loader: glob({ base: './src/content/glossary', pattern: '**/*.md' }),
	schema: z.object({
		termZh: z.string(),
		termEn: z.string(),
		category: z.enum(['process', 'microbiology', 'quality', 'equipment', 'general']),
		draft: z.boolean().default(false),
	}),
});

const marketYogurts = defineCollection({
	loader: glob({ base: './src/content/market-yogurts', pattern: '**/*.md' }),
	schema: z.object({
		brand: z.string(),
		productName: z.string(),
		recommendationStars: z.number().int().min(0).max(2).default(0),
		milkBase: z.enum(['fresh', 'powder', 'mixed', 'other']),
		milkBaseNote: z.string(),
		addedSugar: z.boolean().default(false),
		additives: z.string(),
		cultures: z.string(),
		ingredientsLabel: z.string(),
		note: z.string().optional(),
		sortOrder: z.number().default(100),
		draft: z.boolean().default(false),
	}),
});

const starterPowders = defineCollection({
	loader: glob({ base: './src/content/powders', pattern: '**/*.md' }),
	schema: z.object({
		brand: z.string(),
		brandSlug: z.string(),
		productName: z.string(),
		channels: z.array(z.enum(['shopee', 'taobao'])).default([]),
		packSize: z.string().optional(),
		contents: z.string().optional(),
		temperature: z.string().optional(),
		fermentTime: z.string().optional(),
		strains: z
			.array(
				z.object({
					name: z.string(),
					code: z.string().optional(),
				}),
			)
			.default([]),
		strainGap: z.string().optional(),
		priceAmount: z.string().default(''),
		priceCurrency: z.enum(['TWD', 'CNY']).optional(),
		priceUnit: z.string().default(''),
		priceOrigin: z.enum(['shopee', 'taobao', 'official', 'other']).optional(),
		priceAsOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
		priceNote: z.string().optional(),
		reviewTier: z.enum(['web', 'video', 'xhs', 'buyer', 'official', 'none']),
		review: z.string(),
		packImage: z.string().optional(),
		packCaption: z.string().optional(),
		packImages: z
			.array(
				z.object({
					src: z.string(),
					caption: z.string().optional(),
				}),
			)
			.default([]),
		sortOrder: z.number().default(100),
		draft: z.boolean().default(false),
	}),
});

const overnightOats = defineCollection({
	loader: glob({ base: './src/content/overnight-oats', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		texture: z.string().optional(),
		ingredients: z
			.array(
				z
					.object({
						name: z.string(),
						// 份量不明時三個都不寫；寫了 amount 就要有 unit。amountMax 表示範圍上限。
						amount: z.number().positive().optional(),
						amountMax: z.number().positive().optional(),
						unit: z.enum(['g', 'ml', '顆', '湯匙']).optional(),
						foodRef: reference('foods').optional(),
						additiveRef: reference('additives').optional(),
						note: z.string().optional(),
					})
					.refine((item) => (item.amount === undefined) === (item.unit === undefined), {
						message: '份量要同時寫 amount 與 unit，或兩個都不寫',
					})
					.refine((item) => item.amountMax === undefined || (item.amount !== undefined && item.amountMax > item.amount), {
						message: 'amountMax 要搭配 amount，且大於 amount',
					}),
			)
			.min(2),
		steps: z.array(z.string()).min(1),
		sortOrder: z.number().default(100),
		draft: z.boolean().default(false),
	}),
});

export const collections = {
	cultures,
	methods,
	batches,
	additives,
	foods,
	glossary,
	marketYogurts,
	starterPowders,
	overnightOats,
};
