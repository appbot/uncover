#!/usr/bin/env node
const fs = require('fs');
const parse = require('./lib/parse');
const serialize = require('./lib/serialize');
const split = require('./lib/split');
const uncheck = require('./lib/uncheck');

const files = process.argv.slice(2);
const failures = [];
files.forEach(name => {
  let file;
  try {
    file = fs.readFileSync(name, { encoding: 'utf-8' });
  } catch (e) {
    failures.push(`Failed to process '${name}'. ${e.message}`);
  }
  if (!file) return;

  console.log(
    split(file)
      .map(part => {
        const parsed = parse(part);
        parsed.lines = uncheck(parsed);
        return serialize(parsed);
      })
      .filter(f => f)
      .join('\n')
  );
});

if (failures.length) {
  process.exitCode = -1;
  console.error(failures.join('\n'));
}
