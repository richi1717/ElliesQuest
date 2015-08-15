var $ = require('jquery');
var Backbone = require('backbone');
var listMagicTemplate = require('../templates/list-magics.hbs');

var Handlebars = require('hbsfy/runtime');

// App
var App = require('../app');

// View: List Magic
var ListMagic = Backbone.View.extend({
  el: $('main'),

  collection: App.Collections.magic,

  render: function () {
    var _this = this;
    var magicCollection = this.collection;

    $('body').removeClass().addClass('magics');
    magicCollection.fetch().done(function (magics) {
      _this.$el.html(listMagicTemplate(magics));

    });
  }
});

module.exports = ListMagic;