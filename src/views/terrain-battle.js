var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash')
var Handlebars = require('hbsfy/runtime');

var tmpl = require('../template.js')

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
    var totalExp = []
    var hasBeenKilled = 0
    var runAway
    runAway = 0
    clearInterval(runAway)
    
    character.fetch().done(function (character) {

      monster.fetch().done(function (monster) {
        
        _this.$el.html(renderTerrain(terrainType, character))

        function characterDbInfo(characters) {
          characters.forEach(function (person) {
            characterWithStats.push({ character: person })
          })
        }
        characterDbInfo(character)
        
        function getRandomEnemy(terrainType, monsters) {
          return _.assign({},_.sample(_.where(monsters, { 
            sections: [terrainType] 
          })), {
            id: Date.now()
          })
        }

        function enemyCountTerrain(terrainType, monsters) {
          var count = _.random(1, 5)
          var i = 1
          var position
          while (count >= i) {
            var randomEnemy = getRandomEnemy(terrainType, monsters)
            monstersWithStats.push({ monster: randomEnemy })

            console.log(monstersWithStats[(i - 1)])

            
            $('main').append('<section class="enemy' + i + ' ' 
              + randomEnemy.classes + '"></section>')
            $('section.enemy' + i).data('nameOf', randomEnemy.name)
            $('section.enemy' + i).data('name', 'enemy' + i)
            
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
          var i = 0
          var monsters = []

        function renderAttackMenu(monster, character) {
          $('span.battle-menu-turn + span.menu-attack').remove()
          console.log('attack')
          length = $('section.enemy-sprites').length
          console.log(length)
          i = 0
          monsters = []
          console.log(i, monsters)
          console.log(hasBeenKilled)

          while (i < length) {
            i++
            enemy = (i + hasBeenKilled)
            nameOf = $('section.enemy' + enemy).data('nameOf')
            console.log(nameOf)
            target = 'enemy' + enemy
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

        // build map
        function renderTerrain(terrain, character) {

          var html = tmpl.terrainBattle({
            terrain: terrain,
            character: character
          })
          return html
        }

        // build the magic sub-menu
        function renderMagicMenu(m1, m2, m3) {
          var html = tmpl.magicMenu({
            magic1: m1,
            magic2: m2,
            magic3: m3
          })
          return html
        }
        // click event for each menu selection
        $('.character').on('click', function (event) {
          event.preventDefault
          $('main').children('span.sub-menu').remove()
          $('main').children('span.battle-menu-turn').remove()
          var turn = $(this).data('name')
          turnIndex = turn - 1

          $('main').append(renderSubMenu(true, turn))
          $('.battle-hero').removeClass('run1 run2')
          clearInterval(runAway)
          clearInterval(blinkingArrow)
          attackClick()
          defendClick()
          magicClick()
          magicClickUse()
          runClick()
        })

        // choose attack to see who you can attack
        function attackClick() {
          $('main').on('click', '#attack', function (event) {
            event.preventDefault
            
            $('main').append(renderAttackMenu(monster, character))
          })
        }

        // put a cursor on the screen to show who you are attacking
        var blinkingArrow = setTimeout(blinkingSelectorArrow(), 1000) 
        function blinkingSelectorArrow() {
          setTimeout(function () {
            $('div.selected').toggleClass('fade').addClass('stop-this')
            blinkingSelectorArrow()
          }, 1000)   
        }

        // attacks who you chose and then compares stats to produce an
        // outcome
        (function () {
          $('main').on('click', 'span > div > button', function () {
            selectedName = $(this).data('name')
            sectionEnemy = $('section.' + selectedName)
            spanHero = $('span.' + selectedName)

            setTimeout(function () {
              $('.turn').addClass('attack-' + selectedName)
              setTimeout(function () {
                $('.turn').addClass('battle-hero-attack')
                
              }, 200)
              
            }, 300)
            setTimeout(function () {
              $('.turn').removeClass('battle-hero-attack attack-' + selectedName)
            }, 1200)
            sectionEnemy.append('<div class="stop-this"></div>')
            
            if ($('div').hasClass('stop-this')) {
              clearTimeout(blinkingArrow)
              $('div.selected').remove()
            }
            else {
              blinkingArrow
            }
            $('div.stop-this').addClass('selected fade-in')

            if ($('section').hasClass(selectedName)) {
              indexOfTarget = sectionEnemy.data('name')
              sectionEnemyTarget = indexOfTarget
              indexOfTarget = indexOfTarget.slice(5,6)
              indexOfTarget = indexOfTarget - 1
              return indexOfTarget

            }
            if ($('span.' + selectedName)) {
              spanHero.append('<div class="selected"></div>')
              indexOfTarget = spanHero.data('class')
              spanHeroTarget = indexOfTarget.slice(0, 5)
              indexOfTarget = indexOfTarget.slice(4,5)
              indexOfTarget = indexOfTarget - 1
              return indexOfTarget

            }
            console.log(selectedName)
          })

        }())
          enemyAttacked()
        
        function enemyAttacked() {
          $('main').on('click', 'span > div > button', function () {
            monsterTarget = monstersWithStats[indexOfTarget].monster
            characterTarget = characterWithStats[turnIndex].character
            hpFromAttack = (characterTarget.str * 5) - monsterTarget.def
            console.log('-hp', hpFromAttack)
            if (hpFromAttack > 0) {
              monsterTarget.currentHp = monsterTarget.currentHp - hpFromAttack

              if (monsterTarget.currentHp >= 0) {
                console.log(monsterTarget.currentHp)
              } else {
                expFromBattle = monsterTarget.expOnDefeat
                
                totalExp.push(expFromBattle)
                console.log(totalExp)
  
                console.log('you killed ' + monsterTarget.name)
                hasBeenKilled = hasBeenKilled + 1
                console.log(hasBeenKilled)
                setTimeout(function () {
                  $('section.' + sectionEnemyTarget).remove()
                  $('div > button.' + sectionEnemyTarget + '-position').remove()
                  
                }, 1200)
              }
  
            } else {
              console.log('you did no damage')
            }
            setTimeout(function () {
              if ($('section').hasClass('enemy-sprites')) {
                console.log('continue')
              } else {
                finalExp = 0
                totalExp.forEach(function (exp) {
                  finalExp = finalExp + exp
                })
                var characterExp = 0
                character.forEach(function (toon) {
                  characterExp = toon.exp + finalExp
                  console.log(characterExp)
    
                  if (characterExp > toon.expLeftToLevel) {
                    console.log('You leveled up!')
                    toon.level++
    
                  } else {
                    toon.expLeftToLevel = toon.expLeftToLevel - characterExp
                    console.log(toon.expLeftToLevel)
    
                  }
                })
                console.log('you win and you got ', finalExp, ' exp!')
                timeToTurn()
              }
            }, 1200)
          $('span.battle-menu-turn').remove()
          })
        }

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

        // function runningAway() {
        //   setTimeout(function () {
        //     console.log('running away');
        //     $('.battle-hero').toggleClass('run2').addClass('stop-this')
        //     runningAway()
        //   }, 200)   
        // }

        function runClick() {
      

          $('main').on('click', '#run', function (event) {
            event.preventDefault
            var ranNum = _.random(0,1)

            
            $('main').children('span.sub-menu').remove()
            $('.battle-hero').addClass('run1 run2').removeClass('turn')
            if ($('.battle-hero').hasClass('stop-this')) {
              clearInterval(runAway)
              $('.battle-hero').removeClass('stop-this')
              console.log('running')
              runAway = setInterval(function () {
                console.log('running away');
                $('.battle-hero').toggleClass('run2').addClass('stop-this')
              }, 200)   

            }
            else {

              runAway = setInterval(function () {
                console.log('running away');
                $('.battle-hero').toggleClass('run2').addClass('stop-this')
              }, 200)  
            }

            if (ranNum) {
              setTimeout(function () {
                clearInterval(runAway)
                console.log('You Ran Away!')
                App.router.navigate('/game/', { trigger: true })
              }, 3000)
            }
            else {
              setTimeout(function () {
                clearInterval(runAway)
                console.log('You couldn\'t escape!')
                $('.battle-hero').removeClass('run1 run2')
                clearInterval(runAway)
              }, 3000)
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



      })
    })
  }

});

module.exports = TerrainBattle;
