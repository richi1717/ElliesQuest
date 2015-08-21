var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');
var Character = require('../models/character');

/****************************************
  Collection: Character
*****************************************/

var CharacterCollection = Backbone.Collection.extend({
  url: App.Settings.apiRoot + '/characters?userId=1',
  model: Character
});

App.Collections.character = new CharacterCollection;

module.exports = App.Collections.character;