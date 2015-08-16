var Backbone = require('backbone');
var App = require('../app');
var Cell = require('../models/cell.js')

// View: List Users
var CellView = Backbone.View.extend({
  el: $('main'),

  render: function () {
    var _this = this
    var cell = new Cell({ id: 1 })
    cell.fetch().done(function (cell) {
      // _this.$el.html(homeTemplate(cell));
      $('body').removeClass().addClass('home');
      
    })
  }
});

module.exports = CellView;