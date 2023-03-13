class FileCoverage {
  constructor(name) {
    this.name = name;
    this.lines = new Map();
    this.branches = new Map();
    this.functions = new Map();
    this.errors = [];
  }

  addLine({ line, hits }) {
    let current = this.lines.get(line);
    if (current || current == 0) current += hits;
    else current = hits;

    this.lines.set(line, current);
  }

  addBranch({ line, block, branch, hits }) {
    let current = this.branches.get(block) || [];

    if (!current[branch]) current[branch] = { line };
    else if (current[branch].line != line)
      return this.errors.push(
        `branch ${branch} of block ${block} has varying definition lines in ${this.name}`
      );

    if (current[branch].hits || current[branch].hits == 0)
      current[branch].hits += hits;
    else current[branch].hits = hits;

    this.branches.set(block, current);
  }

  addFunction({ name, line, hits }) {
    let current = this.functions.get(name);

    if (!current) current = { line };
    else if (current.line != line)
      return this.errors.push(
        `function '${name}' has varying definition lines in ${this.name}`
      );
    if (current.hits || current.hits == 0) current.hits += hits;
    else current.hits = hits;

    this.functions.set(name, current);
  }
}

module.exports = FileCoverage;
