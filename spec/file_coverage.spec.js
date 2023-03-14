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

    describe('#serialise', () => {
      beforeEach(() => {
        coverage.addLine({ line, hits: lineHits });
        coverage.addLine({ line: line + 1, hits: lineHits });
        coverage.addBranch({ line, block: 0, branch: 0, hits: 0 });
        coverage.addFunction({ name: 'myFunc2', line: line + 1, hits: 0 });
      });

      subject('info', () => coverage.serialise());

      it('produces a correct lcov part', () =>
        expect(info).to.eq(`TN:
SF:test.js
FN:3,myFunc
FN:4,myFunc2
FNDA:9,myFunc
FNDA:0,myFunc2
FNF:2
FNH:1
BRDA:3,0,0,0
BRDA:3,0,3,11
BRF:4
BRH:1
DA:3,2
DA:4,1
LF:2
LH:2
end_of_record`));

      context('after uncover', () => {
        it('matches expected output', () => {
          coverage.uncover();

          expect(info).to.eq(`TN:
SF:test.js
FN:3,myFunc
FN:4,myFunc2
FNDA:9,myFunc
FNDA:0,myFunc2
FNF:2
FNH:1
BRDA:3,0,0,0
BRDA:3,0,3,11
BRF:4
BRH:1
DA:3,0
DA:4,0
LF:2
LH:0
end_of_record`);
        });
      });

      context('when there is no line coverage', () => {
        beforeEach(() => coverage.lines.clear());

        it('returns an empty string', () => expect(info).to.eq(''));
      });
    });
  });

  describe('#uncover', () => {
    subject('uncover', () => coverage.uncover());

    beforeEach(() => {
      coverage.addLine({ line: 1, hits: 2 });
      coverage.addLine({ line: 2, hits: 2 });
      coverage.addLine({ line: 3, hits: 2 });
      coverage.addBranch({ line: 1, block: 0, branch: 3, hits: 0 });
      coverage.addBranch({ line: 3, block: 0, branch: 0, hits: 1 });
      coverage.addFunction({ name: 'myFunc', line: 2, hits: 0 });
      coverage.addFunction({ name: 'yourFunc', line: 3, hits: 1 });
    });

    it('zeros lines where branch or fn coverage is zero', () => {
      uncover;
      expect(coverage.lines.get(1)).to.eq(0);
      expect(coverage.lines.get(2)).to.eq(0);
      expect(coverage.lines.get(3)).to.eq(2);
    });
  });
});
