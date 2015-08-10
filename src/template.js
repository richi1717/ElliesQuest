'use strict';

var Handlebars = require('hbsfy/runtime');

var desertBattle = require('./templates/desert-battle.hbs')

var battleMenu = require('./templates/battle-menu.hbs')

var attackMenu = require('./templates/attack.hbs')

var magicSelector = require('./templates/magic-selector.hbs')

var magicMenu = require('./templates/magic-menu.hbs')



module.exports = {
  desertBattle: desertBattle,
  battleMenu: battleMenu,
  attackMenu: attackMenu,
  magicSelector: magicSelector,
  magicMenu: magicMenu
}
