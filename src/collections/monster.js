var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');
var Monster = require('../models/monster');

/****************************************
  Collection: Monster
*****************************************/

var MonsterCollection = Backbone.Collection.extend({
  url: App.Settings.apiRoot + '/monsters',
  model: Monster
});

App.Collections.monster = new MonsterCollection;

module.exports = App.Collections.monster;
