var $ = require('jquery');
var Backbone = require('backbone');
var homeTemplate = require('../templates/home.hbs');
// var Character = require('../models/character.js')

// App
var App = require('../app');

// View: List Users
var HomePage = Backbone.View.extend({
  el: $('main'),

  render: function () {
    var _this = this
      
        _this.$el.html(homeTemplate());
      // $('body').removeClass().addClass('home');

  }
});

module.exports = HomePage;
