const parse = (allCoverage, input) => {
  const functions = {};

  let coverage;

  input.forEach(txt => {
    const [type, content] = txt.split(':');
    let line, block, hits, name;

    switch (type) {
      case 'SF':
        coverage = allCoverage.get(content);
        break;

      case 'DA':
        if (!coverage) throw new Error('filename missing on coverage report');
        [line, hits] = content.split(',').map(Number);
        coverage.addLine({ line, hits });
        break;

      case 'FN':
        if (!coverage) throw new Error('filename missing on coverage report');
        [line, name] = content.split(',');
        functions[name] = Number(line);
        break;

      case 'FNDA':
        if (!coverage) throw new Error('filename missing on coverage report');

        [hits, name] = content.split(',');
        if (typeof functions[name] == 'undefined')
          throw new Error(
            'function coverage present without function line attribute'
          );
        coverage.addFunction({
          name,
          line: functions[name],
          hits: Number(hits),
        });

        delete functions[name];
        break;

      case 'BRDA':
        if (!coverage) throw new Error('filename missing on coverage report');
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
