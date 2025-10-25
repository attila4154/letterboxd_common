import * as fs from 'fs';

const csv1 = readCsv('1.csv');
const csv2 = readCsv('2.csv');


console.log(csv1[1])
console.log(csv2[1])

const common = csv1.filter(c1 => csv2.some(c2 => c2.Name === c1.Name));
console.table(common)

function readCsv(filename) {
  let result = [];
  const data = fs.readFileSync(filename).toLocaleString();

  const rows = data.split("\n"); // SPLIT ROWS
  rows.forEach((row) => {
    const columns = row.split(","); //SPLIT COLUMNS
    result.push(columns);
  })

  let colNames = result[0];
  let csv = result.slice(1);
  csv = csv.map(row => ({
    // [colNames[0]]: row[0],
    [colNames[1]]: row[1],
    [colNames[2]]: row[2],
    [colNames[3]]: row[3],
  }))

  return csv.reverse();
}
