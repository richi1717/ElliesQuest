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
    var monstersWithStats = []
    var characterWithStats = []
    var indexOfTarget
    var turnIndex
    var monsterTarget
    var characterTarget
    var hpFromAttack
    var sectionEnemyTarget
    var spanHeroTarget
    
    character.fetch().done(function (character) {

      monster.fetch().done(function (monster) {
        
        _this.$el.html(renderTerrain(terrainType, character))

        function characterDbInfo(characters) {
          characters.forEach(function (person) {
            characterWithStats.push({ character: person })
          })
        }
        characterDbInfo(character)
        


        function enemyCountTerrain(terrainType, monsters) {
          var count = _.random(1, 5)
          var i = 1
          var position
          while (count >= i) {
            var randomEnemy = _.sample(_.where(monsters, { sections: [terrainType] }))
            position = 'enemy' + i

            monstersWithStats.push({ monster: randomEnemy })

            
            $('main').append('<section class="enemy' + i + ' ' + randomEnemy.classes + '" data-name="' + randomEnemy.name + '"></section>')
            
            console.log('you fight ' + randomEnemy.name)
            i++ 
          }
        }
        enemyCountTerrain(terrainType, monster)
        console.log(monstersWithStats)
        
        $('span.hero1').addClass('battle-hero-position1-back battle-ff-sprite battle-sprite-size battle-hero-red-boy')
        $('span.hero2').addClass('battle-hero-position2-back battle-ff-sprite battle-sprite-size battle-hero-white-girl')
        
        var turnOrder = function (turn, who) {

          if (turn) {
            $('span.battle-hero').removeClass('battle-hero-position1 battle-hero-position2 turn')
            $('span.hero' + who).removeClass('battle-hero-position' + who + '-front').addClass('battle-hero-position' + who + ' turn')
            $('.battle-menu-main > li').removeClass('character-turn')
            $('.battle-menu-main > li:nth-child(' + who + ')').addClass('character-turn')
            if ($('.defense') && $('.turn')) {
              $('.turn').removeClass('defense')
            }
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
            var nameOf = $('section.enemy' + i).data('name')
            var target = 'enemy' + i
            monsters.push({ name: nameOf, target: target })
          }

          var html = tmpl.attackMenu({
            monster: monsters,
            character: character
          })
          return html
        }

        function findStats(monsters, characters) {
          $('')

        }


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

        var runningTimer

        $('.character').on('click', function (event) {
          event.preventDefault
          $('main').children('span.sub-menu').remove()
          $('main').children('span.battle-menu-turn').remove()
          var turn = $(this).attr('name')
          turnIndex = turn - 1

          $('main').append(renderSubMenu(true, turn))
          $('.battle-hero').removeClass('run1 run2')
          clearInterval(runningTimer)
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

        function attackIndividualClick() {
          $('main').on('click', 'span > div > button', function () {
            $('div.selected').remove()
            var selectedName = $(this).attr('name')
            var sectionEnemy = $('section.' + selectedName)
            var spanHero = $('span.' + selectedName)
            if ($('section').hasClass(selectedName)) {
              sectionEnemy.append('<div class="selected"></div>')

              indexOfTarget = sectionEnemy.attr('class')
              sectionEnemyTarget = indexOfTarget.slice(0, 6)
              console.log(sectionEnemyTarget)
              indexOfTarget = indexOfTarget.slice(5,6)
              indexOfTarget = indexOfTarget - 1
              return indexOfTarget

            }
            if ($('span.' + selectedName)) {
              spanHero.append('<div class="selected"></div>')
              indexOfTarget = spanHero.attr('class')
              spanHeroTarget = indexOfTarget.slice(0, 5)
              indexOfTarget = indexOfTarget.slice(4,5)
              indexOfTarget = indexOfTarget - 1
              return indexOfTarget

            }
            console.log(selectedName)
          })

        }
        attackIndividualClick()
        
        $('main').on('click', 'span > div > button', function () {
          monsterTarget = monstersWithStats[indexOfTarget].monster
          characterTarget = characterWithStats[turnIndex].character
          console.log(characterTarget.agility)
          console.log(characterTarget.str, monsterTarget.def)
          hpFromAttack = characterTarget.str - monsterTarget.def
          console.log(hpFromAttack)
          if (hpFromAttack > 0) {
              monsterTarget.currentHp = monsterTarget.currentHp - hpFromAttack
            if (monsterTarget.currentHp >= 0) {
              console.log(monsterTarget.currentHp)
            } 
              console.log('you killed ' + monsterTarget.name)
              console.log(sectionEnemyTarget)
              $('section.' + sectionEnemyTarget).remove()

          } else {
            console.log('you did no damage')
          }
          if ($('section').hasClass('enemy-sprites')) {
            console.log('continue')
          } else {
            console.log('you win')
          timeToTurn()
          }
        })

        function defendClick(turn, who) {
          $('main').on('click', '#defend', function (event) {
            var turn = $('.turn')
            if (turn) {
              turn.removeClass('turn').addClass('defense')
            }

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
            $('span.magic-attack-menu > div > button').removeClass('attack-character')
          })
        }

        function runClick() {
          var runningAway
          $('main').on('click', '#run', function (event) {
            event.preventDefault
            if (!runningAway) {
              $('main').children('span.sub-menu').remove()
              $('.battle-hero').addClass('run1').removeClass('turn')
 
              runningAway = true
              runningTimer = setInterval(function () {
                $('.battle-hero').toggleClass('run2')
              }, 200)
            }         
          })
        }

        function timeToTurn() {
          var time = characterTarget.agility
          time = (100 - time) * 30
          setTimeout(function () {
            console.log('heyo')
            App.router.navigate('/game/', { trigger: true })
          }, time)
        }




        
        



        function battleFight() {

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
