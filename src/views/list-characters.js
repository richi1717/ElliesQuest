var $ = require('jquery');
var Backbone = require('backbone');
var listCharactersTemplate = require('../templates/list-characters.hbs');
var expUtils = require('../../utility/calcLevel.js')

var Handlebars = require('hbsfy/runtime');

// App
var App = require('../app');

// View: List Characters
var ListCharacters = Backbone.View.extend({
  el: $('main'),



  render: function () {
    var _this = this;
    var characterCollection = require('../collections/character.js');
    $('body').removeClass().addClass('characters');
    characterCollection.fetch().done(function (characters) {
      characters.forEach(function (character) {
        character.level = expUtils.calcLevel(character.exp)
        character.expTNL = expUtils.calcExpTNL(character.exp)
      })

      _this.$el.html(listCharactersTemplate(characters));

    });
  }
});

module.exports = ListCharacters;