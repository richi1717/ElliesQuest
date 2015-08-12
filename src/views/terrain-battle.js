var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash')
var Handlebars = require('hbsfy/runtime');

var tmpl = require('../template.js')

var battleMenuTmpl = require('../templates/battle-menu.hbs')
var Character = require('../models/character.js')
var Monster = require('../models/monster.js')


// App
var App = require('../app');

// View: List Users
var TerrainBattle = Backbone.View.extend({
  el: $('main'),

  collection: App.Collections.monster,

  render: function (terrainType) {
    var _this = this
    var monsterCollection = this.collection
    var character = new Character
    var monster = new Monster
    var terrainType = terrainType
    
    character.fetch().done(function (character) {

      monster.fetch().done(function (monster) {
        
       _this.$el.html(renderTerrain(terrainType, character))

        function enemyCountTerrain(terrainType, monsters) {
          var count = _.random(1, 5)
          var i = 1

          while (count >= i) {
            var randomEnemy = _.sample(_.where(monsters, { sections: [terrainType] }))
            $('main').append('<section class="enemy' + i + ' ' + randomEnemy.classes + '" name="' + randomEnemy.name + '"></section>')
            
            console.log('you fight ' + randomEnemy.name)
            i++ 
          }
        }
        
        $('span.hero1').addClass('battle-hero-position1-back battle-ff-sprite battle-sprite-size battle-hero-red-boy')
        $('span.hero2').addClass('battle-hero-position2-back battle-ff-sprite battle-sprite-size battle-hero-white-girl')
        
        var turnOrder = function (turn, who) {

          if (turn) {
            $('span.battle-hero').removeClass('turn')
            $('span.hero' + who).removeClass('battle-hero-position' + who + '-front').addClass('battle-hero-position' + who + ' turn')
            $('.battle-menu-main > li').removeClass('character-turn')
            $('.battle-menu-main > li:nth-child(' + who + ')').addClass('character-turn')
            // _this.$el.html(battleMenuTmpl());
          }
        }

        function renderSubMenu(turn, who) {
          turnOrder(turn, who)
          var html = tmpl.battleMenu({})
          return html
        }

        function renderAttackMenu(monster, character) {
          $('span.battle-menu-turn + span.menu-attack').remove()
          var length = $('section.enemy-sprites').length
          var i = 0
          var monsters = []

          while (i < length) {
            i++
            var nameOf = $('section.enemy' + i).attr('name')
            monsters.push({ name: nameOf })
          }

          var html = tmpl.attackMenu({
            monster: monsters,
            character: character
          })
          return html
        }

        function findNameOfTargets(enemies, characters) {

        }

        enemyCountTerrain(terrainType, monster)

        function renderTerrain(terrain, character) {
          var html = tmpl.terrainBattle({
            terrain: terrain,
            character: character
          })
          return html
        }

        function renderMagicMenu(m1, m2, m3) {
          var html = tmpl.magicMenu({
            magic1: m1,
            magic2: m2,
            magic3: m3
          })
          return html
        }

        $('.character').on('click', function (event) {
          event.preventDefault
          $('main').children('span.sub-menu').remove()
          $('main').children('span.battle-menu-turn').remove()
          var turn = $(this).attr('name')
          $('main').append(renderSubMenu(true, turn))
          attackClick()
          defendClick()
          magicClick()
          magicClickUse()
          runClick()
        })

        function attackClick() {
          $('main').on('click', '#attack', function (event) {
            event.preventDefault
            $('main').append(renderAttackMenu(monster, character))
          })
        }

        function defendClick() {
          $('main').on('click', '#defend', function (event) {
            event.preventDefault
             $('main').children('span.sub-menu').remove()
            console.log('you are defending')
          })
        }

        function magicClick() {
          $('main').on('click', '#magic', function (event) {
            event.preventDefault
            $('main').children('span.sub-menu').remove()
            $('main').append(renderMagicMenu('Cure', 'Fire', 'Blizzard'))
          })
        }

        function magicClickUse() {
          $('main').on('click', '#magic1', function (event) {
            console.log('hello')
            event.preventDefault
            $('main').append(renderAttackMenu(monster, character))
            $('span.menu-attack').addClass('magic-attack-menu')
            $('span.magic-attack-menu > li > button').removeClass('attack-character')
          })
        }

        function runClick() {
          $('main').on('click', '#run', function (event) {
            event.preventDefault
            $('main').children('span.sub-menu').remove()
          })
        }



        // if (terrain === 'desert') {
        //     enemyCountDesert()
        //   } else if (terrain === 'grass') {

        //   } else if (terrain === 'forest') {

        //   }
        // enemyCountDesert()
        // turnOrder(true, 1)
        // monsterCollection.fetch().done(function (monsters) {
        //   console.log('got monster data')
        // })
      })
    })
  }

});

module.exports = TerrainBattle;
