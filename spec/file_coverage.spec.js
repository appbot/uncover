const FileCoverage = require('../lib/file_coverage');

describe('FileCoverage', () => {
  subject('coverage', () => new FileCoverage(name));
  set('name', 'test.js');

  it('has the name passed in', () => expect(coverage.name).to.eq(name));

  context('single input (first file pass)', () => {
    describe('#addLine', () => {
      subject('lines', () => coverage.lines);

      beforeEach(() => coverage.addLine({ line: 4, hits: 2 }));

      it('adds the line coverage', () => expect(lines.get(4)).to.eq(2));

      it('adds further line coverage', () => {
        coverage.addLine({ line: 5, hits: 6 });

        expect(lines).to.have.all.keys([4, 5]);
        expect(lines.get(5)).to.eq(6);
      });
    });

    describe('#addBranch', () => {
      subject('branches', () => coverage.branches);
      set('branch0', () => branches.get(0));

      beforeEach(() =>
        coverage.addBranch({ line: 4, block: 0, branch: 3, hits: 2 })
      );

      it('adds the branch in full', () => {
        expect(branch0).to.be.an('Array');
        expect(branch0[3]).to.deep.eq({ line: 4, hits: 2 });
      });

      it('adds additional related branches', () => {
        coverage.addBranch({ line: 4, block: 0, branch: 1, hits: 0 });

        expect(branch0).to.be.an('Array');
        expect(branch0[3]).to.deep.eq({ line: 4, hits: 2 });
        expect(branch0[1]).to.deep.eq({ line: 4, hits: 0 });
      });

      it('adds additional unrelated branches', () => {
        coverage.addBranch({ line: 9, block: 2, branch: 1, hits: 0 });

        expect(branch0).to.be.an('Array');
        expect(branch0[3]).to.deep.eq({ line: 4, hits: 2 });
        expect(branches.get(2)[1]).to.deep.eq({ line: 9, hits: 0 });
      });
    });

    describe('#addFunction', () => {
      subject('functions', () => coverage.functions);
      set('func0', () => functions.get('myFunc'));

      beforeEach(() =>
        coverage.addFunction({ name: 'myFunc', line: 4, hits: 2 })
      );

      it('adds the function in full', () =>
        expect(func0).to.deep.eq({ line: 4, hits: 2 }));

      it('adds additional functions', () => {
        coverage.addFunction({ name: 'yourFunc', line: 5, hits: 5 });

        expect(func0).to.deep.eq({ line: 4, hits: 2 });
        expect(functions.get('yourFunc')).to.deep.eq({ line: 5, hits: 5 });
      });
    });
  });

  context('multi input (second file pass)', () => {
    set('line', 3);
    set('lineHits', 1);
    set('funcHits', 9);
    set('branchHits', 11);

    set('os', 0);

    beforeEach(() => {
      coverage.addLine({ line, hits: lineHits });
      coverage.addBranch({
        line,
        block: 0,
        branch: 3,
        hits: branchHits,
      });
      coverage.addFunction({ name: 'myFunc', line, hits: funcHits });
    });

    describe('#addLine', () => {
      subject('lines', () => coverage.lines);

      beforeEach(() => coverage.addLine({ line, hits: 2 }));

      it('sums the line coverage', () =>
        expect(lines.get(line)).to.eq(2 + lineHits));
    });

    describe('#addBranch', () => {
      subject('branches', () => coverage.branches);
      set('branch0', () => branches.get(0));

      beforeEach(() =>
        coverage.addBranch({ line: line + os, block: 0, branch: 3, hits: 2 })
      );

      it('sums branch coverage', () =>
        expect(branch0[3]).to.deep.eq({ line, hits: 2 + branchHits }));

      context('when same branch references different lines', () => {
        set('os', 1);

        it('sets an error', () =>
          expect(coverage.errors[0]).to.eq(
            'branch 3 of block 0 has varying definition lines in test.js'
          ));
      });
    });

    describe('#addFunction', () => {
      subject('functions', () => coverage.functions);
      set('func0', () => functions.get('myFunc'));

      beforeEach(() =>
        coverage.addFunction({ name: 'myFunc', line: line + os, hits: 2 })
      );

      it('sums function coverage', () =>
        expect(func0).to.deep.eq({ line, hits: 2 + funcHits }));

      context('when same function reference different lines', () => {
        set('os', 1);

        it('sets an error', () =>
          expect(coverage.errors[0]).to.eq(
            "function 'myFunc' has varying definition lines in test.js"
          ));
      });
    });
  });
});
