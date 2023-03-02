const split = file =>
  file
    .split('end_of_record')
    .map(f => f.trim())
    .filter(f => f);

module.exports = split;
