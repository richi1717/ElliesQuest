var $ = require('jquery');
var Backbone = require('backbone');
var homeTemplate = require('../templates/home.hbs');
var Character = require('../models/character.js')

// App
var App = require('../app');

// View: List Users
var HomePage = Backbone.View.extend({
  el: $('main'),

  render: function () {
    var _this = this
    var character = new Character({ id: 1 })
    character.fetch().done(function (character) {
      _this.$el.html(homeTemplate(character));
      $('body').removeClass().addClass('home');
      setInterval(function () {
        $('span.red-boy-down1').toggleClass('red-boy-down2')
      }, 400)

    })
  }
});

module.exports = HomePage;
