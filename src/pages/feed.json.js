// Public JSON feed for imatin.dev (and anything else that wants to read the lab).
// CORS is opened for this file in public/_headers.
import { getCollection } from 'astro:content';
import log from '../data/log.json';
import builds from '../data/builds.json';

export async function GET({ site }) {
  const base = site?.toString().replace(/\/$/, '') ?? 'https://lab.imatin.dev';
  const notes = (await getCollection('notes', ({ data }) => !data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const ops = (await getCollection('ops', ({ data }) => !data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const day = (d) => d.toISOString().slice(0, 10);
  const body = {
    updated: new Date().toISOString(),
    notes: notes.slice(0, 5).map((n) => ({ id: n.id, title: n.data.title, date: day(n.data.date), tag: n.data.tag, url: `${base}/notes/${n.id}/` })),
    ops: ops.slice(0, 3).map((o) => ({ id: o.id, title: o.data.title, date: day(o.data.date), kind: o.data.kind, url: `${base}/ops/${o.id}/` })),
    log: log.slice(0, 6),
    builds: builds.map((b) => ({ name: b.name, kind: b.kind, status: b.status, tagline: b.tagline, href: b.links[0]?.href ?? null })),
    stats: {
      notes: notes.length,
      concepts: new Set(notes.flatMap((n) => n.data.concepts)).size,
      noteDates: notes.map((n) => day(n.data.date)),
    },
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
