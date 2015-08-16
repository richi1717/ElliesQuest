var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');

/****************************************
  Model: cell
*****************************************/

App.Models.Cell = Backbone.Model.extend({
  url: function() { 
    var base = App.Settings.apiRoot + '/cells';
    if (this.isNew()) return base;
    return base + '/' + this.id
  }
});

module.exports = App.Models.Cell;