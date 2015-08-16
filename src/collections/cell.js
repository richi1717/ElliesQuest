var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');
var Cells = require('../models/cell');

/****************************************
  Collection: Cells
*****************************************/

var CellsCollection = Backbone.Collection.extend({
  url: App.Settings.apiRoot + '/cells',
  model: Cells
});

App.Collections.cell = new CellsCollection;

module.exports = App.Collections.cell;