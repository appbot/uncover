const uncheckByBranch = (result, branches) =>
  branches.forEach(({ lines, hits }) =>
    hits.forEach((count, i) => count == 0 && (result[lines[i]] = 0))
  );

const uncheckByFunction = (result, { lines, hits = [] }) =>
  hits.forEach((count, i) => count == 0 && (result[lines[i]] = 0));

const uncheck = ({ lines, functions, branches }) => {
  const result = Array.from(lines);

  uncheckByBranch(result, branches || []);
  uncheckByFunction(result, functions || {});

  return result;
};

module.exports = uncheck;
