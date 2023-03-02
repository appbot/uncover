const parse = input => {
  const lines = [];
  const branches = new Map();
  const functions = { names: [], lines: [], hits: [] };
  let file = "";

  const functionIndex = name => {
    let index = functions.names.indexOf(name);
    if (index == -1) return functions.names.push(name) - 1;
    return index;
  };

  input.forEach(txt => {
    const [type, content] = txt.split(":");
    let line, block, count, name;
    switch (type) {
      case "SF":
        file = content;
        break;

      case "DA":
        [line, count] = content.split(",").map(Number);
        lines[line] = count;
        break;
      case "FN":
        [line, name] = content.split(",");
        functions.lines[functionIndex(name)] = Number(line);
        break;

      case "FNDA":
        [count, name] = content.split(",");
        functions.hits[functionIndex(name)] = Number(count);
        break;

      case "BRDA":
        [line, block, , count] = content
          .replace(/-/g, "0") // per the spec, an un-executed branch has `-` as the count
          .split(",")
          .map(Number);
        const branch = branches.get(block) || { lines: [], hits: [] };
        branch.lines.push(line);
        branch.hits.push(count);

        branches.set(block, branch);
        break;
    }
  });

  functions.lines.forEach((_, i) => (functions.hits[i] ||= 0));
  functions.hits.forEach((_, i) => (functions.lines[i] ||= 0));

  return {
    lines,
    branches: Array.from(branches.values()),
    functions,
    file,
  };
};

module.exports = parse;
