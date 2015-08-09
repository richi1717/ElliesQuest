var $ = require('jquery');
var Backbone = require('backbone');
var homeTemplate = require('../templates/home.hbs');

// App
var App = require('../app');

// View: List Users
var HomePage = Backbone.View.extend({
  el: $('main'),

  render: function () {
    this.$el.html(homeTemplate());
    $('body').removeClass().addClass('home');
  }
});

module.exports = HomePage;
