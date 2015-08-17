var Backbone = require('backbone');
var expUtils = require('../../utility/calcLevel.js')
var _ = require('lodash')
var newLevelStats = {
  str: _.random(1, 5),
  def: 0,
  currentHp: 0,
  agility: 0,
  evade: 0,
  magic: 0,
  accuracy: 0,
  currentMp: 0
}
/****************************************
  App
*****************************************/

var App = require('../app');

/****************************************
  Model: characters
*****************************************/

App.Models.Character = Backbone.Model.extend({
  url: function () { 
    var base = App.Settings.apiRoot + '/characters';
    if (this.isNew()) return base;
    return base + '/' + this.id
  },
  updateStats: function (stats) {
    this.set('str', this.get('str') + stats.str)
    this.set('def', this.get('def') + stats.def)
    this.set('currentHp', this.get('currentHp') + stats.currentHp)
    this.set('agility', this.get('agility') + stats.agility)
    this.set('evade', this.get('evade') + stats.evade)
    this.set('magic', this.get('magic') + stats.magic)
    this.set('accuracy', this.get('accuracy') + stats.accuracy)
    this.set('currentMp', this.get('currentMp') + stats.currentMp)
  },

  addExp: function (expGained) {
    var currentLvl = expUtils.calcLevel(this.get('exp'))
    console.log('currentLvl', currentLvl)
    this.set('exp', this.get('exp') + expGained)
    var newLvl = expUtils.calcLevel(this.get('exp'))
    console.log('newLvl', newLvl)
    

    if (newLvl > currentLvl) {
      this.updateStats(newLevelStats)
      console.log('You gained a level')

      $('div.level-up > ').append(' and gained a Level')
      // setTimeout(function () {
      //   $('div.level-up').remove()
      // }, 10000)
    }

    this.save()
  }

});

module.exports = App.Models.Character;