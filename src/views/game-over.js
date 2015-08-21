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
      $('#game-over').animate({volume: 0}, 1500)
      $('div.game-over-screen').fadeOut(1500)
      setTimeout(function () {
        $('#game-over').trigger('leave')
        App.router.navigate('/game/', { trigger: true });
      }, 1500)
    })
    $('button#home').on('click', function () {
      $('span.hero-game-over').addClass('game-over-start1')
      newGame = setInterval(function () {
        $('span.hero-game-over').toggleClass('game-over-start2')
      }, 200)
      $('span.hero-game-over').addClass('game-over-animate').delay(600)
      $('#game-over').animate({volume: 0}, 3000)
      $('div.game-over-screen').fadeOut(3000)
      setTimeout(function () {
        clearInterval(continueGame);
        clearInterval(newGame);
        $('#game-over').trigger('leave')
        App.router.navigate('/', { trigger: true });
      }, 3000)

    })
    $('#game-over').on('leave', function () {
      this.pause();
    })
  }
});

module.exports = GameOver;  