var $ = require('jquery');
var Backbone = require('backbone');
var desertBattleTmpl = require('../templates/desert-battle.hbs');
var _ = require('lodash')
var battleMenuTmpl = require('../templates/battle-menu.hbs')

// var Handlebars = require('hbsfy/runtime');

// App
var App = require('../app');

// View: List Users
var DesertBattle = Backbone.View.extend({
  el: $('main'),

  render: function () {
    var _this = this
    _this.$el.html(desertBattleTmpl());


    var enemyCount = function () {
      var count = _.random(1, 5)
      // console.log(count)
      var i = 1
      while (count >= i) {
        $('main').append('<section class="enemy' + i + '"></section>')
        var randomEnemy = _.random(1, 6)
        if (randomEnemy === 1) {
          console.log('you fight Lesser Hornet')
          $('.enemy' + i).addClass('enemy-sprites enemy-sprite-small enemy-blue-hornet')
        } else if (randomEnemy === 2) {
          console.log('you fight Lesser Mouse')
          $('.enemy' + i).addClass('enemy-sprites enemy-sprite-small enemy-gray-mouse')

        } else if (randomEnemy === 3) {
          console.log('you fight Lesser Antman')
          $('.enemy' + i).addClass('enemy-sprites enemy-sprite-small enemy-yellow-antman')

        } else if (randomEnemy === 4) {
          console.log('you fight Lesser Baby Demon')
          $('.enemy' + i).addClass('enemy-sprites enemy-sprite-small enemy-orange-babydemon')

        } else if (randomEnemy === 5) {
          console.log('you fight Lesser Tapeworm')
          $('.enemy' + i).addClass('enemy-sprites enemy-sprite-small enemy-blue-tapeworm')

        } else {
          $('.enemy' + i).addClass('enemy-sprites enemy-sprite-small enemy-blue-blob')
          console.log('you fight Lesser Blob')

        }
        i++
        // console.log(i)
        
      }
    }
    enemyCount()
    
    $('span.hero1').addClass('battle-hero-position1-back battle-ff-sprite battle-sprite-size battle-hero-red-boy')
    $('span.hero2').addClass('battle-hero-position2-back battle-ff-sprite battle-sprite-size battle-hero-white-girl')
    var turnOrder = function (turn) {

      if (turn) {
        $('span.hero1').removeClass('battle-hero-position1-front').addClass('battle-hero-position1-turn')
        // _this.$el.html(battleMenuTmpl());
      }
    }
    turnOrder(true)
  }
});

module.exports = DesertBattle;
