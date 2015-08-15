var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash')
var Handlebars = require('hbsfy/runtime');

var tmpl = require('../template.js')

// Collections
var characterCollection = require('../collections/character.js')
var magicCollection = require('../collections/magic.js')


// Models
var Character = require('../models/character.js')
var Monster = require('../models/monster.js')
var Magic = require('../models/magic.js')

// Utilites
var magicUtils = require('../../utility/magic-function.js')
var attackUtils = require('../../utility/attack-function.js')


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
    var magic = new Magic
    var terrainType = terrainType
    var monstersWithStats = []
    var characterWithStats = []
    var magicWithStats = []
    var totalExp = []
    var hasBeenKilled = 0
    var runAway = 0
    var expFromBattle = 0
    runAway = 0
    clearInterval(runAway)
    
    characterCollection.fetch().done(function (character) {

      monster.fetch().done(function (monster) {

        magicCollection.fetch().done(function (magics) {

        
          _this.$el.html(renderTerrain(terrainType, character))

          function characterDbInfo(characters) {
            characterCollection.forEach(function (character, index) {
              console.log(character.attributes)

              characterWithStats.push( character.attributes )
              // console.log(characterWithStats[index])
            })
          }
          characterDbInfo(character)

          function magicDbInfo(magics) {
            magicCollection.forEach(function (magic, index) {
              console.log(magic.attributes)

              magicWithStats.push( magic.attributes )
              // console.log(magicWithStats[index])
            })
          }
          magicDbInfo(magic)

          function getRandomEnemy(terrainType, monsters) {
            return _.assign({},_.sample(_.where(monsters, { 
              sections: [terrainType] 
            })), {
              id: Date.now()
            })
          }

          // Check to see how may enemies join the battle based
          // on what terrain the battle takes place on and then 
          // randomize which enemies show up
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

          function renderMagicAttackMenu(monster, character) {
            $('span.battle-menu-turn + span.menu-attack').remove()
            $('span.battle-menu-turn + span.menu-magic').remove()
            length = $('section.enemy-sprites').length
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

            var html = tmpl.magicMenu({
              monster: monsters,
              character: character
            })
            return html
            }

          // build map
          function renderTerrain(terrain, character) {

            var html = tmpl.terrainBattle({
              terrain: terrain,
              character: character
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
          // $('main').on('click', 'div > li > button', function () {
          //   if ($('div').hasClass('stop-this')) {
          //       clearTimeout(blinkingArrow)
          //       clearInterval(blinkingSelectorArrow)
          //       $('div.selected').remove()
          //     }
          // })
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
                clearInterval(blinkingSelectorArrow)
                $('div.selected').remove()
              }
              else {
                blinkingArrow
              }
              $('div.stop-this').addClass('selected fade-in')

              if ($('section').hasClass(selectedName)) {
                indexOfTarget = sectionEnemy.data('name')
                sectionEnemyTarget = indexOfTarget
                console.log(indexOfTarget)
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


        
         $('main').on('click', 'button[data-magic="Fire1"]', function (event) {
            event.preventDefault
            $('button[data-magic="Fire1"]').addClass('fire1')
            console.log('you chose fire')
            selectedName = $(this).data('name')
            console.log(selectedName)
            sectionEnemy = $('section.' + selectedName)
            spanHero = $('span.' + selectedName)
            fireAttack = magicWithStats[1]
            console.log(fireAttack)
            sectionEnemy.append('<div class="fire1-magic"></div>')
            setTimeout(function () {
              $('div.fire1-magic').remove()
            }, 1000)

            // if ($('section').hasClass(selectedName)) {
            //   console.log(sectionEnemy)
            //   indexOfTarget = sectionEnemy.data('name')
            //   sectionEnemyTarget = indexOfTarget
            //   indexOfTarget = indexOfTarget.slice(5,6)
            //   indexOfTarget = indexOfTarget - 1
            //   return indexOfTarget

            // }
            // if ($('span.' + selectedName)) {
            //   console.log('whatttt')
            //   spanHero.append('<div class="selected"></div>')
            //   indexOfTarget = spanHero.data('class')
            //   spanHeroTarget = indexOfTarget.slice(0, 5)
            //   indexOfTarget = indexOfTarget.slice(4,5)
            //   indexOfTarget = indexOfTarget - 1
            //   return indexOfTarget

            // }
            console.log(selectedName)
          })

          $('main').on('click', 'button[data-magic="Cure1"]', function (event) {
            event.preventDefault
            $('button[data-magic="Cure1"]').addClass('cure1')
            console.log('you chose cure')
            selectedName = $(this).data('name')
            console.log(selectedName)
            sectionEnemy = $('section.' + selectedName)
            spanHero = $('span.' + selectedName)
            cureHp = magicWithStats[0]
            console.log(cureHp)
            // sectionEnemy.append('<div class="fire1-magic"></div>')
            // setTimeout(function () {
            //   $('div.fire1-magic').remove()
            // }, 1000)

            console.log(selectedName)
          })

          

          enemyAttacked()
          
          function enemyAttacked() {
            $('main').on('click', 'span > div > button', function () {
              monsterTarget = monstersWithStats[indexOfTarget].monster
              characterTarget = characterWithStats[turnIndex]
              characterToAttack = characterWithStats[indexOfTarget]
              hpFromAttack = (characterTarget.str * 20) - monsterTarget.def
              // console.log(characterToAttack)
              console.log('-hp', hpFromAttack)
              if ($('[data-magic="Fire1"]').hasClass('fire1')) {
                console.log(characterTarget.magic, fireAttack)
                hpFromAttack = (characterTarget.magic + fireAttack.str) - monsterTarget.def
                console.log('fire does ' + hpFromAttack + ' damage')

              } else if ($('[data-magic="Cure1"]').hasClass('cure1')) {
                console.log(characterTarget.magic, cureHp)
                hpFromAttack = (characterTarget.magic + cureHp) + monsterTarget.def
              }
              else {
                console.log('normal damage')
                hpFromAttack = (characterTarget.str * 20) - monsterTarget.def
              }
              if (hpFromAttack > 0) {
                monsterTarget.currentHp = monsterTarget.currentHp - hpFromAttack

                if (monsterTarget.currentHp >= 0) {
                  console.log(monsterTarget.currentHp)
                } else {
                  expFromBattle += monsterTarget.expOnDefeat
                  
                  
                  console.log('total exp', expFromBattle)
    
                  console.log('you killed ' + monsterTarget.name)
                  hasBeenKilled = hasBeenKilled + 1
                  console.log(hasBeenKilled)
                  setTimeout(function () {
                    $('section.' + sectionEnemyTarget).remove()
                    $('div > button.' + sectionEnemyTarget + '-position').remove()
                    
                  }, 1200)
                }
    
              } else {
                monsterTarget.currentHp = monsterTarget.currentHp + hpFromAttack
                console.log(monsterTarget)
                console.log(monsterTarget.currentHp)
              }
              setTimeout(function () {
                if ($('section').hasClass('enemy-sprites')) {
                  console.log('continue')
                } else {
                  var characterExp = 0
                  console.log(character[0])
                  characterModels = characterCollection.models
                  characterModels.forEach(function (toon) {

                    toon.addExp(expFromBattle)
                    // toon.updateStats(curr)
      
                    // if (characterExp > toon.get('expTNL')) {
                    //   console.log('You leveled up!')
                    //   toon.set('level++')
      
                    // } else {
                    //   toon.expTNL = toon.expTNL - characterExp
                    //   console.log(toon.expTNL)
      
                    // }
                    // battleEndStats = {
                    //   "expTNL": toon.expTNL,
                    //   "exp": toon.exp,
                    //   "level": toon.level,
                    //   "currentHp": toon.currentHp
                    // }
                    // console.log(characterModels)
                    // characterModels[0].set(battleEndStats)
                    // characterModels[0].save().done(function () {
                    //   console.log('stats sent to db')
                    // });
                  })
                  console.log('you win and you got ', expFromBattle, ' exp!')
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
              $('main').append(tmpl.magicMenu(characterWithStats[turnIndex]))
            })
          }

          function magicClickUse() {
            $('main').on('click', '[data-magic="Fire1"]', function (event) {
              console.log('fire1 attack')
              event.preventDefault
              $('main').append(renderAttackMenu(monster, character))
              $('span.menu-attack').addClass('magic-attack-menu')
              $('span.magic-attack-menu > div > button').removeClass('attack-character')
            })
             $('main').on('click', '[data-magic="Cure1"]', function (event) {
              console.log('cure hp')
              event.preventDefault
              $('main').append(renderAttackMenu(monster, character))
              $('span.menu-attack').addClass('magic-attack-menu')
              $('span.magic-attack-menu > div > button').removeClass('attack-character')
            })
          }

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
    })
  }

});

module.exports = TerrainBattle;
