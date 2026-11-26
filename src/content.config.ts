import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

export const TAGS = ['Olfaction', 'Signal processing', 'Machine learning', 'BCI'] as const;

// Reading notes: one Markdown file per paper in src/content/notes/
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),          // your headline for the note
    paper: z.string(),          // the paper's real title
    authors: z.string(),
    venue: z.string(),
    year: z.number(),
    tag: z.enum(TAGS),
    minutes: z.number().default(5),
    summary: z.string(),        // one or two sentences shown on the card
    doi: z.string().optional(),
    concepts: z.array(z.string()).default([]), // ideas the note touches; they link notes in /graph
    date: z.coerce.date(),      // when you wrote the note
    draft: z.boolean().default(false),
  }),
});

// Publications, patents, preprints, talks: edit src/data/publications.json
const publications = defineCollection({
  loader: file('src/data/publications.json'),
  schema: z.object({
    id: z.string(),
    year: z.string().optional(),
    title: z.string(),
    venue: z.string(),
    kind: z.enum(['paper', 'preprint', 'patent', 'talk', 'thesis']),
    url: z.string().optional(),
    badges: z.array(z.string()).default([]), // e.g. "Q1", "under review", "pending"
    bibtex: z.string().optional(),
    order: z.number().default(0),
  }),
});

// Ops room: writeups for side projects (Telegram bots, security, CTFs, tools)
const ops = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ops' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['bot', 'security', 'ctf', 'tool', 'log']),
    summary: z.string(),
    date: z.coerce.date(),
    stack: z.array(z.string()).default([]),
    repo: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes, publications, ops };
