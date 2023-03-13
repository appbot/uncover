const Coverage = require('../lib/coverage');
const FileCoverage = require('../lib/file_coverage');

describe('Coverage', () => {
  subject('coverage', () => new Coverage());

  describe('existing', () => {
    beforeEach(() => coverage.get('first').addLine({ line: 1, hits: 2 }));

    it('gets the existing', () =>
      expect(coverage.get('first').lines.get(1)).to.eq(2));

    it('can tell between selections', () =>
      expect(coverage.get('second').lines.get(1)).to.be.undefined);
  });

  describe('empty', () => {
    it('creates a new FileCoverage', () =>
      expect(coverage.get('first')).to.be.an.instanceOf(FileCoverage));
  });
});
