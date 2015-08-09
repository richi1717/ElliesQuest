var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');
var Product = require('../models/product');

/****************************************
  Collection: User
*****************************************/

var ProductCollection = Backbone.Collection.extend({
  url: App.Settings.apiRoot + '/products',
  model: Product
});

App.Collections.product = new ProductCollection;

module.exports = App.Collections.product;