const join = Array.prototype.concat;

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

  uncover() {
    this.branches.forEach(branch =>
      branch.forEach(({ line, hits }) => hits == 0 && this.lines.set(line, 0))
    );

    this.functions.forEach(
      ({ line, hits }) => hits == 0 && this.lines.set(line, 0)
    );

    return this;
  }

  serialise() {
    if (this.lines.size == 0 || this.errors.length) return '';

    const functions = Array.from(this.functions);
    const branches = Array.from(this.branches);
    const lines = Array.from(this.lines);

    const functionHits = functions.reduce(
      (c, [, { hits }]) => (hits ? c + 1 : c),
      0
    );

    const brCount = branches.reduce((c, [, br]) => c + br.length, 0);
    const brHits = branches.reduce(
      (c, [, br]) => c + br.reduce((c, { hits }) => (hits ? c + 1 : c), 0),
      0
    );

    const lineHits = lines.reduce((c, [, hits]) => (hits ? c + 1 : c), 0);

    return join
      .call(
        ['TN:', `SF:${this.name}`],

        functions.map(([name, { line }]) => `FN:${line},${name}`),
        functions.map(([name, { hits }]) => `FNDA:${hits},${name}`),
        [`FNF:${functions.length}`, `FNH:${functionHits}`],
        branches.map(([block, branches]) =>
          branches
            .map(({ line, hits }, i) => `BRDA:${line},${block},${i},${hits}`)
            .filter(l => l)
            .join('\n')
        ),
        [`BRF:${brCount}`, `BRH:${brHits}`],

        lines.map(([line, count]) => `DA:${line},${count}`),
        [`LF:${lines.length}`, `LH:${lineHits}`],
        ['end_of_record']
      )
      .join('\n');
  }
}

module.exports = FileCoverage;
