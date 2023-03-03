const split = file =>
  file
    .split('end_of_record')
    .map(f => f.trim())
    .filter(f => f)
    .map(f => f.split('\n').map(l => l.trim()));

module.exports = split;
