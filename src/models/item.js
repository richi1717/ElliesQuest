var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');

/****************************************
  Model: Item
*****************************************/

App.Models.Item = Backbone.Model.extend({
  url: function() { 
    var base = App.Settings.apiRoot + '/items';
    if (this.isNew()) return base;
    return base + '/' + this.id
  }
});

module.exports = App.Models.Item;