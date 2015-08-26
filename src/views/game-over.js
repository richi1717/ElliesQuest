var $ = require('jquery')
var Backbone = require('backbone')
var gameOver = require('../templates/game-over.hbs')

// App
var App = require('../app')

// View: List Users
var GameOver = Backbone.View.extend({
  el: $('main'),

  render: function () {

    var continueGame = 0
    var newGame = 0
    var homePage
    clearTimeout(continueGame)
    clearTimeout(newGame)
    clearTimeout(homePage)

    this.$el.html(gameOver())
    $('div.game-over-screen > div').append('<button class="game-over-button">Click to continue from last save</button>')
    function gameContinue() {
      $('button.game-over-button').toggleClass('fadedOut')
      setTimeout(function () {
        gameContinue()
      }, 1000)
    }
    continueGame = setTimeout(gameContinue(), 1000)
    $('button.game-over-button').on('click', function () {
      $('#game-over').animate({volume: 0}, 1500)
      $('div.game-over-screen').fadeOut(1500)
      setTimeout(function () {
        $('#game-over').trigger('leave')
        $('button.game-over-button').addClass('stop-please')
        $('span.hero-game-over').addClass('stop-please')
        clearTimeout(continueGame)
        clearTimeout(newGame)
        clearTimeout(homePage)
        App.router.navigate('/game/', { trigger: true })
      }, 1500)
    })
    $('button#home').on('click', function () {
      $('span.hero-game-over').addClass('game-over-start1')
      newGame = setTimeout(homeScreen(), 200)
      function homeScreen() {
        if (Backbone.history.on('hashchange')) {
        }
        $('span.hero-game-over').toggleClass('game-over-start2')
        setTimeout(function () {
          homeScreen()
        }, 200)
      }
      $('span.hero-game-over').addClass('game-over-animate').delay(600)
      $('#game-over').animate({volume: 0}, 3000)
      $('div.game-over-screen').fadeOut(3000)
      homePage = setTimeout(function () {
        clearTimeout(continueGame)
        clearTimeout(newGame)
        clearTimeout(homePage)
        $('button.game-over-button').addClass('stop-please')
        $('span.hero-game-over').addClass('stop-please')
        $('#game-over').trigger('leave')
        App.router.navigate('/', { trigger: true })
      }, 3000)
    })
    
    $('#game-over').on('leave', function () {
      this.pause()
    })
  }
})

module.exports = GameOver  