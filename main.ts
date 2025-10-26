import Fastify from 'fastify';
import HTMLParser, { type HTMLElement } from 'node-html-parser';
import fastifyStatic from '@fastify/static'
import path from 'path';
// import * as fs from 'node:fs';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const fastify = Fastify({ logger: true });


fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
})
fastify.post('/common', async (req, res) => {
  // TODO: request validation
  const body = JSON.parse(req.body as string) as [string, string];

  const [username1, username2] = body;
  console.log(username1, username2);

  const wl1 = await getWatchlist(username1);
  const wl2 = await getWatchlist(username2);

  const common = wl1.filter(f1 => wl2.some(f2 => f2.id === f1.id));

  res.status(200).send(JSON.stringify(common));
})

fastify.setErrorHandler((error, req, res) => {
  console.error("Caught error", error);

  res.status(500).send("Internal server error");
})

fastify.listen({ port: 3000 }).then(() => {
  console.log("listening on port 3000");
})


async function getWatchlist(username: string) {
  console.log(`Fetching watchlist for ${username}`);
  const filmElements: HTMLElement[] = [];

  let cnt = 1;
  while (true) {
    const res = await fetch(`https://letterboxd.com/${username}/watchlist/page/${cnt}/`);
    const html = await res.text();
    cnt++;

    const root = HTMLParser.parse(html);
    const _filmElements = root.querySelectorAll('[data-film-id]');
    filmElements.push(..._filmElements);

    if (_filmElements.length === 0) {
      break;
    }
  }

  const watchlist = filmElements.map(el => ({
    Name: el._attrs['data-item-name'],
    id: el._attrs['data-film-id'],
    Link: 'https://letterboxd.com' + el._attrs['data-item-link'],
  }))

  return watchlist;
}
