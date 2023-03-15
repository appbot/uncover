const FileCoverage = require('./file_coverage');

class Coverage extends Map {
  get(name) {
    if (super.has(name)) return super.get(name);

    const cover = new FileCoverage(name);
    this.set(name, cover);
    return cover;
  }
}

module.exports = Coverage;
