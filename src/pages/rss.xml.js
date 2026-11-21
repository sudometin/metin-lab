import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const notes = (await getCollection('notes', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'MH://lab — reading notes',
    description: 'Plain-words notes on olfaction, neural signals and neural interfaces.',
    site: context.site,
    items: notes.map((n) => ({
      title: n.data.title,
      description: n.data.summary,
      pubDate: n.data.date,
      link: `/notes/${n.id}/`,
      categories: [n.data.tag],
    })),
  });
}
