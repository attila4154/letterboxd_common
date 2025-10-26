import Fastify from 'fastify';
import HTMLParser, { type HTMLElement } from 'node-html-parser';
import fastifyStatic from '@fastify/static'
import * as path from 'path';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

const fastify = Fastify({ logger: true });


fastify.get('/test', (req, res) => {
  res.send('echo');
})
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
})
fastify.post('/common', async (req, res) => {
  // Parse and validate request body
  let body: unknown;
  try {
    body = JSON.parse(req.body as string);
  } catch {
    res.status(400).send({ error: 'Invalid JSON in request body' });
    return;
  }

  // Validate schema: must be array with exactly 2 strings
  if (!Array.isArray(body) || body.length !== 2) {
    res.status(400).send({ error: 'Request body must be an array with exactly 2 elements' });
    return;
  }

  const [username1, username2] = body;

  if (typeof username1 !== 'string' || typeof username2 !== 'string') {
    res.status(400).send({ error: 'Both usernames must be strings' });
    return;
  }

  if (!username1.trim() || !username2.trim()) {
    res.status(400).send({ error: 'Usernames cannot be empty' });
    return;
  }

  // Validate that users exist
  const userValidationErr1 = await checkUserExists(username1);
  if (userValidationErr1) {
    res.status(404).send({ error: userValidationErr1 });
    return;
  }

  const userValidationErr2 = await checkUserExists(username2);
  if (userValidationErr2) {
    res.status(404).send({ error: userValidationErr2 });
    return;
  }

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

if (process.env.NODE_ENV !== 'prod') {
  fastify.listen({ port: 3000 }).then(() => {
    console.log("listening on port 3000");
  })
}


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
    // @ts-ignore
    Name: el._attrs['data-item-name'],
    // @ts-ignore
    id: el._attrs['data-film-id'],
    // @ts-ignore
    Link: 'https://letterboxd.com' + el._attrs['data-item-link'],
  }))

  return watchlist;
}

async function checkUserExists(username: string): Promise<string | null> {
  let res;
  try {
    res = await fetch(`https://letterboxd.com/${username}/watchlist`);
  } catch (err) {
    console.log(err);
    return `Failed to check if ${username} exists`;
  }

  if (res.status === 404) {
    return `User ${username} doesn't exist`;
  }

  return null;
}

// needed for vercel
// https://fastify-example.vercel.app/
export default async function handler(req: any, res: any) {
  await fastify.ready()
  fastify.server.emit('request', req, res)
}
