var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');
var Item = require('../models/item');

/****************************************
  Collection: Item
*****************************************/

var ItemCollection = Backbone.Collection.extend({
  url: App.Settings.apiRoot + '/items',
  model: Item
});

App.Collections.item = new ItemCollection;

module.exports = App.Collections.item;