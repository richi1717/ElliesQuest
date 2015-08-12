var Backbone = require('backbone');


/****************************************
  App
*****************************************/

var App = require('../app');

/****************************************
  Model: monsters
*****************************************/

App.Models.Character = Backbone.Model.extend({
  url: function() { 
    var base = App.Settings.apiRoot + '/characters';
    if (this.isNew()) return base;
    return base + '/' + this.id
  }
});

module.exports = App.Models.Character;