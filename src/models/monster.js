var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');

/****************************************
  Model: monsters
*****************************************/

App.Models.Monster = Backbone.Model.extend({
  url: function() { 
    var base = App.Settings.apiRoot + '/monsters';
    if (this.isNew()) return base;
    return base + '/' + this.id
  }
});

module.exports = App.Models.Monster;