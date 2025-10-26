import readline from 'readline';
import { Table } from 'console-table-printer';
import HTMLParser from 'node-html-parser';
import ora from 'ora';

main();

async function main() {
  const [error, users] = await input();
  if (error) {
    console.error(error);
    return;
  }

  const [username1, username2] = users;

  const wl1 = await getWatchlist(username1);
  const wl2 = await getWatchlist(username2);

  const common = wl1.filter(f1 => wl2.some(f2 => f2.id === f1.id));

  const table = new Table({
    title: 'Common',
    columns: [{ name: 'Name', alignment: 'right' }, { name: 'Link', alignment: 'left' }],
    enabledColumns: ['Name', 'Link'],
    rows: common,
  })
  table.printTable();
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
    Name: el._attrs['data-item-name'],
    id: el._attrs['data-film-id'],
    Link: 'https://letterboxd.com' + el._attrs['data-item-link'],
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

async function input() {
  const input = await ask('Enter users separated with comma: ');

  let users = input.split(',');
  if (users.length !== 2) {
    return ["Please enter ${username1}, ${username2}", null];
  }

  users = users.map(u => u.trim());

  return [null, users];
}
