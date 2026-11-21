import { getCollection, type CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'notes'>;

export async function getNotes(): Promise<Note[]> {
  return (await getCollection('notes', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

export const tagSlug = (t: string) => t.toLowerCase().replace(/\s+/g, '-');

/** "Vernon J. Lawhern et al." → ["Vernon J. Lawhern"]; "A, B" → ["A", "B"] */
export function authorList(authors: string): string[] {
  return authors
    .replace(/\s*et al\.?/i, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const lastName = (full: string) => full.split(/\s+/).pop() ?? full;
const ascii = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z]/g, '');

/** BibTeX entry generated from a note's frontmatter */
export function bibtex(n: Note): string {
  const d = n.data;
  const list = authorList(d.authors);
  const key = `${ascii(lastName(list[0] ?? 'anon')).toLowerCase()}${d.year}`;
  const etal = /et al/i.test(d.authors);
  const author = list.join(' and ') + (etal ? ' and others' : '');
  const lines = [
    `@article{${key},`,
    `  title   = {${d.paper}},`,
    `  author  = {${author}},`,
    `  journal = {${d.venue}},`,
    `  year    = {${d.year}}${d.doi ? ',' : ''}`,
  ];
  if (d.doi) lines.push(`  doi     = {${d.doi}}`);
  lines.push('}');
  return lines.join('\n');
}

export type GraphNode = { id: string; label: string; type: 'note' | 'tag' | 'concept' | 'author'; href?: string };
export type GraphLink = { source: string; target: string };

/** Notes linked through their tag, concepts and authors */
export function buildGraph(notes: Note[]) {
  const nodes = new Map<string, GraphNode>();
  const links: GraphLink[] = [];
  const add = (n: GraphNode) => { if (!nodes.has(n.id)) nodes.set(n.id, n); };
  for (const n of notes) {
    const id = `note:${n.id}`;
    add({ id, label: n.data.title, type: 'note', href: `/notes/${n.id}/` });
    const tag = `tag:${n.data.tag}`;
    add({ id: tag, label: n.data.tag, type: 'tag' });
    links.push({ source: id, target: tag });
    for (const c of n.data.concepts) {
      const cid = `concept:${c.toLowerCase()}`;
      add({ id: cid, label: c, type: 'concept' });
      links.push({ source: id, target: cid });
    }
    for (const a of authorList(n.data.authors)) {
      const aid = `author:${lastName(a).toLowerCase()}`;
      add({ id: aid, label: lastName(a), type: 'author' });
      links.push({ source: id, target: aid });
    }
  }
  return { nodes: [...nodes.values()], links };
}

/** Short, stable pseudo commit hash for the lab log */
export function commitHash(s: string): string {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}
