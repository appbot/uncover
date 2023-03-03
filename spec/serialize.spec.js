const serialize = require('../lib/serialize');

describe('serialize', () => {
  subject(() => serialize(input));

  set('input', () => ({
    file: 'file.js',
    lines,
    functions,
    branches: [{ lines: [4, 5], hits: [3, 0] }],
  }));

  set('functions', {
    names: ['method1', 'method2'],
    lines: [1, 4],
    hits: [4, 0],
  });

  set('lines', [, 1, , , 3, 3, 0, 3]);

  it('serializes correctly', () =>
    expect(subject).to.deep.eql(
      `TN:
SF:file.js
FN:1,method1
FN:4,method2
FNDA:4,method1
FNDA:0,method2
FNF:2
FNH:1
BRDA:4,0,0,3
BRDA:5,0,1,0
BRF:2
BRH:1
DA:1,1
DA:4,3
DA:5,3
DA:6,0
DA:7,3
LF:5
LH:4
end_of_record`
    ));

  context('when there are no lines', () => {
    set('lines', []);

    it('gives nothing', () => expect(subject).to.have.length(0));
  });

  context('when a function has no line ref', () => {
    set('functions', {
      names: ['method1', 'method2'],
      lines: [0, 2],
      hits: [4, 5],
    });

    it('does not provide the associated function line', () =>
      expect(subject).not.to.match(/FN:.*method1/));
  });

  context('when a function has no count ref', () => {
    set('functions', {
      names: ['method1', 'method2'],
      lines: [1, 2],
      hits: [null, 5],
    });

    it('does not provide the associated function line', () =>
      expect(subject).not.to.match(/FNDA:.*method1/));
  });
});
