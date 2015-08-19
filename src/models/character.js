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
    var base = App.Settings.apiRoot + '/characters';
    if (this.isNew()) return base;
    return base + '/' + this.id
  },
  // updateStats: function (stats) {
  //   this.set('str', this.get('str') + stats.str)
  //   this.set('def', this.get('def') + stats.def)
  //   this.set('currentHp', this.get('maxHp'))
  //   this.set('currentMp', this.get('maxMp'))
  //   this.set('agility', this.get('agility') + stats.agility)
  //   this.set('evade', this.get('evade') + stats.evade)
  //   this.set('magic', this.get('magic') + stats.magic)
  //   this.set('accuracy', this.get('accuracy') + stats.accuracy)
  // },

  addExp: function (expGained, stats) {
    var currentLvl = expUtils.calcLevel(this.get('exp'))
    this.set('exp', this.get('exp') + expGained)
    var newLvl = expUtils.calcLevel(this.get('exp'))

    

    if (newLvl > currentLvl) {
      var _this = this
      // $('div.battle > div').append('<div class="level-up">' 
      //   + this.get('name') + ' got ' + expGained + 'Exp</div>')

      var newLevelStats = {
        str: _.random(1, 10),
        def: _.random(1, 10),
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
    // var str1 = this.get('str')
    // var def1 = this.get('def')
    // var maxHp1 = this.get('maxHp')
    // var maxMp1 = this.get('maxMp')
    // var accuracy1 = this.get('accuracy')
    // var magic1 = this.get('magic')
    // var evade1 = this.get('evade')
    // var agility1 = this.get('agility')
    this.set('str', this.get('str') + stats.str)
    this.set('def', this.get('def') + stats.def)
    this.set('currentHp', this.get('maxHp'))
    this.set('currentMp', this.get('maxMp'))
    this.set('agility', this.get('agility') + stats.agility)
    this.set('evade', this.get('evade') + stats.evade)
    this.set('magic', this.get('magic') + stats.magic)
    this.set('accuracy', this.get('accuracy') + stats.accuracy)
    // console.log('You gained a level')
    // newHero1 = this.attributes
    // newStr1 = newHero1.str - str1
    // newDef1 = newHero1.def - def1
    // newMaxHp1 = newHero1.maxHp - maxHp1
    // newMaxMp1 = newHero1.maxMp - maxMp1
    // newAccuracy1 = newHero1.accuracy - accuracy1
    // newMagic1 = newHero1.magic - magic1
    // newEvade1 = newHero1.evade - evade1
    // newAgility1 = newHero1.agility - agility1


    // $('div.level-up > ').append(' and gained a Level')
    // $('main').one('click', function () {
    //   $('div.level-up').text('and gained a level!')
    //   $('main').one('click', function () {
    //     $('div.level-up').text('+' + newStr1 + 'Str ' + newDef1 + 'Def ' + newMaxHp1 + 'MaxHp ' + newMaxMp1 + 'MaxMp')
    //     $('main').one('click', function () {
    //       $('div.level-up').text('+' + newAccuracy1 + 'Accuracy ' + newMagic1 + 'Magic ' + newEvade1 + 'Evade ' + newAgility1 + 'Agility')
    //     })
    //   })
    // })


  }

});

module.exports = App.Models.Character;