function calcLevel(exp) {
  if (exp < calcExp(2)) return 1
  if (exp > 2450250) return 100
  return Math.floor(exp / Math.sqrt(exp * 250))
}

function calcExp(level) {
  level = level
  return 250 * (level * level)
}

function calcExpTNL(exp) {
  return calcExp(calcLevel(exp) + 1) - exp
}

module.exports = {
  calcLevel: calcLevel,
  calcExp: calcExp,
  calcExpTNL: calcExpTNL
}
var _ = require('lodash')

var turns = [
  { 'turn': 1,  'name': 'a' },
  { 'turn': 3,    'name': 'b' },
  { 'turn': 2, 'name': 'c' }
];

var turn = _.chain(turns)
  .sortBy('turn').reverse()
  .map(function(chr) {
    console.log( chr.name + ' is ' + chr.turn )
  })
  // .first()
  .value();
// → 'pebbles is 1'