const FileCoverage = require('./file_coverage');

const parse = (allCoverage, input) => {
  const functions = {};

  let coverage = new FileCoverage('none');

  input.forEach(txt => {
    const [type, content] = txt.split(':');
    let line, block, hits, name;

    switch (type) {
      case 'SF':
        coverage = allCoverage.get(content);
        break;

      case 'DA':
        [line, hits] = content.split(',').map(Number);
        coverage.addLine({ line, hits });
        break;

      case 'FN':
        [line, name] = content.split(',');
        functions[name] = Number(line);
        break;

      case 'FNDA':
        [hits, name] = content.split(',');
        if (typeof functions[name] == 'undefined')
          throw new Error(
            'function coverage present without function line attribute: ' +
              content
          );
        coverage.addFunction({
          name,
          line: functions[name],
          hits: Number(hits),
        });

        delete functions[name];
        break;

      case 'BRDA':
        [line, block, branch, hits] = content
          .replace(/-/g, '0') // per the spec, an un-executed branch has `-` as the count
          .split(',')
          .map(Number);

        coverage.addBranch({ line, block, branch, hits });
        break;
    }
  });

  // add functions that had no hits
  Object.entries(functions).forEach(([name, line]) =>
    coverage.addFunction({ name, line, hits: 0 })
  );

  return coverage;
};

module.exports = parse;
