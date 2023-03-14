const sinon = require('sinon');
const FileCoverage = require('../lib/file_coverage');
const parse = require('../lib/parse');

describe('parse', () => {
  set(
    'input',
    `TN:
     SF:file.js
     FN:1,method
     FNF:1
     FNH:1
     FNDA:4,method
     DA:1,1
     DA:4,3
     DA:5,3
     DA:6,3
     DA:7,3
     LF:5
     LH:5
     BRDA:4,1,0,3
     BRDA:5,1,1,0
     BRF:2
     BRH:1
     end_of_record`
      .split('\n')
      .map(l => l.trim())
  );

  subject(() => parse(coverage, input));

  set('coverage', () => ({ get: sinon.fake.returns(fileCover) }));
  set('fileCover', () => sinon.createStubInstance(FileCoverage));

  it('parses correctly', () => {
    subject;

    expect(coverage.get).to.have.been.calledOnceWith('file.js');
    expect(fileCover.addLine).to.have.been.calledWith({ line: 1, hits: 1 });
    expect(fileCover.addLine).to.have.been.calledWith({ line: 4, hits: 3 });
    expect(fileCover.addLine).to.have.been.calledWith({ line: 5, hits: 3 });
    expect(fileCover.addLine).to.have.been.calledWith({ line: 6, hits: 3 });
    expect(fileCover.addLine).to.have.been.calledWith({ line: 7, hits: 3 });
    expect(fileCover.addLine).to.have.callCount(5);

    expect(fileCover.addFunction).to.have.been.calledOnceWith({
      name: 'method',
      line: 1,
      hits: 4,
    });

    expect(fileCover.addBranch).to.have.been.calledWith({
      line: 4,
      block: 1,
      branch: 0,
      hits: 3,
    });
    expect(fileCover.addBranch).to.have.been.calledWith({
      line: 5,
      block: 1,
      branch: 1,
      hits: 0,
    });
    expect(fileCover.addBranch).to.have.been.calledTwice;
  });

  context('when a function execution is missing', () => {
    set(
      'input',
      `TN:
         SF:file.js
         FN:1,method
         FN:4,method2
         FNF:1
         FNH:1
         FNDA:4,method2
         DA:1,1
         DA:4,3
         LF:5
         LH:5
         BRF:0
         BRH:0
         end_of_record`
        .split('\n')
        .map(l => l.trim())
    );

    it('keeps the method associations correct', () => {
      subject;

      expect(fileCover.addFunction).to.have.been.calledWith({
        name: 'method2',
        line: 4,
        hits: 4,
      });
      expect(fileCover.addFunction).to.have.been.calledWith({
        name: 'method',
        line: 1,
        hits: 0,
      });
    });
  });

  context('when a function definition is missing', () => {
    set(
      'input',
      `TN:
         SF:file.js
         FN:4,method2
         FNF:1
         FNH:1
         FNDA:3,method
         FNDA:4,method2
         DA:1,1
         DA:4,3
         LF:5
         LH:5
         BRF:0
         BRH:0
         end_of_record`
        .split('\n')
        .map(l => l.trim())
    );

    it('goes 💥', () =>
      expect(() => subject).to.throw(
        'function coverage present without function line attribute: 3,method'
      ));
  });
});
