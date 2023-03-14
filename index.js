#!/usr/bin/env node
const fs = require('fs');
const Coverage = require('./lib/coverage');
const parse = require('./lib/parse');
const split = require('./lib/split');

const files = process.argv.slice(2);

const failures = [];
const results = new Coverage();

files.forEach(name => {
  let file;
  try {
    file = fs.readFileSync(name, { encoding: 'utf-8' });
    if (!file) return;

    split(file).forEach(part => parse(results, part));
  } catch (e) {
    failures.push(`Failed to process '${name}'. ${e.message}`);
  }
});

results.forEach(coverage => {
  const info = coverage.uncover().serialise();
  if (info.length) console.log(info);
});

if (failures.length) {
  process.exitCode = -1;
  console.error(failures.join('\n'));
}
