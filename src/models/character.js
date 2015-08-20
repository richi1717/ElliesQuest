var Backbone = require('backbone');
var expUtils = require('../../utility/calcLevel.js')
var _ = require('lodash')
// var newLevelStats = {
//   str: _.random(1, 10),
//   def: _.random(1, 10),
//   maxMp: _.random(8, 15),
//   maxHp: _.random(80, 140),
//   accuracy: _.random(1, 5),
//   magic: _.random(0, 2),
//   evade: _.random(1, 5),
//   agility: _.random(0, 2)
// }
/****************************************
  App
*****************************************/

var App = require('../app');

/****************************************
  Model: characters
*****************************************/

App.Models.Character = Backbone.Model.extend({
  url: function () { 
    var base = App.Settings.apiRoot + '/characters?userId=' + 1;
    if (this.isNew()) return base;
    return base + '/' + this.id
  },

  addPosition: function (position) {
    this.set('currentPosition', position)
  },

  addExp: function (expGained, stats) {
    var currentLvl = expUtils.calcLevel(this.get('exp'))
    this.set('exp', this.get('exp') + expGained)
    var newLvl = expUtils.calcLevel(this.get('exp'))

    if (newLvl > currentLvl) {
      var newLevelStats = {
        str: _.random(5, 10),
        def: _.random(5, 10),
        maxMp: _.random(8, 15),
        maxHp: _.random(80, 140),
        accuracy: _.random(1, 5),
        magic: _.random(0, 2),
        evade: _.random(1, 5),
        agility: _.random(0, 2)
      }
      _this.addLevel(newLevelStats)

    }
    else {
      var newLevelStats = false
    }

    this.save()
    return newLevelStats
  },

  addLevel: function (stats) {
    this.set('str', this.get('str') + stats.str)
    this.set('def', this.get('def') + stats.def)
    this.set('currentHp', this.get('maxHp'))
    this.set('currentMp', this.get('maxMp'))
    this.set('agility', this.get('agility') + stats.agility)
    this.set('evade', this.get('evade') + stats.evade)
    this.set('magic', this.get('magic') + stats.magic)
    this.set('accuracy', this.get('accuracy') + stats.accuracy)
  }
});

module.exports = App.Models.Character;