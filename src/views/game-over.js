var $ = require('jquery');
var Backbone = require('backbone');
var gameOver = require('../templates/game-over.hbs');

// App
var App = require('../app');

// View: List Users
var GameOver = Backbone.View.extend({
  el: $('main'),

  render: function () {
    var continueGame = 0;
    var newGame = 0;
    clearInterval(continueGame);
    clearInterval(newGame);
    this.$el.html(gameOver());
    $('div.game-over-screen > div').append('<button class="game-over-button">Click to continue from last save</button>')
    continueGame = setInterval(function () {
      $('button.game-over-button').toggleClass('fadedOut')
    }, 1000)
    $('button.game-over-button').on('click', function () {
      App.router.navigate('/game/', { trigger: true });
    })
    $('button#home').on('click', function () {
      $('span.hero-game-over').addClass('game-over-start1')
      newGame = setInterval(function () {
        $('span.hero-game-over').toggleClass('game-over-start2')
      }, 200)
      $('span.hero-game-over').addClass('game-over-animate').delay(600)
      setTimeout(function () {
        clearInterval(continueGame);
        clearInterval(newGame);
        App.router.navigate('/', { trigger: true });
      }, 3000)

    })
  }
});

module.exports = GameOver;  