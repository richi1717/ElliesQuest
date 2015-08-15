var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');

/****************************************
  Model: magic
*****************************************/

App.Models.Magic = Backbone.Model.extend({
  url: function() { 
    var base = App.Settings.apiRoot + '/magics';
    if (this.isNew()) return base;
    return base + '/' + this.id
  }
});

module.exports = App.Models.Magic;