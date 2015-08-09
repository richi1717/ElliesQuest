var $ = require('jquery');
var Backbone = require('backbone');
var newGameTemplate = require('../templates/new-game.hbs');

// App
var App = require('../app');

// View: List Users
var NewGame = Backbone.View.extend({
  el: $('main'),

  render: function () {
    this.$el.html(newGameTemplate());
  }
});

module.exports = NewGame;