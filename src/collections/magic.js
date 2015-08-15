var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');
var Magic = require('../models/magic');

/****************************************
  Collection: Magic
*****************************************/

var MagicCollection = Backbone.Collection.extend({
  url: App.Settings.apiRoot + '/magics',
  model: Magic
});

App.Collections.magic = new MagicCollection;

module.exports = App.Collections.magic;