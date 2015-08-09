var $ = require('jquery');
var Backbone = require('backbone');
var grassBattleTmpl = require('../templates/grass-battle.hbs');
var _ = require('lodash')
// var Handlebars = require('hbsfy/runtime');

// App
var App = require('../app');

// View: List Users
var GrassBattle = Backbone.View.extend({
  el: $('main'),

  render: function () {
    this.$el.html(grassBattleTmpl());
    var enemyCount = function () {
      var count = _.random(1, 5)
      console.log(count)
      var i = 1
      while (count >= i) {
        $('main').append('<section class="enemy' + i + '"></section>')
        var randomEnemy = _.random(1, 6)
        if (randomEnemy === 1) {
          console.log('you fight Lesser Eagle!')
          $('.enemy' + i).addClass('enemy-sprites enemy-sprite-small enemy-blue-eagle')
        } else if (randomEnemy === 2) {
          console.log('you fight templar')
          $('.enemy' + i).addClass('enemy-sprites enemy-sprite-small enemy-gold-mouse')

        } else if (randomEnemy === 3) {
          console.log('you fight wolf')
          $('.enemy' + i).addClass('enemy-sprites enemy-sprite-small enemy-yellow-antman')

        } else if (randomEnemy === 4) {
          console.log('you fight dog')
          $('.enemy' + i).addClass('enemy-sprites enemy-sprite-small enemy-green-babydemon')

        } else if (randomEnemy === 5) {
          console.log('you fight snake')
          $('.enemy' + i).addClass('enemy-sprites enemy-sprite-small enemy-red-tapeworm')

        } else {
          $('.enemy' + i).addClass('enemy-sprites enemy-sprite-small enemy-blue-blob')
          console.log('you fight yahoos')

        }
        i++
        console.log(i)
        
      }
    }
    enemyCount()
    
    $('span').addClass('battle-hero-position-single battle-ff-sprite battle-sprite-size battle-hero-red-boy item-sprite item-sprite-size sword1')

  }
});

module.exports = GrassBattle;