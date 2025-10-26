console.log('hello')
if (document.readyState === 'loading') {  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', () => main());
} else {  // `DOMContentLoaded` has already fired
  main();
}

function main() {
  console.log('main')
  const usersForm = document.getElementsByClassName('lb-users-form')[0];
  const username1Field = document.getElementById('user1-input')
  const username2Field = document.getElementById('user2-input');

  usersForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('from submit form', { u1: username1Field.value, u2: username2Field.value });

    const res = await fetch('/common',
      {
        method: "POST",
        body: JSON.stringify([username1Field.value, username2Field.value])
      }
    );
    const json = await res.json();

    console.log(json);
    renderTable(json);
  });
}

function renderTable(json) {
  const tableSection = document.getElementById('table-data');
  [...tableSection.children].forEach(child => child.remove());

  const table = document.createElement('div');
  table.className = 'results-table';

  // Create header row
  const headerRow = document.createElement('div');
  headerRow.className = 'table-header';

  const nameHeader = document.createElement('div');
  nameHeader.className = 'table-header-cell';
  nameHeader.textContent = 'Film Name';

  const linkHeader = document.createElement('div');
  linkHeader.className = 'table-header-cell';
  linkHeader.textContent = 'Link';

  headerRow.appendChild(nameHeader);
  headerRow.appendChild(linkHeader);
  table.appendChild(headerRow);

  // Create data rows
  json.forEach(f => {
    const row = document.createElement('div');
    row.className = 'table-row';

    const nameCell = document.createElement('div');
    nameCell.className = 'table-cell';
    nameCell.textContent = f.Name;

    const linkCell = document.createElement('div');
    linkCell.className = 'table-cell';
    const link = document.createElement('a');
    link.href = f.Link;
    link.textContent = 'View';
    link.target = '_blank';
    linkCell.appendChild(link);

    row.appendChild(nameCell);
    row.appendChild(linkCell);
    table.appendChild(row);
  })

  tableSection.appendChild(table);
}

