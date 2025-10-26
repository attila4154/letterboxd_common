import readline from 'readline';
import HTMLParser from 'node-html-parser';
import ora from 'ora';

main();

async function main() {
  const users = await ask('Enter users: ');
  const [username1, username2] = users.split(',').map(u => u.trim());

  const wl1 = await getWatchlist(username1);
  const wl2 = await getWatchlist(username2);

  const common = wl1.filter(f1 => wl2.some(f2 => f2.id === f1.id));
  console.log('common:');
  console.table(common);
}

async function getWatchlist(username) {
  const spinner = ora(`Fetching ${username}'s watchlist`).start();
  const filmElements = [];

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
    name: el._attrs['data-item-name'],
    link: el._attrs['data-item-link'],
    id: el._attrs['data-film-id']
  }))
  spinner.stop();

  return watchlist;
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(question, answer => {
    rl.close();
    resolve(answer);
  }));
}
