const nonZeroCount = (c, l) => (l ? c + 1 : c);

const join = Array.prototype.concat;

const serialize = ({ lines, branches, functions, file }) => {
  const functionCount = functions.lines.reduce(nonZeroCount, 0);
  const functionHits = functions.hits.reduce(nonZeroCount, 0);
  const brCount = branches.reduce((c, br) => br.lines.length, 0);
  const brHits = branches.reduce(
    (c, br) => c + br.hits.reduce(nonZeroCount, 0),
    0
  );
  const lineCount = lines.reduce(c => c + 1, 0);
  const lineHits = lines.reduce(nonZeroCount, 0);

  return join
    .call(
      ['TN:', `SF:${file}`],

      functions.lines.map((l, i) => {
        if (l) return `FN:${l},${functions.names[i]}`;
      }),
      functions.hits.map((h, i) => {
        if (h || h === 0) return `FNDA:${h},${functions.names[i]}`;
      }),
      [`FNF:${functionCount}`, `FNH:${functionHits}`],
      join.call(
        branches.map((branch, block) =>
          branch.lines
            .map(
              (l, index) => `BRDA:${l},${block},${index},${branch.hits[index]}`
            )
            .join('\n')
        )
      ),
      [`BRF:${brCount}`, `BRH:${brHits}`],

      lines
        .map((count, i) => (count || count === 0) && `DA:${i},${count}`)
        .filter(l => l), // no blanks
      [`LF:${lineCount}`, `LH:${lineHits}`],
      ['end_of_record', ''] // will add the last CR
    )
    .join('\n');
};

module.exports = serialize;
