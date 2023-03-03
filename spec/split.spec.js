const split = require('../lib/split');

describe('split', () => {
  set(
    'file',
    `
body of
file coverage 1

end_of_record
body of file coverage 2
end_of_record
end_of_record
    `
  );
  subject(() => split(file));

  it('splits on `end_of_record` with trimming', () =>
    expect(subject).to.eql([
      ['body of', 'file coverage 1'],
      ['body of file coverage 2'],
    ]));
});
