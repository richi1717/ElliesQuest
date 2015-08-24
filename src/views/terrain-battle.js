var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');
var Handlebars = require('hbsfy/runtime');

var tmpl = require('../template.js');

// Collections
var magicCollection = require('../collections/magic.js');
var itemCollection = require('../collections/items.js')

// Models
var Character = require('../models/character.js');
var Monster = require('../models/monster.js');
var Magic = require('../models/magic.js');
var Item = require('../models/item.js')

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
    var characterCollection = require('../collections/character.js');
    var _this = this;
    var monsterCollection = this.collection;
    var character = new Character;
    var monster = new Monster;
    var magic = new Magic;
    var item = new Item
    var terrainType = terrainType;
    var monstersWithStats = [];
    var characterWithStats = [];
    var magicWithStats = [];
    var itemsWithStats = []
    var totalExp = [];
    var hasBeenKilled = 0;
    var runAway = 0;
    var expFromBattle = 0;
    var i = 0;
    var monsters = [];
    var readyForArray = []
    var speedArray = []
    var gotAway = 0
    var monsterSpeed = 0
    var heroSpeed = 0
    var turnNow = 0
    var arrayCheck = 0
    var goingNext = 0
    var blinkingArrow = 0
    var arrowBlink = 0
    var attackMonster = 0
    var attackHero = 0
    var afterAttack = 0
    var enemyDead = 0
    var enemySprites = 0
    var leaveBattle = 0
    var characterExp = 0;
    var newStats = 0
    var enemyToHero = 0
    var heroAttacked = 0
    var remHeroAttacked = 0
    var lvlUpScreen = 0
    var gameDead = 0
    var remTurn = 0
    var didntGetAway = 0


    clearInterval(runAway);

    
    characterCollection.fetch().done(function (character) {

      monster.fetch().done(function (monster) {

        magicCollection.fetch().done(function (magics) {

          itemCollection.fetch().done(function (items) {

            // Prevent arrow keys from scrolling
            window.addEventListener("keydown", function(e) {
              if([37, 38, 39, 40].indexOf(e.which) > -1) {
                e.preventDefault();
              }
            }, false);

            _this.$el.html(renderTerrain(terrainType, character));
            $('div.battle').hide()
            $('div.battle').fadeIn(2500)
            
            // _this.$el.append(renderStats(character))

            // Get all the characters data
            function characterDbInfo(characters) {
              characterCollection.forEach(function (character, index) {
                // console.log(character.attributes)
                characterAttr = character.attributes
                characterWithStats.push( characterAttr );
                if (characterAttr.currentHp <= 0) {
                  $('span.hero' + (index + 1)).addClass('dead')
                  // console.log('dead')
                }
                $('span.hero' + (index + 1)).data('hero', 'hero' + (index + 1))
                var what = $('span.hero' + (index + 1)).data('hero')
                // console.log(what)
                // console.log(characterWithStats[index])
              })
            }
            characterDbInfo(character);

            // Get all the magics data
            function magicDbInfo(magics) {
              magicCollection.forEach(function (magic, index) {
                // console.log(magic.attributes)

                magicWithStats.push(magic.attributes);
                // console.log(magicWithStats[index])
              })
            }
            magicDbInfo(magic);

            function itemDbInfo(items) {
              itemCollection.forEach(function (item, index) {
                // console.log(item.attributes)
                itemsWithStats.push(item.attributes)
                // console.log(itemsWithStats)
              })
            }
            itemDbInfo(item)

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
                monsterSpeed = setTimeout(function () {
                  turnArray.push(monster)
                }, speed)
                timerArray.push(monsterSpeed)
              })
            };
            enemyCountTerrain(terrainType, monster);

            $('section.enemy-sprites').hide()
            $('section.enemy-sprites').fadeIn(2500)
            // console.log(monstersWithStats)
            
            $('span.hero1').addClass('battle-hero-position1-back battle-ff-sprite battle-sprite-size battle-hero-red-boy');
            $('span.hero2').addClass('battle-hero-position2-back battle-ff-sprite battle-sprite-size battle-hero-white-girl');
            characterWithStats.forEach(function (hero) {
              speed = hero.agility
              // speed = 8000 - (speed * .71428571)
              speed = 1000 - speed
              heroSpeed = setTimeout(function () {
                // index += 1
                // console.log(hero)
                turnArray.push(hero.battleName)
              }, speed)
              timerArray.push(heroSpeed)
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
                // console.log(monster.monster.currentHp, index)
                // monster.monster.battleName = 'enemy' + (index +1)
                // console.log(monstersWithStats)
                if (monster.monster.currentHp <= 0) {
                  // console.log('suckit')
                  monstersWithStats.splice(index, 1)
                  // console.log(monstersWithStats)
                  // console.log(monstersWithStats)
                  // nameOf = $('section.enemy' + (index + 2)).data('nameOf');
                  // // console.log(nameOf)
                  // target = 'enemy' + (index + 2);
                  // monsters.push({ name: nameOf, target: target });
                  // console.log($('section.enemy' + (index + 2)).data('nameOf'))
                } 
              
              })
              monstersWithStats.forEach(function (monster) {
                // console.log(monstersWithStats)
                nameOf = $('section.' + (monster.monster.battleName)).data('nameOf');
                // console.log(nameOf)
                target = monster.monster.battleName;
                monsters.push({ name: nameOf, target: target });
                // console.log($('section.' + (monster.monster.battleName)).data('nameOf'))
              })
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
            // turnArray.push('hero1', 'hero2')
            // console.log(turnArray)
            // turnNow = turnArray.shift()
            // console.log(turnNow)
            
            function ifArrayValue() {
              if (turnArray.length === 0) {
                // console.log('wtfdude')
                // console.log(turnArray)
                arrayCheck = setTimeout(function () {
                  ifArrayValue()
                }, 1000)
                timerArray.push(arrayCheck)
              }
              else {
                if (!$('span').hasClass('turn')) {
                  turnNow = turnArray.shift()
                  // console.log(turnNow)
                  // console.log(turnArray)
                  if (_.find($('.' + turnNow)) === undefined || $('.' + turnNow).hasClass('dead')) {
                    // turnNow = turnArray.shift()
                    // console.log(turnNow)
                    ifArrayValue()
                  } else {
                    // console.log(turnNow)
                    goingNext = setTimeout(function () { 
                      $('.' + turnNow).addClass('turn').trigger('click') 
                    }, 1000)
                    timerArray.push(goingNext)
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
                event.preventDefault();
                $('main').children('span.sub-menu').remove();
                $('main').children('span.battle-menu-turn').remove();
                var turn = $(this).data('name').slice(4, 5);
                turnIndex = turn - 1;
                $('main').append(renderSubMenu(true, turn));
                $('button#attack').focus()
                if (!_.has(characterWithStats[turnIndex], 'magicAbilities')) {
                  $('button#magic').removeAttr('id').addClass('no-moves')
                }
                $('.battle-hero').removeClass('run1 run2');
                // if ($('div').hasClass('stop-this')) {
                //   clearTimeout(blinkingArrow);
                //   clearTimeout(arrowBlink);
                //   $('div.selected').remove();
                // }
                // else {
                //   // blinkingArrow
                // };
                $('span.hero' + turn).append('<div class="stop-this"></div>')
                $('div.stop-this').addClass('selected fade-in');
                clearInterval(runAway);
                // clearTimeout(blinkingArrow);
              }
            });

            $('main').on('click', '#attack', function (event) {
              attackClick();
            });
            $('main').on('click', '#defend', function (event) {
              defendClick();
            });
            $('main').on('click', '#magic', function (event) {
              magicClick();
            });
            $('main').on('click', '#items', function (event) {
              itemClick()
            })
            $('main').on('click', '#run', function (event) {
              runClick();
            });
            // choose attack to see who you can attack
            function attackClick() {
              event.preventDefault();
              $('main').append(renderAttackMenu(monster, character));
              $('span > div:nth-child(1) > button').focus()
              $('span.menu-magic').remove();

            };

            // put a cursor on the screen to show who you are attacking
            blinkingArrow = setTimeout(blinkingSelectorArrow(), 1000); 
            // timerArray.push(blinkingArrow)
            function blinkingSelectorArrow() {
              setTimeout(function () {
                $('div.selected').toggleClass('fade').addClass('stop-this');
                blinkingSelectorArrow();
              }, 1000);
              // timerArray.push(arrowBlink)
            };

            window.addEventListener("keydown", function(e) {
              if([90].indexOf(e.which) > -1) {
                e.preventDefault();
                // console.log('z');
                if ($('span').hasClass('magic-attack-menu')) {
                  $('#magic').trigger('click');
                  // console.log('z')
                }
                else if ($('span').hasClass('menu-magic')) {
                  $('li.character-turn > button').trigger('click');
                }
                else if ($('span').hasClass('menu-attack')) {
                  $('span.menu-attack').remove();
                } 

                else {
                  $('div.selected').remove()
                  $('span.battle-menu-turn').remove();
                  // console.log('hapened')
                  waitToBePushed = $('span.turn').data('hero')
                  $('span.battle-hero').removeClass('turn battle-hero-position1 battle-hero-position2 hero-turn')
                  // $('span.battle-hero').removeClass('battle-hero-position1 battle-hero-position2 turn');
                  $('li').removeClass('character-turn');
                  ifArrayValue()
                  turnArray.unshift(waitToBePushed)
                };
              } else if ([40].indexOf(e.which) > -1) {
                console.log('down')
                $('button:focus').parent().next().children().focus()
              } else if ([38].indexOf(e.which) > -1) {
                $('button:focus').parent().prev().children().focus()
              }
            }, false)

            $('#battle').on('leave', function() {
              this.pause();
            });

            $('#victory').on('win', function () {
              this.play()
            })

            $('#victory').on('leave', function () {
              this.pause()
            })


            // attacks who you chose and then compares stats to produce an
            // outcome
            ;(function () {
              $('main').on('click', 'span > div > button', function () {
                if ($(this).data('use')) {
                  // console.log('blamagain')
                  selectedName = $(this).data('name');
                } else {

                  selectedName = $(this).data('name');
                  sectionEnemy = $('section.' + selectedName);
                  spanHero = $('span.' + selectedName);
                  // console.log(selectedName)
                  if (!$('span.menu-attack').hasClass('magic-attack-menu')) {
                    attackMonster = setTimeout(function () {
                      $('.turn').addClass('attack-' + selectedName);
                      attackHero = setTimeout(function () {
                        $('.turn').addClass('battle-hero-attack');
                      }, 200);
                      timerArray.push(attackMonster)
                    }, 300);
                    timerArray.push(attackHero)
                  };

                  afterAttack = setTimeout(function () {
                    $('.turn').removeClass('battle-hero-attack attack-' + selectedName);
                    $('.turn').removeClass('battle-hero-position1 battle-hero-position2 hero-turn turn');
                    $('li').removeClass('character-turn');
                    $('div.stop-this').remove();
                  }, 1200);
                  timerArray.push(afterAttack)
                  
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
                }
              });
            }());
          
           $('main').on('click', 'button[data-magic="Fire1"]', function (event) {
              event.preventDefault();
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
              event.preventDefault();
              cureHp = magicWithStats[0];
              mpFromAttack = magicWithStats[0].mpCost;
              // console.log(cureHp);
              // console.log(selectedName);
            });

            $('main').on('click', 'button[data-magic="Lightning1"]', function (event) {
              event.preventDefault();
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
              buttonName = $(this).text()
              if ($(this).data('use')) {
                // console.log(itemCheck.type)
                characterWithStats.forEach(function (character) {
                  if (character.name === buttonName) {
                    // console.log(buttonName)
                    characterToHeal = character
                  } 
                })
                if (itemCheck.type === 'HP restore') {
                  if (characterToHeal.currentHp <= 0) {
                    dmgDisplay = setTimeout(function () {
                      $('span.' + selectedName).append('<div class="damage-display">0</div>')
                      remDmgDis = setTimeout(function () {
                        $('div.damage-display').remove()
                      }, 1000)
                      timerArray.push(remDmgDis)
                    }, 400)
                    $('span.battle-menu-turn').remove()
                    newStats = setTimeout(function () {
                      waitToBePushed = $('span.turn').data('hero')
                      turnArray.push(waitToBePushed)
                      // console.log(6, turnArray)
                      $('span.turn').removeClass('hero-turn turn')
                      $('.character-turn').removeClass('character-turn')
                      $('div.selected').remove()
                      ifArrayValue()
                      
                    }, 1000)
                  } else {
                    if (itemCheck.str === "%") {
                      hpIncrease = _.ceil(characterToHeal.maxHp * (itemCheck.percentage))
                      characterToHeal.currentHp += hpIncrease
                      dmgDisplay = setTimeout(function () {
                        $('span.' + selectedName).append('<div class="damage-display">' + 
                          hpIncrease + '</div>')
                        remDmgDis = setTimeout(function () {
                          $('div.damage-display').remove()
                        }, 1000)
                        timerArray.push(remDmgDis)
                      }, 400)
                    } else {
                      characterToHeal.currentHp += itemCheck.str
                      dmgDisplay = setTimeout(function () {
                        $('span.' + selectedName).append('<div class="damage-display">' + 
                          itemCheck.str + '</div>')
                        remDmgDis = setTimeout(function () {
                          $('div.damage-display').remove()
                        }, 1000)
                        timerArray.push(remDmgDis)
                      }, 400)
                    }
                    if (characterToHeal.currentHp > characterToHeal.maxHp) {
                      characterToHeal.currentHp = characterToHeal.maxHp
                    }
                    $('span.battle-menu-turn').remove()
                    timerArray.push(dmgDisplay)
                    newStats = setTimeout(function () {
                      $('div.battle-menu-main-stats').remove()
                      $('main > div > div').append(renderStats(character))
                      waitToBePushed = $('span.turn').data('hero')
                      turnArray.push(waitToBePushed)
                      // console.log(6, turnArray)
                      $('span.turn').removeClass('hero-turn turn')
                      $('.character-turn').removeClass('character-turn')
                      $('div.selected').remove()
                      ifArrayValue()
                      
                    }, 1000)
                  }
                timerArray.push(newStats)
                } else if (itemCheck.type === "MP restore") {
                  if (characterToHeal.currentHp <= 0) {
                    dmgDisplay = setTimeout(function () {
                      $('span.' + selectedName).append('<div class="damage-display">0</div>')
                      remDmgDis = setTimeout(function () {
                        $('div.damage-display').remove()
                      }, 1000)
                      timerArray.push(remDmgDis)
                    }, 400)
                    $('span.battle-menu-turn').remove()
                    newStats = setTimeout(function () {
                      waitToBePushed = $('span.turn').data('hero')
                      turnArray.push(waitToBePushed)
                      // console.log(6, turnArray)
                      $('span.turn').removeClass('hero-turn turn')
                      $('.character-turn').removeClass('character-turn')
                      $('div.selected').remove()
                      ifArrayValue()
                      
                    }, 1000)
                  } else {
                    if (itemCheck.str === "%") {
                      mpIncrease = _.ceil(characterToHeal.maxMp * (itemCheck.percentage))
                      characterToHeal.currentMp += mpIncrease
                      dmgDisplay = setTimeout(function () {
                        $('span.' + selectedName).append('<div class="damage-display">' + 
                          mpIncrease + '</div>')
                        remDmgDis = setTimeout(function () {
                          $('div.damage-display').remove()
                        }, 1000)
                        timerArray.push(remDmgDis)
                      }, 400)
                    } else {
                      characterToHeal.currentMp += itemCheck.str
                      dmgDisplay = setTimeout(function () {
                        $('span.' + selectedName).append('<div class="damage-display">' + 
                          itemCheck.str + '</div>')
                        remDmgDis = setTimeout(function () {
                          $('div.damage-display').remove()
                        }, 1000)
                        timerArray.push(remDmgDis)
                      }, 400)
                    }
                    if (characterToHeal.currentMp > characterToHeal.maxMp) {
                      characterToHeal.currentMp = characterToHeal.maxMp
                    }
                    $('span.battle-menu-turn').remove()
                    timerArray.push(dmgDisplay)
                    newStats = setTimeout(function () {
                      $('div.battle-menu-main-stats').remove()
                      $('main > div > div').append(renderStats(character))
                      waitToBePushed = $('span.turn').data('hero')
                      turnArray.push(waitToBePushed)
                      // console.log(7, turnArray)
                      $('span.turn').removeClass('hero-turn turn')
                      $('.character-turn').removeClass('character-turn')
                      $('div.selected').remove()
                      ifArrayValue()
                      
                    }, 1000)
                  }
                timerArray.push(newStats)
                } else if (itemCheck.type === "HP MP restore") {
                  if (characterToHeal.currentHp <= 0) {
                    dmgDisplay = setTimeout(function () {
                      $('span.' + selectedName).append('<div class="damage-display">0</div>')
                      remDmgDis = setTimeout(function () {
                        $('div.damage-display').remove()
                      }, 1000)
                      timerArray.push(remDmgDis)
                    }, 400)
                    $('span.battle-menu-turn').remove()
                    newStats = setTimeout(function () {
                      waitToBePushed = $('span.turn').data('hero')
                      turnArray.push(waitToBePushed)
                      // console.log(6, turnArray)
                      $('span.turn').removeClass('hero-turn turn')
                      $('.character-turn').removeClass('character-turn')
                      $('div.selected').remove()
                      ifArrayValue()
                      
                    }, 1000)
                  } else {
                    if (itemCheck.str === "%") {
                      mpIncrease = characterToHeal.maxMp * itemCheck.percentage
                      hpIncrease = characterToHeal.maxHp * itemCheck.percentage
                      characterToHeal.currentMp += mpIncrease
                      characterToHeal.currentHp += hpIncrease
                      dmgDisplay = setTimeout(function () {
                        $('span.' + selectedName).append('<div class="damage-display">' + 
                          hpIncrease + 'HP/' +mpIncrease + 'MP</div>')
                        remDmgDis = setTimeout(function () {
                          $('div.damage-display').remove()
                        }, 1000)
                        timerArray.push(remDmgDis)
                      }, 400)
                    } else {
                      characterToHeal.currentMp += itemCheck.str
                      characterToHeal.currentHp += itemCheck.str
                      dmgDisplay = setTimeout(function () {
                        $('span.' + selectedName).append('<div class="damage-display">' + 
                          hpIncrease + 'HP/' +mpIncrease + 'MP</div>')
                        remDmgDis = setTimeout(function () {
                          $('div.damage-display').remove()
                        }, 1000)
                        timerArray.push(remDmgDis)
                      }, 400)
                    }
                    if (characterToHeal.currentMp > characterToHeal.maxMp) {
                      characterToHeal.currentMp = characterToHeal.maxMp
                    }
                    if (characterToHeal.currentHp > characterToHeal.maxHp) {
                      characterToHeal.currentHp = characterToHeal.maxHp
                    }
                    $('span.battle-menu-turn').remove()
                    timerArray.push(dmgDisplay)
                    newStats = setTimeout(function () {
                      $('div.battle-menu-main-stats').remove()
                      $('main > div > div').append(renderStats(character))
                      waitToBePushed = $('span.turn').data('hero')
                      turnArray.push(waitToBePushed)
                      // console.log(8, turnArray)
                      $('span.turn').removeClass('hero-turn turn')
                      $('.character-turn').removeClass('character-turn')
                      $('div.selected').remove()
                      ifArrayValue()
                      
                    }, 1000)
                  }
                timerArray.push(newStats)
                } else if (itemCheck.type === "Revive") {
                  if (characterToHeal.currentHp <= 0) {
                    if (itemCheck.str === "%") {
                      hpIncrease = _.ceil(characterToHeal.maxHp * (itemCheck.percentage))
                      characterToHeal.currentHp += hpIncrease
                      dmgDisplay = setTimeout(function () {
                        $('span.' + selectedName).removeClass('dead')
                        $('span.' + selectedName).append('<div class="damage-display">' + 
                          hpIncrease + '</div>')
                        remDmgDis = setTimeout(function () {
                          $('div.damage-display').remove()
                        }, 1000)
                        timerArray.push(remDmgDis)
                      }, 400)
                    } else {
                      characterToHeal.currentHp += itemCheck.str
                      dmgDisplay = setTimeout(function () {
                        $('span.' + selectedName).removeClass('dead')
                        $('span.' + selectedName).append('<div class="damage-display">' + 
                          itemCheck.str + '</div>')
                        remDmgDis = setTimeout(function () {
                          $('div.damage-display').remove()
                        }, 1000)
                        timerArray.push(remDmgDis)
                      }, 400)
                    }
                  } else {
                    $('span.' + selectedName).append('<div class="damage-display">0</div>')
                    remDmgDis = setTimeout(function () {
                      $('div.damage-display').remove()
                    }, 1000)
                    timerArray.push(remDmgDis)
                  }
                  $('span.battle-menu-turn').remove()
                  timerArray.push(dmgDisplay)
                  newStats = setTimeout(function () {
                    $('div.battle-menu-main-stats').remove()
                    $('main > div > div').append(renderStats(character))
                    waitToBePushed = $('span.turn').data('hero')
                    turnArray.push(waitToBePushed)
                    turnArray.push(selectedName)
                    // console.log(selectedName, waitToBePushed, turnArray)
                    $('span.turn').removeClass('hero-turn turn')
                    $('.character-turn').removeClass('character-turn')
                    $('div.selected').remove()
                    ifArrayValue()
                    
                  }, 1000)
                } else {
                  // console.log('error')
                }
              } else {
                enemyAttacked();
              }
            });
            
            function enemyAttacked() {
              monstersWithStats.forEach(function (monster) {
                if (monster.monster.battleName === selectedName) {

                  monsterTarget = monster.monster
                  // console.log(monsterTarget.name)
                }
              })
                // monsterTarget = monstersWithStats[indexOfTarget].monster;
                characterTarget = characterWithStats[turnIndex];
                characterToAttack = characterWithStats[indexOfTarget];
                // hpFromAttack = (characterTarget.str * 20) - (monsterTarget.def * 5);
                // console.log(characterToAttack);
                // console.log('damage = ', hpFromAttack);
                var fireMagic = 0
                var remFire = 0
                var dmgDisplay = 0
                var remDmgDis = 0
                var cureMagic = 0
                var remCureMagic = 0
                var lightningMagic = 0
                var remLightningMagic = 0
                if ($('[data-magic="Fire1"]').hasClass('fire1')) {
                  sectionEnemy.append('<div class="fire1-magic"></div>').delay(400)
                  fireMagic = setTimeout(function () {
                    $('div.fire1-magic').addClass('fire1-magic-move');
                  }, 600);
                  timerArray.push(fireMagic)
                  remFire = setTimeout(function () {
                    $('div.fire1-magic').remove();
                  }, 1000);
                  timerArray.push(remFire)
                  // console.log(characterTarget.magic, fireAttack);
                  if ($('section').hasClass(selectedName)) {
                    hpFromAttack = (characterTarget.magic + fireAttack.str) - monsterTarget.def;
                    characterTarget.currentMp = characterTarget.currentMp - mpFromAttack
                    // console.log('fire does ' + hpFromAttack + ' damage');
                    dmgDisplay = setTimeout(function () {
                      $('section.' + selectedName).append('<div class="damage-display">' + 
                        hpFromAttack + '</div>')
                      remDmgDis = setTimeout(function () {
                        $('div.damage-display').remove()
                      }, 1000)
                      timerArray.push(remDmgDis)
                    }, 400)
                    timerArray.push(dmgDisplay)
                  } else if ($('span.' + selectedName)) {
                    hpFromAttack = (characterTarget.magic + fireAttack.str) - characterToAttack.def;
                    characterTarget.currentMp = characterTarget.currentMp - mpFromAttack
                    // console.log('fire does ' + hpFromAttack + ' damage');

                    dmgDisplay = setTimeout(function () {
                      $('span.' + selectedName).append('<div class="damage-display">' + 
                        hpFromAttack + '</div>')
                      remDmgDis = setTimeout(function () {
                        $('div.damage-display').remove()
                      }, 1000)
                      timerArray.push(remDmgDis)
                    }, 400)
                    timerArray.push(dmgDisplay)
                  }

                } else if ($('[data-magic="Cure1"]').hasClass('cure1')) {
                  $('button').removeClass('fire1 lightning1');
                  sectionEnemy.append('<div class="cure1-magic"></div>');
                  cureMagic = setTimeout(function () {
                    $('div.cure1-magic').addClass('cure1-magic-move');
                  }, 500);
                  timerArray.push(cureMagic)
                  remCureMagic = setTimeout(function () {
                    $('div.cure1-magic').remove();
                  }, 1000);
                  timerArray.push(remCureMagic)
                  // console.log(characterTarget.magic, cureHp.str);
                  if ($('section').hasClass(selectedName)) {
                    hpFromAttack = (characterTarget.magic + cureHp.str) + monsterTarget.def;
                    characterTarget.currentMp = characterTarget.currentMp - mpFromAttack
                    // console.log('Cure heals ' + hpFromAttack + ' HP');
                    dmgDisplay = setTimeout(function () {
                      $('section.' + selectedName).append('<div class="damage-display">' + 
                        hpFromAttack + '</div>')
                      remDmgDis = setTimeout(function () {
                        $('div.damage-display').remove()
                      }, 1000)
                      timerArray.push(dmgDisplay)
                    }, 400)
                    timerArray.push(remDmgDis)
                  } else if ($('span.' + selectedName)) {
                    hpFromAttack = (characterTarget.magic + cureHp.str) + characterToAttack.def;
                    characterTarget.currentMp = characterTarget.currentMp - mpFromAttack
                    // console.log('Cure heals ' + hpFromAttack + ' HP');
                    dmgDisplay = setTimeout(function () {
                      $('span.' + selectedName).append('<div class="damage-display">' + 
                        hpFromAttack + '</div>')
                      remDmgDis = setTimeout(function () {
                        $('div.damage-display').remove()
                      }, 1000)
                      timerArray.push(remDmgDis)
                    }, 400)
                    timerArray.push(dmgDisplay)
                  }
                } else if ($('[data-magic="Lightning1"]').hasClass('lightning1')) {
                  $('button').removeClass('fire1 cure1');
                  sectionEnemy.append('<div class="lightning1-magic"></div>');
                  sectionEnemy.append('<div class="cloud-magic"></div>');
                  lightningMagic = setTimeout(function () {
                    $('div.lightning1-magic').addClass('lightning1-magic-move');
                  }, 500);
                  timerArray.push(lightningMagic)
                  remLightningMagic = setTimeout(function () {
                    remLightMagic = setTimeout(function () {
                      $('div.lightning1-magic').remove();
                      $('div.cloud-magic').remove();
                    }, 500);
                    timerArray.push(remLightMagic)
                    $('div.lightning1-magic').removeClass('lightning1-magic-move');
                  }, 1000);
                  timerArray.push(remLightningMagic)
                  if ($('section').hasClass(selectedName)) {
                    hpFromAttack = (characterTarget.magic + lightningAttack.str) - monsterTarget.def;
                    characterTarget.currentMp = characterTarget.currentMp - mpFromAttack
                    // console.log('lightning deals ' + hpFromAttack + ' damage');
                    dmgDisplay = setTimeout(function () {
                      $('section.' + selectedName).append('<div class="damage-display">' + 
                        hpFromAttack + '</div>')
                      remDmgDis = setTimeout(function () {
                        $('div.damage-display').remove()
                      }, 1000)
                      timerArray.push(remDmgDis)
                    }, 400)
                    timerArray.push(dmgDisplay)
                  } else if ($('span.' + selectedName)) {
                    hpFromAttack = (characterTarget.magic + lightningAttack.str) - characterToAttack.def;
                    characterTarget.currentMp = characterTarget.currentMp - mpFromAttack
                    // console.log('Lightning deals ' + hpFromAttack + ' damage');
                    dmgDisplay = setTimeout(function () {
                      $('span.' + selectedName).append('<div class="damage-display">' + 
                        hpFromAttack + '</div>')
                      remDmgDis = setTimeout(function () {
                        $('div.damage-display').remove()
                      }, 1000)
                      timerArray.push(remDmgDis)
                    }, 400)
                    timerArray.push(dmgDisplay)
                  }
                } else {
                  // console.log('normal damage');
                  if ($('section').hasClass(selectedName)) {
                    hpFromAttack = (characterTarget.str * 20) - (monsterTarget.def * 5);
                    // console.log('normal deals ' + hpFromAttack + ' damage');
                    dmgDisplay = setTimeout(function () {
                      $('section.' + selectedName).append('<div class="damage-display">' + 
                        hpFromAttack + '</div>')
                      remDmgDis = setTimeout(function () {
                        $('div.damage-display').remove()
                      }, 1000)
                      timerArray.push(remDmgDis)
                    }, 400)
                    timerArray.push(dmgDisplay)
                  } else if ($('span.' + selectedName)) {
                    if ($('span.' + selectedName).hasClass('defense')) {
                      hpFromAttack = (characterTarget.str) - (characterToAttack.def);
                      hpFromAttack /= 2
                      hpFromAttack = _.ceil(hpFromAttack)
                    } else {
                      hpFromAttack = (characterTarget.str) - characterToAttack.def;
                    }
                    // console.log('normal deals ' + hpFromAttack + ' damage');
                    dmgDisplay = setTimeout(function () {
                      $('span.' + selectedName).append('<div class="damage-display">' + 
                        hpFromAttack + '</div>')
                      remDmgDis = setTimeout(function () {
                        $('div.damage-display').remove()
                      }, 1000)
                      timerArray.push(remDmgDis)
                    }, 400)
                    timerArray.push(dmgDisplay)
                  }
                  
                  // setTimeout(function () {
                  //   $('section.' + selectedName).append('<div class="damage-display">' + 
                  //     hpFromAttack + '</div>')
                  //   setTimeout(function () {
                  //     $('div.damage-display').remove()
                  //   }, 1000)
                  // }, 400)

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
                        enemyDead = setTimeout(function () {
                          $('section.' + sectionEnemyTarget).remove();
                          $('div > button.' + sectionEnemyTarget + '-position').remove();
                        }, 1200);
                        timerArray.push(enemyDead)
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
                waitToBePushed = $('span.turn').data('hero')
                // turnArray.push(waitToBePushed)
                // console.log(waitToBePushed)
                // speed = 8000 - ((characterTarget.agility * 100) * .71428571)
                // console.log(speed)
                // setTimeout(function () {
                  // console.log(turnArray)
                // }, speed)
                enemySprites = setTimeout(function () {
                  if ($('section').hasClass('enemy-sprites')) {
                    // console.log('continue');
                    ifArrayValue()
                  } 
                  else {
                    $('#battle').trigger('leave')
                    leaveBattle = setTimeout(function () {
                      $('#victory').trigger('win')
                    }, 200)
                    timerArray.push(leaveBattle)

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
                          $('#victory').animate({volume: 0}, 2000)
                          $('div.battle').fadeOut(2000)
                          leaveBattle = setTimeout(function () {
                            $('#victory').trigger('leave')
                            App.router.navigate('/game/', { trigger: true })
                          }, 2000)
                          timerArray.push(leaveBattle)
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
                          $('#victory').animate({volume: 0}, 2000)
                          $('div.battle').fadeOut(2000)
                          leaveBattle = setTimeout(function () {
                            $('#victory').trigger('leave')
                            App.router.navigate('/game/', { trigger: true })
                          }, 2000)
                          timerArray.push(leaveBattle)
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
                timerArray.push(enemySprites)
                // console.log(character)
                newStats = setTimeout(function () {
                  $('div.battle-menu-main-stats').remove()
                  $('main > div > div').append(renderStats(character))
                  
                }, 1000)
                timerArray.push(newStats)
                $('span.battle-menu-turn').remove();
                turnArray.push(waitToBePushed)
            };

            $('main').on('click', 'section.enemy-sprites', function () {
              enemyTurn = $(this).data('name')
              enemyTurnToAttack()
              // console.log(enemyTurn)
              // console.log('enemyattacking')
            })
            function enemyTurnToAttack() {
              // console.log(enemyTurn)
              if (!$('.' + enemyTurn).hasClass('turn')) {
                // console.log(enemyTurn)
                ifArrayValue()
              } else {
                $('.' + enemyTurn).addClass('turn')
                // console.log(enemyTurn)
                // indexMonster = ($(enemyTurn).data('name').slice(5, 6)) - 1
                // console.log(indexMonster + ' !!759')
                monstersWithStats.forEach(function (monster) {
                  if (monster.monster.battleName === enemyTurn) {
                    // console.log(enemyTurn, 'this worked')
                    enemyTurn = '.' + enemyTurn
                    monsterAttack = monster.monster
                    // console.log(monster.monster)
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
                enemyToHero = setTimeout(function () {
                  $(enemyTurn).removeClass('monster-attack-hero' + (randomIndex + 1))
                }, 1000)
                timerArray.push(enemyToHero)
                // console.log(randomIndex, ' this is randomIndex')
                characterToAttack = characterWithStats[randomIndex];
                if ($('.hero' + (randomIndex + 1)).hasClass('defense')) {
                  hpFromAttack = _.ceil((monsterAttack.str * 5) - (characterToAttack.def * 1.6));
                  hpFromAttack /= 2
                  hpFromAttack = _.ceil(hpFromAttack)
                } else {
                  hpFromAttack = _.ceil((monsterAttack.str * 5) - (characterToAttack.def * 1.6));
                }
                // console.log(characterToAttack.name)
                heroAttacked = setTimeout(function () {
                  $('span.hero' + (randomIndex + 1)).append('<div class="damage-display">' + 
                    hpFromAttack + '</div>')
                  remHeroAttacked = setTimeout(function () {
                    $('div.damage-display').remove()
                  }, 1000)
                  timerArray.push(remHeroAttacked)
                }, 400)
                timerArray.push(heroAttacked)
                // console.log(characterToAttack.name, 'thisname')
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
                      lvlUpScreen = setTimeout(function () {
                        $('div.battle > div').append('<div class="level-up">You Lose!</div>')
                      }, 1000)
                      timerArray.push(lvlUpScreen)
                      $('#battle').animate({volume: 0}, 2000)
                      $('div.battle').fadeOut(2000)
                      gameDead = setTimeout(function () {
                        clearInterval(runAway)
                        $('#battle').trigger('leave')
                        App.router.navigate('/game-over/', { trigger: true });
                      }, 2000)
                      timerArray.push(gameDead)
                    } else { 
                      
                      // console.log('continue on');
                      waitToBePushed = $('section.turn').data('name')
                      // console.log(waitToBePushed)
                      // setTimeout(function () {
                      // turnArray.push(waitToBePushed)
                      // console.log(1, turnArray)
                      // console.log(turnArray)
                      remTurn = setTimeout(function () {
                        $('.turn').removeClass('turn')
                        ifArrayValue()
                      }, 2000)
                      timerArray.push(remTurn)
                    }
                  } else {
                    characterToAttack.currentHp = characterToAttack.currentHp - hpFromAttack;
                    waitToBePushed = $('section.turn').data('name')
                    // console.log(waitToBePushed)
                    // setTimeout(function () {
                    turnArray.push(waitToBePushed)
                    // console.log(2, turnArray)
                    // console.log(turnArray)
                    remTurn = setTimeout(function () {
                      $('.turn').removeClass('turn')
                      ifArrayValue()
                    }, 2000)
                    timerArray.push(remTurn)
                  };
                } else { 
                  hpFromAttack = 1;
                  characterToAttack.currentHp = characterToAttack.currentHp - hpFromAttack;
                  waitToBePushed = $('section.turn').data('name')
                  // console.log(waitToBePushed)
                  turnArray.push(waitToBePushed)
                  // console.log(3, turnArray)
                  // console.log(waitToBePushed)
                  // setTimeout(function () {
                  // console.log(turnArray)
                  remTurn = setTimeout(function () {
                    $('.turn').removeClass('turn')
                    ifArrayValue()
                  }, 2000)
                  timerArray.push(remTurn)
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
                // console.log($('span.turn').data('hero'))
                waitToBePushed = $('span.turn').data('hero')
                turn.removeClass('hero-turn turn').addClass('defense');
                $('span.battle-menu-turn').remove()
                $('div.selected').remove()
                turnArray.push(waitToBePushed)
                // console.log(4, turnArray)
                remTurn = setTimeout(function () {
                  $('span.turn').removeClass('turn')
                  ifArrayValue()
                }, 2000)
                timerArray.push(remTurn)
              };
              event.preventDefault();
              $('main').children('span.sub-menu').remove();
              // console.log('you are defending');
            };

            function magicClick() {
              event.preventDefault();
              $('main').children('span.sub-menu').remove();
              $('main').append(tmpl.magicMenu(characterWithStats[turnIndex]));
              magicClickUse()
            };

            function itemClick() {
              event.preventDefault()
              $('main').children('span.sub-menu').remove()
              $('main').append(tmpl.itemMenu(characterWithStats[turnIndex]))
              itemClickUse()
            }

            function itemClickUse() {
              $('main').on('click', '[data-items]', function (event) {
                itemsToUse = $(this).data('items')
                itemCheck = _.find(itemsWithStats, _.matchesProperty('name', itemsToUse))
                $('main').append(renderAttackMenu(monster, character))
                $('span.menu-attack').addClass('magic-attack-menu')
                $('span.magic-attack-menu > div > button').removeClass('attack-character').data('use', itemsToUse)
                // console.log($('span.magic-attack-menu > div > button').data('use'))
              })
            }

            function magicClickUse() {
              // console.log('I was called')
              $('main').one('click', '[data-magic="Fire1"]', function (event) {
                characterTarget = characterWithStats[turnIndex];
                // console.log(characterTarget.currentMp)
                $('button[data-magic="Fire1"]').addClass('fire1');
                $('button').removeClass('cure1 lightning1');
                // console.log('you chose fire');
                // console.log('fire1 attack');
                event.preventDefault();
                $('main').append(renderAttackMenu(monster, character));
                $('span.menu-attack').addClass('magic-attack-menu');
              });
              $('main').one('click', '[data-magic="Cure1"]', function (event) {
                $('button[data-magic="Cure1"').addClass('cure1');
                $('button').removeClass('fire1 lightning1');
                // console.log('cure hp');
                event.preventDefault();
                $('main').append(renderAttackMenu(monster, character));
                $('span.menu-attack').addClass('magic-attack-menu');
                $('span.magic-attack-menu > div > button').removeClass('attack-character');
              });
              $('main').one('click', '[data-magic="Lightning1"]', function (event) {
                $('button[data-magic="Lightning1"]').addClass('lightning1');
                $('button').removeClass('cure1 fire1');
                // console.log('you chose lightning');
                // console.log('lightning1 attack');
                event.preventDefault();
                $('main').append(renderAttackMenu(monster, character));
                $('span.menu-attack').addClass('magic-attack-menu');
              });
            };

            function runClick() {
              event.preventDefault();
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
                timerArray.push(runAway)
              } else {
                runAway = setInterval(function () {
                  // console.log('running away');
                  $('.battle-hero').toggleClass('run2').addClass('stop-this');
                }, 200) ; 
                timerArray.push(runAway)
              };

              if (ranNum) {
                $('#battle').animate({volume: 0}, 3000)
                $('div.battle').fadeOut(2500)
                $('section').fadeOut(2500)
                $('div.selected').remove()
                gotAway = setTimeout(function () {
                  clearInterval(runAway);
                  // console.log('You Ran Away!');

                  $('#battle').trigger('leave')
                  App.router.navigate('/game/', { trigger: true });
                }, 3000);
                timerArray.push(gotAway)
              } else {
                $('span.battle-menu-turn').remove()
                $('div.selected').remove()
                setTimeout(function () {
                  waitToBePushed = $('span.turn').data('hero')
                  turnArray.push(waitToBePushed)
                  // console.log(5, turnArray)
                  $('span.turn').removeClass('hero-turn turn')
                  $('.character-turn').removeClass('character-turn')
                  $('.battle-hero').removeClass('run1 run2 turn');
                  clearInterval(runAway);
                  ifArrayValue()
                }, 3000)
              };
            };
          })
        });
      });
    });
  }
});

module.exports = TerrainBattle;
