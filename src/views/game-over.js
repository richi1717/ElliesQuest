var $ = require('jquery');
var Backbone = require('backbone');
var gameOver = require('../templates/game-over.hbs');

// App
var App = require('../app');

// View: List Users
var GameOver = Backbone.View.extend({
  el: $('main'),

  render: function () {
    this.$el.html(gameOver());
    $('div.game-over-screen > div').append('<button class="game-over-button">Click to continue from last save</button>')
    setInterval(function () {
      $('button').toggleClass('fadedOut')
    }, 1000)
    $('button').on('click', function () {
      App.router.navigate('/game/', { trigger: true });
    })
  }
});

module.exports = GameOver;