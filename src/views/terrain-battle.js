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
    runAway = 0;
    var i = 0;
    var monsters = [];
    var readyForArray = []
    var speedArray = []

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

              // console.log(monstersWithStats[(i - 1)])

              $('main').append('<section class="enemy' + i + ' ' 
                + randomEnemy.classes + '"></section>');
              $('section.enemy' + i).data('nameOf', randomEnemy.name);
              $('section.enemy' + i).data('name', 'enemy' + i);
              readyForArray.push('enemy' + i)
              // console.log(monstersWithStats)
              speedArray.push(monstersWithStats[i - 1].monster.agility)
              
              console.log('you fight ' + randomEnemy.name);
              i++; 
            };
            console.log(readyForArray)
            console.log(speedArray)
            readyForArray.forEach(function (monster) {
              speed = speedArray.shift()
              speed = 10000 - (speed / 3.4)
              setTimeout(function () {
                turnArray.push(monster)
              }, speed)
            })
          };
          enemyCountTerrain(terrainType, monster);
          // console.log(monstersWithStats)
          
          $('span.hero1').addClass('battle-hero-position1-back battle-ff-sprite battle-sprite-size battle-hero-red-boy');
          $('span.hero2').addClass('battle-hero-position2-back battle-ff-sprite battle-sprite-size battle-hero-white-girl');
          characterWithStats.forEach(function (hero, index) {
            speed = hero.agility
            speed = 10000 - (speed / 1.4)
            setTimeout(function () {
              index += 1
              turnArray.push('hero' + index)
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

            while (i < length) {
              i++;
              enemy = (i + hasBeenKilled);
              nameOf = $('section.enemy' + enemy).data('nameOf');
              // console.log(nameOf)
              target = 'enemy' + enemy;
              monsters.push({ name: nameOf, target: target });
            };
            // console.log(monsters);
            var html = tmpl.attackMenu({
              monster: monsters,
              character: character
            });
            return html;
          };

          function renderMagicAttackMenu(monster, character) {
            $('span.battle-menu-turn + span.menu-attack').remove();
            $('span.battle-menu-turn + span.menu-magic').remove();
            length = $('section.enemy-sprites').length;
            i = 0;
            monsters = [];
            // console.log(i, monsters)
            // console.log(hasBeenKilled)

            while (i < length) {
              i++;
              enemy = (i + hasBeenKilled);
              nameOf = $('section.enemy' + enemy).data('nameOf');
              // console.log(nameOf)
              target = 'enemy' + enemy;
              monsters.push({ name: nameOf, target: target });
            };
            console.log(monsters);
            var html = tmpl.magicAttackMenu({
              monster: monsters,
              character: character
            });
            return html;
            };

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
          console.log(turnArray)
          // turnNow = turnArray.shift()
          // console.log(turnNow)
          
          function ifArrayValue() {
            if (turnArray.length === 0) {
              console.log('wtfdude')
              console.log(turnArray)
              setTimeout(function () {
                ifArrayValue()
              }, 1000)
            }
            else {
              if (!$('span').hasClass('turn')) {
                turnNow = turnArray.shift()
                console.log(turnNow)
                $('.' + turnNow).trigger('click')
              }
            }
          }
          ifArrayValue()

          // click event for each menu selection
          $('.character').on('click', function (event) {
            console.log(turnArray)
            event.preventDefault;
            $('main').children('span.sub-menu').remove();
            $('main').children('span.battle-menu-turn').remove();
            var turn = $(this).data('name');
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
            attackClick();
            defendClick();
            magicClick();
            magicClickUse();
            runClick();
          });

          // choose attack to see who you can attack
          function attackClick() {
            $('main').on('click', '#attack', function (event) {
              event.preventDefault;
              
              $('main').append(renderAttackMenu(monster, character));
            });
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
              console.log('z');
              if ($('span').hasClass('magic-attack-menu')) {
                $('#magic').trigger('click');
              }
              else if ($('span').hasClass('menu-magic')) {
                $('li.character-turn > button').trigger('click');
              }
              else if ($('span').hasClass('menu-attack')) {
                $('span.menu-attack').remove();
              }
              else {
                $('span.battle-menu-turn').remove();
                // $('span.battle-hero').removeClass('battle-hero-position1 battle-hero-position2 turn');
                $('li').removeClass('character-turn');
              };
            };
          }, false);

          // attacks who you chose and then compares stats to produce an
          // outcome
          (function () {
            $('main').on('click', 'span > div > button', function () {
              selectedName = $(this).data('name');
              sectionEnemy = $('section.' + selectedName);
              spanHero = $('span.' + selectedName);
              // console.log(selectedName)

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
                $('.turn').removeClass('battle-hero-position1 battle-hero-position2 turn');
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
        
         $('main').on('click', 'span.menu-magic + span > div > button', function (event) {
            event.preventDefault;
            // $('button[data-magic="Fire1"]').addClass('fire1');
            console.log('you chose fire');
            selectedName = $(this).data('name');
            // console.log(selectedName);
            sectionEnemy = $('section.' + selectedName);
            spanHero = $('span.' + selectedName);
            fireAttack = magicWithStats[1];
            console.log(fireAttack);
            console.log(selectedName);
          })

          $('main').on('click', 'button[data-magic="Cure1"]', function (event) {
            event.preventDefault;
            cureHp = magicWithStats[0];
            console.log(cureHp);
            // console.log(selectedName);
          });

          $('main').on('click', 'button[data-magic="Lightning1"]', function (event) {
            event.preventDefault;
            // $('button[data-magic="Lightning1"]').addClass('lightning1');
            console.log('you chose cure');
            selectedName = $(this).data('name');
            console.log(selectedName);
            sectionEnemy = $('section.' + selectedName);
            spanHero = $('span.' + selectedName);
            lightningAttack = magicWithStats[2];
            console.log(lightningAttack);
            console.log(selectedName);
          });

          enemyAttacked();
          
          function enemyAttacked() {
            $('main').on('click', 'span > div > button', function () {
              monsterTarget = monstersWithStats[indexOfTarget].monster;
              characterTarget = characterWithStats[turnIndex];
              characterToAttack = characterWithStats[indexOfTarget];
              hpFromAttack = (characterTarget.str * 20) - monsterTarget.def;
              // console.log(characterToAttack);
              // console.log('damage = ', hpFromAttack);

              if ($('[data-magic="Fire1"]').hasClass('fire1')) {
                sectionEnemy.append('<div class="fire1-magic"></div>');
                setTimeout(function () {
                  $('div.fire1-magic').addClass('fire1-magic-move');
                }, 500);
                setTimeout(function () {
                  $('div.fire1-magic').remove();
                }, 1000);
                console.log(characterTarget.magic, fireAttack);
                if ($('section').hasClass(selectedName)) {
                  hpFromAttack = (characterTarget.magic + fireAttack.str) - monsterTarget.def;
                  console.log('fire does ' + hpFromAttack + ' damage');
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
                  console.log('fire does ' + hpFromAttack + ' damage');
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
                console.log(characterTarget.magic, cureHp.str);
                if ($('section').hasClass(selectedName)) {
                  hpFromAttack = (characterTarget.magic + cureHp.str) + monsterTarget.def;
                  console.log('Cure heals ' + hpFromAttack + ' HP');
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
                  console.log('Cure heals ' + hpFromAttack + ' HP');
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
                  console.log('lightning deals ' + hpFromAttack + ' damage');
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
                  console.log('Lightning deals ' + hpFromAttack + ' damage');
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
                console.log('normal damage');
                if ($('section').hasClass(selectedName)) {
                  hpFromAttack = (characterTarget.str * 20) - monsterTarget.def;
                  console.log('normal deals ' + hpFromAttack + ' damage');
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
                  console.log('normal deals ' + hpFromAttack + ' damage');
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
                    console.log(monsterTarget.currentHp)
                    monsterTarget.currentHp = monsterTarget.currentHp + hpFromAttack;
                    console.log(monsterTarget.currentHp, 'currentHP')
                    if ((monsterTarget.currentHp) > monsterTarget.maxHp) {
                      monsterTarget.currentHp = monsterTarget.maxHp;
                      console.log(monsterTarget.currentHp, 'currentHP')
                    }
                  }
                  else if ($('span.' + selectedName)) {
                    characterToAttack.currentHp = characterToAttack.currentHp + hpFromAttack;
                    console.log(characterToAttack.currentHp, 'currentHp')
                    if ((characterToAttack.currentHp) > characterToAttack.maxHp) {
                      characterToAttack.currentHp = characterToAttack.maxHp
                      console.log(characterToAttack.currentHp, 'currentHp')
                    }
                  };
                }
                else {
                  if ($('section').hasClass(selectedName)) {
                    monsterTarget.currentHp = monsterTarget.currentHp - hpFromAttack;
                    // console.log(monsterTarget.currentHp, 'currentHp')
                    if ((monsterTarget.currentHp) >= 0) {
                      console.log('monster hp is ', monsterTarget.currentHp);
                    }
                    else {
                      expFromBattle += monsterTarget.expOnDefeat;
                      console.log('total exp', expFromBattle);
                      console.log('you killed ' + monsterTarget.name);
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
                      console.log(characterToAttack.currentHp)
                    }
                  };
                };
              }
              else {
                monsterTarget.currentHp = monsterTarget.currentHp - 1
                characterToAttack.currentHp = characterToAttack.currentHp - 1
                console.log(monsterTarget);
                console.log(monsterTarget.currentHp);
              };
              waitToBePushed = $('.turn').attr('class').slice(0, 5)
              setTimeout(function () {
                if ($('section').hasClass('enemy-sprites')) {
                  console.log('continue');
                  speed = 10000 - ((characterTarget.agility * 1000) / 1.4)
                  console.log(speed)
                  setTimeout(function () {

                  }, speed)

                } 
                else {
                  var characterExp = 0;
                  console.log(character[0]);
                  characterModels = characterCollection.models;
                  characterModels.forEach(function (toon) {
                    toon.addExp(expFromBattle, toon);
                    expUtils.calcExpTNL(toon.attributes.exp)
                    
                  });
                  console.log('you win and you got ', expFromBattle, ' exp!');
                  hero1Model = characterModels[0].attributes
                  hero2Model = characterModels[1].attributes
                  $('div.battle > div').append('<div class="level-up">' 
                    + hero1Model.name + ' got ' + expFromBattle + 'Exp</div>')
                  
                  oldExp = hero1Model.exp - expFromBattle
                  oldLvlCalc = expUtils.calcLevel(oldExp)
                  console.log(oldExp) 
                  newExp = hero1Model.exp
                  console.log(newExp)
                  newLvlCalc = expUtils.calcLevel(newExp)


                  // timeToTurn();
                };
              }, 1200);
              $('span.battle-menu-turn').remove();
            });
          };

          function enemyToCharacterDamage() {
            $('main').on('click', 'section.enemy-sprites', function () {
              $(this).addClass('turn')
              console.log(this)
              indexMonster = ($(this).data('name').slice(5, 6)) - 1
              monsterAttack = monstersWithStats[indexMonster].monster;
              randomIndex = _.random(0, 1);
              if ($('span.battle-hero').hasClass('dead')) {
                if ($('span.dead').hasClass('hero1')) { randomIndex = 1 } 
                else { randomIndex = 0};
              // console.log(randomIndex, 'this')
              }
              characterToAttack = characterWithStats[randomIndex];
              // console.log(characterToAttack)

              hpFromAttack = monsterAttack.str - characterToAttack.def + 10;
              // console.log(hpFromAttack)
              if (hpFromAttack > 0) {
                if (hpFromAttack >= characterToAttack.currentHp) {
                  characterToAttack.currentHp = 0;
                  console.log('hp', characterToAttack.currentHp);
                  console.log('character died');
                  $('span.hero' + (randomIndex + 1)).addClass('dead');
                  if ($('span.hero1').hasClass('dead') && $('span.hero2').hasClass('dead')) {
                    characterToAttack.currentHp = 0;
                    console.log('gameover');
                  } else { 
                    console.log('continue on');
                  }
                }
                else {
                  characterToAttack.currentHp = characterToAttack.currentHp - hpFromAttack;
                };

              }
              else { 
                hpFromAttack = 1;
                characterToAttack.currentHp = characterToAttack.currentHp - hpFromAttack;

              };
              console.log(characterToAttack.currentHp)
              character = characterWithStats
              console.log(terrainType, character)
              $('div.battle-menu-main-stats').remove()
              $('main > div > div').append(renderStats(character))
              waitToBePushed = $('.turn').attr('class').slice(0,6)
                console.log(waitToBePushed)
              setTimeout(function () {
                turnArray.push(waitToBePushed)
                console.log(turnArray)
                setTimeout(function () {
                  $('.turn').removeClass('turn')
                }, 2000)
              }, 3000)
              ifArrayValue()
            })
          }
          enemyToCharacterDamage()

          function defendClick(turn, who) {
            $('main').on('click', '#defend', function (event) {
              var turn = $('.turn');
              if (turn) {
                turn.removeClass('turn').addClass('defense');
              };
              event.preventDefault;
              $('main').children('span.sub-menu').remove();
              console.log('you are defending');
            });
          };

          function magicClick() {
            $('main').on('click', '#magic', function (event) {
              event.preventDefault;
              $('main').children('span.sub-menu').remove();
              $('main').append(tmpl.magicMenu(characterWithStats[turnIndex]));
            });
          };

          function magicClickUse() {
            $('main').on('click', '[data-magic="Fire1"]', function (event) {
              $('button[data-magic="Fire1"]').addClass('fire1');
              $('button').removeClass('cure1 lightning1');
              console.log('you chose fire');
              console.log('fire1 attack');
              event.preventDefault;
              $('main').append(renderAttackMenu(monster, character));
              $('span.menu-attack').addClass('magic-attack-menu');
            });
             $('main').on('click', '[data-magic="Cure1"]', function (event) {
              $('button[data-magic="Cure1"').addClass('cure1');
              $('button').removeClass('fire1 lightning1');
              console.log('cure hp');
              event.preventDefault;
              $('main').append(renderAttackMenu(monster, character));
              $('span.menu-attack').addClass('magic-attack-menu');
              $('span.magic-attack-menu > div > button').removeClass('attack-character');
            });
            $('main').on('click', '[data-magic="Lightning1"]', function (event) {
              $('button[data-magic="Lightning1"]').addClass('lightning1');
              $('button').removeClass('cure1 fire1');
              console.log('you chose lightning');
              console.log('lightning1 attack');
              event.preventDefault;
              $('main').append(renderAttackMenu(monster, character));
              $('span.menu-attack').addClass('magic-attack-menu');
            });
          };

          function runClick() {
        
            $('main').on('click', '#run', function (event) {
              event.preventDefault;
              var ranNum = _.random(0,1);
              
              $('main').children('span.sub-menu').remove();
              $('.battle-hero').addClass('run1 run2').removeClass('turn');
              if ($('.battle-hero').hasClass('stop-this')) {
                clearInterval(runAway);
                $('.battle-hero').removeClass('stop-this');
                console.log('running');
                runAway = setInterval(function () {
                  console.log('running away');
                  $('.battle-hero').toggleClass('run2').addClass('stop-this');
                }, 200);
              }
              else {
                runAway = setInterval(function () {
                  console.log('running away');
                  $('.battle-hero').toggleClass('run2').addClass('stop-this');
                }, 200) ; 
              };

              if (ranNum) {
                setTimeout(function () {
                  clearInterval(runAway);
                  console.log('You Ran Away!');
                  App.router.navigate('/game/', { trigger: true });
                }, 3000);
              }
              else {
                setTimeout(function () {
                  clearInterval(runAway);
                  console.log('You couldn\'t escape!');
                  $('.battle-hero').removeClass('run1 run2');
                  clearInterval(runAway);
                }, 3000);
              };
            });
          };

          function timeToTurn() {
            var time = characterTarget.agility;
            time = (100 - time) * 30;
            setTimeout(function () {
              console.log('heyo');
              App.router.navigate('/game/', { trigger: true });
            }, time);
          };
        });
      });
    });
  }
});

module.exports = TerrainBattle;
