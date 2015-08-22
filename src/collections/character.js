var Backbone = require('backbone');
var $ = require('jquery')


/****************************************
  App
*****************************************/

var App = require('../app');
var Character = require('../models/character');

/****************************************
  Collection: Character
*****************************************/
var CharacterCollection = Backbone.Collection.extend({
  url: App.Settings.apiRoot + '/characters?userId=' + App.currentUser.id,
  model: Character
});

App.Collections.character = new CharacterCollection;

module.exports = App.Collections.character;