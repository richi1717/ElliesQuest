var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var Handlebars = require('hbsfy/runtime');

var tmpl = require('../template.js');

// Collections
var characterCollection = require('../collections/character.js');
var magicCollection = require('../collections/magic.js');

// Models
var Character = require('../models/character.js');
var Monster = require('../models/monster.js');
var Magic = require('../models/magic.js');

// Utilites
var magicUtils = require('../../utility/magic-function.js');
var attackUtils = require('../../utility/attack-function.js');
var expUtils = require('../../utility/calcLevel.js')

// App
var App = require('../app');

// View: List Users
var TerrainBattle = Backbone.View.extend({
  el: $('main'),

  collection: App.Collections.monster,

  render: function (terrainType) {
    var _this = this;
    var monsterCollection = this.collection;
    var character = new Character;
    var monster = new Monster;
    var magic = new Magic;
    var terrainType = terrainType;
    var monstersWithStats = [];
    var characterWithStats = [];
    var magicWithStats = [];
    var totalExp = [];
    var hasBeenKilled = 0;
    var runAway = 0;
    var expFromBattle = 0;
    var i = 0;
    var monsters = [];
    var readyForArray = []
    var speedArray = []
    var gotAway = 0


    clearInterval(runAway);

    
    characterCollection.fetch().done(function (character) {

      monster.fetch().done(function (monster) {

        magicCollection.fetch().done(function (magics) {

          // Prevent arrow keys from scrolling
          window.addEventListener("keydown", function(e) {
            if([37, 38, 39, 40].indexOf(e.which) > -1) {
              e.preventDefault();
            }
          }, false);

          _this.$el.html(renderTerrain(terrainType, character));
          // _this.$el.append(renderStats(character))

          // Get all the characters data
          function characterDbInfo(characters) {
            characterCollection.forEach(function (character, index) {
              // console.log(character.attributes)

              characterWithStats.push( character.attributes );
              if (character.attributes.currentHp === 0) {
                $('span.hero' + character.attributes.id).addClass('dead')
                // console.log('dead')
              }
              // console.log(characterWithStats[index])
            })
          }
          characterDbInfo(character);

          // Get all the magics data
          function magicDbInfo(magics) {
            magicCollection.forEach(function (magic, index) {
              // console.log(magic.attributes)

              magicWithStats.push( magic.attributes );
              // console.log(magicWithStats[index])
            })
          }
          magicDbInfo(magic);

          // Get random enemies
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
            var count = _.random(1, 5);
            var i = 1;
            var position = 0;
            while (count >= i) {
              var randomEnemy = getRandomEnemy(terrainType, monsters);
              monstersWithStats.push({ monster: randomEnemy });
              monstersWithStats[i - 1].monster.battleName = 'enemy' + i

              // console.log(monstersWithStats[(i - 1)])

              $('main').append('<section class="enemy' + i + ' ' 
                + randomEnemy.classes + '"></section>');
              $('section.enemy' + i).data('nameOf', randomEnemy.name);
              $('section.enemy' + i).data('name', 'enemy' + i);
              readyForArray.push('enemy' + i)
              // console.log(monstersWithStats)
              speedArray.push(monstersWithStats[i - 1].monster.agility)
              
              // console.log('you fight ' + randomEnemy.name);
              i++; 
            };
            // console.log(readyForArray)
            // console.log(speedArray)
            readyForArray.forEach(function (monster) {
              speed = speedArray.shift()
              speed = 1000 - speed
              setTimeout(function () {
                turnArray.push(monster)
              }, speed)
            })
          };
          enemyCountTerrain(terrainType, monster);
          // console.log(monstersWithStats)
          
          $('span.hero1').addClass('battle-hero-position1-back battle-ff-sprite battle-sprite-size battle-hero-red-boy');
          $('span.hero2').addClass('battle-hero-position2-back battle-ff-sprite battle-sprite-size battle-hero-white-girl');
          characterWithStats.forEach(function (hero) {
            speed = hero.agility
            // speed = 8000 - (speed * .71428571)
            speed = 1000 - speed
            setTimeout(function () {
              // index += 1
              console.log(hero)
              turnArray.push(hero.battleName)
            }, speed)
          })
          
          var turnOrder = function (turn, who) {

            if (turn) {
              $('span.battle-hero').removeClass('battle-hero-position1 battle-hero-position2 hero-turn turn');
              $('span.hero' + who).removeClass('battle-hero-position' + who + '-front').addClass('battle-hero-position' + who + ' hero-turn turn');
              $('.battle-menu-main > li').removeClass('character-turn');
              $('.battle-menu-main > li:nth-child(' + who + ')').addClass('character-turn');
              if ($('.defense') && $('.turn')) {
                $('.turn').removeClass('defense');
              };
            };
          };

          function renderSubMenu(turn, who) {
            turnOrder(turn, who);
            var html = tmpl.battleMenu({});
            return html
          }

          function renderStats(character) {
            var html = tmpl.hpMp({ character: character });
            return html
          }
          
          function renderAttackMenu(monster, character) {
            $('span.battle-menu-turn + span.menu-attack').remove();
            // console.log('attack');
            length = $('section.enemy-sprites').length;
            // console.log(length);
            i = 0;
            monsters = [];
            // console.log(i, monsters)
            // console.log(hasBeenKilled)
            monstersWithStats.forEach(function (monster, index) {
              console.log(monster.monster.currentHp, index)
              // monster.monster.battleName = 'enemy' + (index +1)
              console.log(monstersWithStats)
              if (monster.monster.currentHp <= 0) {
                console.log('suckit')
                monstersWithStats.splice(index, 1)
                console.log(monstersWithStats)
                // console.log(monstersWithStats)
                // nameOf = $('section.enemy' + (index + 2)).data('nameOf');
                // // console.log(nameOf)
                // target = 'enemy' + (index + 2);
                // monsters.push({ name: nameOf, target: target });
                // console.log($('section.enemy' + (index + 2)).data('nameOf'))
              } 
            
            })
            monstersWithStats.forEach(function (monster) {
              console.log(monstersWithStats)
              nameOf = $('section.' + (monster.monster.battleName)).data('nameOf');
              // console.log(nameOf)
              target = monster.monster.battleName;
              monsters.push({ name: nameOf, target: target });
              console.log($('section.' + (monster.monster.battleName)).data('nameOf'))
            })
            // while (i < length) {
            //   console.log(monstersWithStats[i].monster)
            //   if (monstersWithStats[i].monster.currentHp <= 0) {
            //     i++ 
            //     console.log(monstersWithStats[i])
            //     console.log('finish him')
            //     enemy = i + 1
            //   } else {
            //     i++;
            //     console.log('continue on my friend')
            //   enemy = i;
            //   }
            //   console.log('Work on this today!!!!!!!!!!!!!!!!!!!!!')
            // };
            // console.log(monsters);
            var html = tmpl.attackMenu({
              monster: monsters,
              character: character
            });
            return html;
          };

          // function renderMagicAttackMenu(monster, character) {
          //   $('span.battle-menu-turn + span.menu-attack').remove();
          //   $('span.battle-menu-turn + span.menu-magic').remove();
          //   console.log(monstersWithStats)
          //   length = $('section.enemy-sprites').length;
          //   i = 0;
          //   monsters = [];
          //   // console.log(i, monsters)
          //   // console.log(hasBeenKilled)

          //   while (i < length) {
          //     i++;
          //     enemy = (i + hasBeenKilled);

          //     nameOf = $('section.enemy' + enemy).data('nameOf');
          //     // console.log(nameOf)
          //     target = 'enemy' + enemy;
          //     monsters.push({ name: nameOf, target: target });
          //   };
          //   console.log(monsters);
          //   var html = tmpl.magicAttackMenu({
          //     monster: monsters,
          //     character: character
          //   });
          //   return html;
          //   };

          // build map
          function renderTerrain(terrain, character) {

            var html = tmpl.terrainBattle({
              terrain: terrain,
              character: character
            });
            return html;
          };
          var turnArray = []
          var turnNow = 0
          // turnArray.push('hero1', 'hero2')
          // console.log(turnArray)
          // turnNow = turnArray.shift()
          // console.log(turnNow)
          
          function ifArrayValue() {
            if (turnArray.length === 0) {
              // console.log('wtfdude')
              console.log(turnArray)
              setTimeout(function () {
                ifArrayValue()
              }, 1000)
            }
            else {
              if (!$('span').hasClass('turn')) {
                turnNow = turnArray.shift()
                console.log(turnNow)
                if (_.find($('.' + turnNow)) === undefined || $('.' + turnNow).hasClass('dead')) {
                  // turnNow = turnArray.shift()
                  // console.log(turnNow)
                  ifArrayValue()
                } else {
                  // console.log(turnNow)
                  setTimeout(function () { 
                    $('.' + turnNow).addClass('turn')
                    $('.' + turnNow).trigger('click') 
                  }, 700)
                }
              } else {
                turnNow = turnArray.shift()
              }
            }
          }
          ifArrayValue()

          // click event for each menu selection
          $('.character').on('click', function (event) {
            if (!$(this).hasClass('turn')) {
              // console.log('nope')
              ifArrayValue()
            }
            else {
              // console.log(turnArray)
              event.preventDefault;
              $('main').children('span.sub-menu').remove();
              $('main').children('span.battle-menu-turn').remove();
              var turn = $(this).data('name').slice(4, 5);
              turnIndex = turn - 1;
              $('main').append(renderSubMenu(true, turn));
              if (!_.has(characterWithStats[turnIndex], 'magicAbilities')) {
                $('button#magic').removeAttr('id').addClass('no-moves')
              }
              $('.battle-hero').removeClass('run1 run2');
              $('span.hero' + turn).append('<div class="stop-this"></div>')
              if ($('div').hasClass('stop-this')) {
                clearTimeout(blinkingArrow);
                clearInterval(blinkingSelectorArrow);
                $('div.selected').remove();
              }
              else {
                blinkingArrow
              };
              $('div.stop-this').addClass('selected fade-in');
              clearInterval(runAway);
              clearInterval(blinkingArrow);
              $('main').one('click', '#attack', function (event) {
                attackClick();
              });
              $('main').one('click', '#defend', function (event) {
                defendClick();
              });
              $('main').on('click', '#magic', function (event) {
                magicClick();
              });
              $('main').one('click', '#run', function (event) {
                runClick();
              });
            }
          });

          // choose attack to see who you can attack
          function attackClick() {
            event.preventDefault;
            $('main').append(renderAttackMenu(monster, character));
            $('span.menu-magic').remove();

          };

          // put a cursor on the screen to show who you are attacking
          var blinkingArrow = setTimeout(blinkingSelectorArrow(), 1000); 
          function blinkingSelectorArrow() {
            setTimeout(function () {
              $('div.selected').toggleClass('fade').addClass('stop-this');
              blinkingSelectorArrow();
            }, 1000);
          };

          window.addEventListener("keydown", function(e) {
            if([90].indexOf(e.which) > -1) {
              e.preventDefault();
              // console.log('z');
              if ($('span').hasClass('magic-attack-menu')) {
                $('#magic').trigger('click');
                console.log('z')
              }
              else if ($('span').hasClass('menu-magic')) {
                $('li.character-turn > button').trigger('click');
              }
              else if ($('span').hasClass('menu-attack')) {
                $('span.menu-attack').remove();
              } 

              else {
                clearTimeout(blinkingArrow);
                clearInterval(blinkingSelectorArrow);
                $('span.battle-menu-turn').remove();
                // console.log('hapened')
                waitToBePushed = $('span.turn').attr('class').slice(0, 5)
                $('span.battle-hero').removeClass('turn battle-hero-position1 battle-hero-position2 hero-turn')
                // $('span.battle-hero').removeClass('battle-hero-position1 battle-hero-position2 turn');
                $('li').removeClass('character-turn');
                ifArrayValue()
                turnArray.unshift(waitToBePushed)
              };
            };
          }, false)

          // attacks who you chose and then compares stats to produce an
          // outcome
          ;(function () {
            $('main').on('click', 'span > div > button', function () {
              selectedName = $(this).data('name');
              sectionEnemy = $('section.' + selectedName);
              spanHero = $('span.' + selectedName);
              console.log(selectedName)

              if (!$('span.menu-attack').hasClass('magic-attack-menu')) {
                setTimeout(function () {
                  $('.turn').addClass('attack-' + selectedName);
                  setTimeout(function () {
                    $('.turn').addClass('battle-hero-attack');
                  }, 200);
                }, 300);
              };

              setTimeout(function () {
                $('.turn').removeClass('battle-hero-attack attack-' + selectedName);
                $('.turn').removeClass('battle-hero-position1 battle-hero-position2 hero-turn turn');
                $('li').removeClass('character-turn');
                $('div.stop-this').remove();
              }, 1200);
              
              if ($('section').hasClass(selectedName)) {
                indexOfTarget = sectionEnemy.data('name');
                sectionEnemyTarget = indexOfTarget;
                // console.log(indexOfTarget);
                indexOfTarget = indexOfTarget.slice(5,6);
                indexOfTarget = indexOfTarget - 1;
                return indexOfTarget;
              }
              else if ($('span.' + selectedName)) {
                spanHero.append('<div class="selected"></div>');
                indexOfTarget = selectedName.slice(4,5);
                // console.log(indexOfTarget)
                indexOfTarget = indexOfTarget - 1;
                return indexOfTarget;
              };

              // console.log(selectedName)
            });
          }());
        
         $('main').on('click', 'button[data-magic="Fire1"]', function (event) {
            event.preventDefault;
            // $('button[data-magic="Fire1"]').addClass('fire1');
            // console.log('you chose fire');
            selectedName = $(this).data('name');
            // console.log(selectedName);
            sectionEnemy = $('section.' + selectedName);
            spanHero = $('span.' + selectedName);
            fireAttack = magicWithStats[1];
            mpFromAttack = magicWithStats[1].mpCost;
            // console.log(fireAttack);
            // console.log(selectedName);
          })

          $('main').on('click', 'button[data-magic="Cure1"]', function (event) {
            event.preventDefault;
            cureHp = magicWithStats[0];
            mpFromAttack = magicWithStats[0].mpCost;
            // console.log(cureHp);
            // console.log(selectedName);
          });

          $('main').on('click', 'button[data-magic="Lightning1"]', function (event) {
            event.preventDefault;
            // $('button[data-magic="Lightning1"]').addClass('lightning1');
            // console.log('you chose lightning');
            selectedName = $(this).data('name');
            // console.log(selectedName);
            sectionEnemy = $('section.' + selectedName);
            spanHero = $('span.' + selectedName);
            lightningAttack = magicWithStats[2];
            mpFromAttack = magicWithStats[2].mpCost;
            // console.log(lightningAttack);
            // console.log(selectedName);
          });

          $('main').on('click', 'span > div > button', function () {
            enemyAttacked();
          });

          
          function enemyAttacked() {
            monstersWithStats.forEach(function (monster) {
              if (monster.monster.battleName === selectedName) {

                monsterTarget = monster.monster
                console.log(monsterTarget.name)
              }
            })
              // monsterTarget = monstersWithStats[indexOfTarget].monster;
              characterTarget = characterWithStats[turnIndex];
              characterToAttack = characterWithStats[indexOfTarget];
              hpFromAttack = (characterTarget.str * 20) - (monsterTarget.def * 5);
              // console.log(characterToAttack);
              // console.log('damage = ', hpFromAttack);

              if ($('[data-magic="Fire1"]').hasClass('fire1')) {

                sectionEnemy.append('<div class="fire1-magic"></div>').delay(400)
                setTimeout(function () {
                  $('div.fire1-magic').addClass('fire1-magic-move');
                }, 600);
                setTimeout(function () {
                  $('div.fire1-magic').remove();
                }, 1000);
                // console.log(characterTarget.magic, fireAttack);
                if ($('section').hasClass(selectedName)) {
                  hpFromAttack = (characterTarget.magic + fireAttack.str) - monsterTarget.def;
                  characterTarget.currentMp = characterTarget.currentMp - mpFromAttack
                  // console.log('fire does ' + hpFromAttack + ' damage');
                  setTimeout(function () {
                    $('section.' + selectedName).append('<div class="damage-display">' + 
                      hpFromAttack + '</div>')
                    setTimeout(function () {
                      $('div.damage-display').remove()
                    }, 1000)
                  }, 400)
                }
                else if ($('span.' + selectedName)) {
                  hpFromAttack = (characterTarget.magic + fireAttack.str) - characterToAttack.def;
                  characterTarget.currentMp = characterTarget.currentMp - mpFromAttack
                  // console.log('fire does ' + hpFromAttack + ' damage');
                  setTimeout(function () {
                    $('span.' + selectedName).append('<div class="damage-display">' + 
                      hpFromAttack + '</div>')
                    setTimeout(function () {
                      $('div.damage-display').remove()
                    }, 1000)
                  }, 400)
                }

              } 
              else if ($('[data-magic="Cure1"]').hasClass('cure1')) {
                $('button').removeClass('fire1 lightning1');
                sectionEnemy.append('<div class="cure1-magic"></div>');
                setTimeout(function () {
                  $('div.cure1-magic').addClass('cure1-magic-move');
                }, 500);
                setTimeout(function () {
                  $('div.cure1-magic').remove();
                }, 1000);
                // console.log(characterTarget.magic, cureHp.str);
                if ($('section').hasClass(selectedName)) {
                  hpFromAttack = (characterTarget.magic + cureHp.str) + monsterTarget.def;
                  characterTarget.currentMp = characterTarget.currentMp - mpFromAttack
                  // console.log('Cure heals ' + hpFromAttack + ' HP');
                  setTimeout(function () {
                    $('section.' + selectedName).append('<div class="damage-display">' + 
                      hpFromAttack + '</div>')
                    setTimeout(function () {
                      $('div.damage-display').remove()
                    }, 1000)
                  }, 400)
                }
                else if ($('span.' + selectedName)) {
                  hpFromAttack = (characterTarget.magic + cureHp.str) + characterToAttack.def;
                  characterTarget.currentMp = characterTarget.currentMp - mpFromAttack
                  // console.log('Cure heals ' + hpFromAttack + ' HP');
                  setTimeout(function () {
                    $('span.' + selectedName).append('<div class="damage-display">' + 
                      hpFromAttack + '</div>')
                    setTimeout(function () {
                      $('div.damage-display').remove()
                    }, 1000)
                  }, 400)
                }
              }
              else if ($('[data-magic="Lightning1"]').hasClass('lightning1')) {
                $('button').removeClass('fire1 cure1');
                sectionEnemy.append('<div class="lightning1-magic"></div>');
                sectionEnemy.append('<div class="cloud-magic"></div>');
                setTimeout(function () {
                  $('div.lightning1-magic').addClass('lightning1-magic-move');
                }, 500);
                setTimeout(function () {
                  setTimeout(function () {
                    $('div.lightning1-magic').remove();
                    $('div.cloud-magic').remove();
                  }, 500);
                  $('div.lightning1-magic').removeClass('lightning1-magic-move');
                }, 1000);
                if ($('section').hasClass(selectedName)) {
                  hpFromAttack = (characterTarget.magic + lightningAttack.str) - monsterTarget.def;
                  characterTarget.currentMp = characterTarget.currentMp - mpFromAttack
                  // console.log('lightning deals ' + hpFromAttack + ' damage');
                  setTimeout(function () {
                    $('section.' + selectedName).append('<div class="damage-display">' + 
                      hpFromAttack + '</div>')
                    setTimeout(function () {
                      $('div.damage-display').remove()
                    }, 1000)
                  }, 400)
                }
                else if ($('span.' + selectedName)) {
                  hpFromAttack = (characterTarget.magic + lightningAttack.str) - characterToAttack.def;
                  characterTarget.currentMp = characterTarget.currentMp - mpFromAttack
                  // console.log('Lightning deals ' + hpFromAttack + ' damage');
                  setTimeout(function () {
                    $('span.' + selectedName).append('<div class="damage-display">' + 
                      hpFromAttack + '</div>')
                    setTimeout(function () {
                      $('div.damage-display').remove()
                    }, 1000)
                  }, 400)
                }
              }
              else {
                // console.log('normal damage');
                if ($('section').hasClass(selectedName)) {
                  hpFromAttack = (characterTarget.str * 20) - (monsterTarget.def * 5);
                  // console.log('normal deals ' + hpFromAttack + ' damage');
                  setTimeout(function () {
                    $('section.' + selectedName).append('<div class="damage-display">' + 
                      hpFromAttack + '</div>')
                    setTimeout(function () {
                      $('div.damage-display').remove()
                    }, 1000)
                  }, 400)
                }
                else if ($('span.' + selectedName)) {
                  hpFromAttack = (characterTarget.str) - characterToAttack.def;
                  // console.log('normal deals ' + hpFromAttack + ' damage');
                  setTimeout(function () {
                    $('span.' + selectedName).append('<div class="damage-display">' + 
                      hpFromAttack + '</div>')
                    setTimeout(function () {
                      $('div.damage-display').remove()
                    }, 1000)
                  }, 400)
                }
                
                setTimeout(function () {
                  $('section.' + selectedName).append('<div class="damage-display">' + 
                    hpFromAttack + '</div>')
                  setTimeout(function () {
                    $('div.damage-display').remove()
                  }, 1000)
                }, 400)

              };

              if (hpFromAttack > 0) {
                if ($('[data-magic="Cure1"]').hasClass('cure1')) {
                  if ($('section').hasClass(selectedName)) {
                    // console.log(monsterTarget.currentHp)
                    monsterTarget.currentHp = monsterTarget.currentHp + hpFromAttack;
                    // console.log(monsterTarget.currentHp, 'currentHP')
                    if ((monsterTarget.currentHp) > monsterTarget.maxHp) {
                      monsterTarget.currentHp = monsterTarget.maxHp;
                      // console.log(monsterTarget.currentHp, 'currentHP')
                    }
                  }
                  else if ($('span.' + selectedName)) {
                    characterToAttack.currentHp = characterToAttack.currentHp + hpFromAttack;
                    // console.log(characterToAttack.currentHp, 'currentHp')
                    if ((characterToAttack.currentHp) > characterToAttack.maxHp) {
                      characterToAttack.currentHp = characterToAttack.maxHp
                      // console.log(characterToAttack.currentHp, 'currentHp')
                    }
                  };
                }
                else {
                  if ($('section').hasClass(selectedName)) {
                    monsterTarget.currentHp = monsterTarget.currentHp - hpFromAttack;
                    // console.log(monsterTarget.currentHp, 'currentHp')
                    if ((monsterTarget.currentHp) >= 0) {
                      // console.log('monster hp is ', monsterTarget.currentHp);
                    }
                    else {
                      expFromBattle += monsterTarget.expOnDefeat;
                      // console.log('total exp', expFromBattle);
                      // console.log('you killed ' + monsterTarget.name);
                      hasBeenKilled = hasBeenKilled + 1;
                      // console.log(hasBeenKilled);
                      setTimeout(function () {
                        $('section.' + sectionEnemyTarget).remove();
                        $('div > button.' + sectionEnemyTarget + '-position').remove();
                      }, 1200);
                    };
                  }
                  else if ($('span.' + selectedName)) {
                    characterToAttack.currentHp = characterToAttack.currentHp - hpFromAttack;
                    if ((characterToAttack.currentHp) >= 0) {
                      // console.log(characterToAttack.currentHp)
                    }
                  };
                };
              }
              else {
                monsterTarget.currentHp = monsterTarget.currentHp - 1
                characterToAttack.currentHp = characterToAttack.currentHp - 1
                // console.log(monsterTarget);
                // console.log(monsterTarget.currentHp);
              };
              waitToBePushed = $('span.turn').attr('class').slice(0, 5)
              // console.log(waitToBePushed)
              // speed = 8000 - ((characterTarget.agility * 100) * .71428571)
              // console.log(speed)
              // setTimeout(function () {
                turnArray.push(waitToBePushed)
                // console.log(turnArray)
              // }, speed)
              setTimeout(function () {
                if ($('section').hasClass('enemy-sprites')) {
                  // console.log('continue');
                  ifArrayValue()
                } 
                else {
                  var characterExp = 0;
                  // console.log(character[0]);
                  var endBattleMsgs = []
                  var lvldUp = false
                  characterModels = characterCollection.models;
                  characterModels.forEach(function (toon) {
                    var toonExp = toon.addExp(expFromBattle, toon);
                    // console.log(toonExp)
                    var str1 = toonExp.str
                    var def1 = toonExp.def
                    var maxHp1 = toonExp.maxHp
                    var maxMp1 = toonExp.maxMp
                    var accuracy1 = toonExp.accuracy
                    var magic1 = toonExp.magic
                    var evade1 = toonExp.evade
                    var agility1 = toonExp.agility
                    if (toonExp !== false) {
                      lvldUp = true
                      endBattleMsgs.push(
                        toon.get('name') + ' got ' + expFromBattle + 'Exp',
                        ' and gained a level', 
                        '+' + str1 + 'Str +' + def1 + 'Def +' + maxHp1 + 'MaxHp +' + maxMp1 + 'MaxMp',
                        '+' + accuracy1 + 'Accuracy +' + magic1 + 'Magic +' + evade1 + 'Evade +' + agility1 + 'Agility'
                      )

                      // $('main').one('click', function () {
                      //   $('div.level-up').text('and gained a level!')
                      //   $('main').one('click', function () {
                      //     $('div.level-up').text('+' + str1 + 'Str +' + def1 + 'Def +' + maxHp1 + 'MaxHp +' + maxMp1 + 'MaxMp')
                      //     $('main').one('click', function () {
                      //       $('div.level-up').text('+' + accuracy1 + 'Accuracy +' + magic1 + 'Magic +' + evade1 + 'Evade +' + agility1 + 'Agility')
                      //     })
                      //   })
                      // })
                    } else {
                      endBattleMsgs.push(toon.get('name') + ' got ' + expFromBattle + 'Exp')
                    }
                    
                  });
                  if (lvldUp) {
                    $('div.battle > div').append('<div class="level-up">' + endBattleMsgs.shift() + '</div>')
                    $('div.battle').on('click', function () {
                      var nextLine = endBattleMsgs.shift()
                      if (nextLine) {
                        $('div.level-up').text(nextLine)
                      } else {
                        // console.log('ended')
                        clearInterval(runAway)
                        clearTimeout(gotAway)
                        App.router.navigate('/game/', { trigger: true })
                      }
                    })
                    
                    
                  } else {
                    $('div.battle > div').append('<div class="level-up">' + endBattleMsgs.shift() + '</div>')
                    $('div.battle').on('click', function () {
                      var nextLine = endBattleMsgs.shift()
                      if (nextLine) {
                        $('div.level-up').text(nextLine)
                      } else {
                        // console.log('ended')
                        clearInterval(runAway)
                        clearTimeout(gotAway)
                        App.router.navigate('/game/', { trigger: true })
                      }
                    })
                  }
                  // console.log(endBattleMsgs)
                  // console.log('you win and you got ', expFromBattle, ' exp!');
                  hero1Model = characterModels[0].attributes
                  hero2Model = characterModels[1].attributes
                  // $('div.battle > div').append('<div class="level-up">' 
                  //   + hero1Model.name + ' got ' + expFromBattle + 'Exp</div>')
                  
                  oldExp = hero1Model.exp - expFromBattle
                  oldLvlCalc = expUtils.calcLevel(oldExp)
                  // console.log(oldExp) 
                  newExp = hero1Model.exp
                  // console.log(newExp)
                  newLvlCalc = expUtils.calcLevel(newExp)


                  // timeToTurn();
                };
              }, 1800);
              $('div.battle-menu-main-stats').remove()
              // console.log(character)
              $('main > div > div').append(renderStats(character))
              $('span.battle-menu-turn').remove();
          };

          $('main').on('click', 'section.enemy-sprites', function () {
            enemyTurn = $(this).attr('class').slice(0, 6)
            enemyTurnToAttack()
            // console.log(enemyTurn)
            // console.log('enemyattacking')
          })
          function enemyTurnToAttack() {
            console.log(enemyTurn)
            if (!$('.' + enemyTurn).hasClass('turn')) {
              // console.log(enemyTurn)
              ifArrayValue()
            }
            else {
              $('.' + enemyTurn).addClass('turn')
              console.log(enemyTurn)
              // indexMonster = ($(enemyTurn).data('name').slice(5, 6)) - 1
              // console.log(indexMonster + ' !!759')
              monstersWithStats.forEach(function (monster) {
                if (monster.monster.battleName === enemyTurn) {
                  console.log(enemyTurn, 'this worked')
                  enemyTurn = '.' + enemyTurn
                  monsterAttack = monster.monster
                  console.log(monster.monster)
                }
              })
              // monsterAttack = monstersWithStats[indexMonster].monster;
              randomIndex = _.random(0, 1);
              if ($('span.battle-hero').hasClass('dead')) {
                // console.log('dead')
                if ($('span.hero1').hasClass('dead')) { 
                  randomIndex = 1 
                  // console.log("heryeo")
                } else { 
                  randomIndex = 0
                  // console.log("heryeoeeee")
                };
              // console.log(randomIndex, 'this')
              };
              $(enemyTurn).addClass('monster-attack-hero' + (randomIndex + 1))
              setTimeout(function () {
                $(enemyTurn).removeClass('monster-attack-hero' + (randomIndex + 1))
              }, 1000)
              // console.log(randomIndex, ' this is randomIndex')
              characterToAttack = characterWithStats[randomIndex];
              // console.log(characterToAttack)
              setTimeout(function () {
                $('span.hero' + (randomIndex + 1)).append('<div class="damage-display">' + 
                  hpFromAttack + '</div>')
                setTimeout(function () {
                  $('div.damage-display').remove()
                }, 1000)
              }, 400)
              // console.log(characterToAttack.name, 'thisname')
              hpFromAttack = _.ceil((monsterAttack.str * 5) - (characterToAttack.def * 1.6));
              // console.log(hpFromAttack)
              if (hpFromAttack > 0) {
                if (hpFromAttack >= characterToAttack.currentHp) {
                  characterToAttack.currentHp = 0;
                  // console.log('hp', characterToAttack.currentHp);
                  // console.log('character died');
                  $('span.hero' + (randomIndex + 1)).removeClass('defense').addClass('dead');
                  if ($('span.hero1').hasClass('dead') && $('span.hero2').hasClass('dead')) {
                    characterToAttack.currentHp = 0;
                    // console.log('gameover');
                    setTimeout(function () {
                      $('div.battle > div').append('<div class="level-up">You Lose!</div>')
                    }, 1000)
                    setTimeout(function () {
                      clearInterval(runAway)
                      App.router.navigate('/game-over/', { trigger: true });
                    }, 4000)
                  } else { 
                    
                    // console.log('continue on');
                    waitToBePushed = $('.turn').attr('class').slice(0,6)
                    // console.log(waitToBePushed)
                    // setTimeout(function () {
                    turnArray.push(waitToBePushed)
                    // console.log(turnArray)
                    setTimeout(function () {
                      $('.turn').removeClass('turn')
                      ifArrayValue()
                    }, 2000)
                  }
                } else {
                  characterToAttack.currentHp = characterToAttack.currentHp - hpFromAttack;
                  waitToBePushed = $('.turn').attr('class').slice(0,6)
                  // console.log(waitToBePushed)
                  // setTimeout(function () {
                  turnArray.push(waitToBePushed)
                  // console.log(turnArray)
                  setTimeout(function () {
                    $('.turn').removeClass('turn')
                    ifArrayValue()
                  }, 2000)
                };
              } else { 
                hpFromAttack = 1;
                characterToAttack.currentHp = characterToAttack.currentHp - hpFromAttack;
                waitToBePushed = $('.turn').attr('class').slice(0,6)
                // console.log(waitToBePushed)
                // setTimeout(function () {
                turnArray.push(waitToBePushed)
                // console.log(turnArray)
                setTimeout(function () {
                  $('.turn').removeClass('turn')
                  ifArrayValue()
                }, 2000)
              };
              // console.log(characterToAttack.currentHp)
              character = characterWithStats
              // console.log(terrainType, character)
              $('div.battle-menu-main-stats').remove()
              $('main > div > div').append(renderStats(character))
              // }, 3000)
              // console.log('next one please')
            }
          }

          function defendClick(turn, who) {
              var turn = $('.turn');
              if (turn) {
                // console.log($('span.turn').attr('class'))
                waitToBePushed = $('span.turn').attr('class').slice(0, 5)
                turn.removeClass('hero-turn turn').addClass('defense');
                $('span.battle-menu-turn').remove()
                // setTimeout(function () {
                  turnArray.push(waitToBePushed)
                  // console.log(turnArray)
                  setTimeout(function () {
                    $('span.turn').removeClass('turn')
                    ifArrayValue()
                  }, 2000)
                // }, 3000)
              };
              event.preventDefault;
              $('main').children('span.sub-menu').remove();
              // console.log('you are defending');
          };

          function magicClick() {
            
              magicClickUse()
              event.preventDefault;
              $('main').children('span.sub-menu').remove();
              $('main').append(tmpl.magicMenu(characterWithStats[turnIndex]));
          };

          function magicClickUse() {
            // console.log('I was called')
            $('main').one('click', '[data-magic="Fire1"]', function (event) {
              characterTarget = characterWithStats[turnIndex];
              // console.log(characterTarget.currentMp)
              $('button[data-magic="Fire1"]').addClass('fire1');
              $('button').removeClass('cure1 lightning1');
              // console.log('you chose fire');
              // console.log('fire1 attack');
              event.preventDefault;
              $('main').append(renderAttackMenu(monster, character));
              $('span.menu-attack').addClass('magic-attack-menu');
            });
             $('main').one('click', '[data-magic="Cure1"]', function (event) {
              $('button[data-magic="Cure1"').addClass('cure1');
              $('button').removeClass('fire1 lightning1');
              // console.log('cure hp');
              event.preventDefault;
              $('main').append(renderAttackMenu(monster, character));
              $('span.menu-attack').addClass('magic-attack-menu');
              $('span.magic-attack-menu > div > button').removeClass('attack-character');
            });
            $('main').one('click', '[data-magic="Lightning1"]', function (event) {
              $('button[data-magic="Lightning1"]').addClass('lightning1');
              $('button').removeClass('cure1 fire1');
              // console.log('you chose lightning');
              // console.log('lightning1 attack');
              event.preventDefault;
              $('main').append(renderAttackMenu(monster, character));
              $('span.menu-attack').addClass('magic-attack-menu');
            });
          };

          function runClick() {
        
            
              event.preventDefault;
              var ranNum = _.random(0,1);
              
              $('main').children('span.sub-menu').remove();
              $('.battle-hero').addClass('run1 run2').removeClass('hero-turn turn');
              if ($('.battle-hero').hasClass('stop-this')) {
                clearInterval(runAway);
                $('.battle-hero').removeClass('stop-this');
                // console.log('running');
                runAway = setInterval(function () {
                  // console.log('running away');
                  $('.battle-hero').toggleClass('run2').addClass('stop-this');
                }, 200);
              }
              else {
                runAway = setInterval(function () {
                  // console.log('running away');
                  $('.battle-hero').toggleClass('run2').addClass('stop-this');
                }, 200) ; 
              };

              if (ranNum) {
                gotAway = setTimeout(function () {
                  clearInterval(runAway);
                  // console.log('You Ran Away!');
                  App.router.navigate('/game/', { trigger: true });
                }, 3000);
              }
              else {
                setTimeout(function () {
                  // clearInterval(runAway);
                  // console.log('You couldn\'t escape!');
                  $('.battle-hero').removeClass('run1 run2');
                  clearInterval(runAway);
                }, 3000);
              };
          };

          // function timeToTurn() {
          //   var time = characterTarget.agility;
          //   time = (100 - time) * 30;
          //   setTimeout(function () {
          //     console.log('heyo');
          //     // App.router.navigate('/game/', { trigger: true });
          //   }, time);
          // };
        });
      });
    });
  }
});

module.exports = TerrainBattle;
