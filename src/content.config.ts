// packages
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const langString = z.object({
  en: z.string(),
  es: z.string(),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/categories' }),
  schema: z.object({
    slug: z.string(),
    kind: z.enum(['design', 'artwork']),
    label: langString,
    blurb: langString,
    sisterCategories: z.array(z.string()),
  }),
});

const galleryItem = z.object({
  src: z.string(),
  alt: langString,
  kind: z.enum(['image', 'video']),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: z.object({
    slug: z.string(),
    kind: z.enum(['design', 'artwork']),
    category: z.string(),
    title: langString,
    subtitle: langString,
    studio: z.string(),
    role: langString,
    sectors: z.array(z.string()),
    year: z.number().int(),
    cover: z.string(),
    gallery: z.array(galleryItem),
  }),
});

export const collections = { categories, projects };
