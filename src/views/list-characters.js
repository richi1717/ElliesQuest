var $ = require('jquery');
var Backbone = require('backbone');
var listCharactersTemplate = require('../templates/list-characters.hbs');

var Handlebars = require('hbsfy/runtime');

// App
var App = require('../app');

// View: List Characters
var ListCharacters = Backbone.View.extend({
  el: $('main'),

  collection: App.Collections.character,

  render: function () {
    var _this = this;
    var characterCollection = this.collection;

    $('body').removeClass().addClass('characters');
    characterCollection.fetch().done(function (characters) {
      _this.$el.html(listCharactersTemplate(characters));

    });
  }
});

module.exports = ListCharacters;