var $ = require('jquery')
var Backbone = require('backbone')
var listMonstersTemplate = require('../templates/list-monsters.hbs')

var Handlebars = require('hbsfy/runtime')

// App
var App = require('../app')

// View: List Monsters
var ListMonsters = Backbone.View.extend({
  el: $('main'),

  collection: App.Collections.monster,

  render: function () {
    var _this = this
    var monsterCollection = this.collection

    $('body').removeClass().addClass('monsters')
    monsterCollection.fetch().done(function (monsters) {
      _this.$el.html(listMonstersTemplate(monsters))

    })
  }
})

module.exports = ListMonsters