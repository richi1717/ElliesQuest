'use strict'

var $ = require('jquery');
var Backbone = require('backbone');
var tmpl = require('../template.js');
var Handlebars = require('hbsfy/runtime');
var _ = require('lodash')
var App = require('../app');
var cellCollection = require('../collections/cell.js');
var cellTerrain = require('../models/cell.js');
var Character = require('../models/character.js');


var cellsTerrain = [];

// App

var Direction = {
      top: 12,
      right: 3,
      bottom: 6,
      left: 9
}

var GameWorld = Backbone.View.extend({
  el: $('main'),
  

  collection: App.Collections.product,

  render: function () {
    var characterCollection = require('../collections/character.js');
    var _this = this;
    var characterModels = 0

    characterCollection.fetch().done(function (character) {
      cellCollection.fetch().done(function (cell) {
        console.log()  
        // characterCollection.forEach(function (character) {
        //   console.log(character.attributes.currentPosition)
        // })
        function cellDb(cells) {
          cellCollection.forEach(function (cell, index) {
            // console.log(cell.attributes)

            cellsTerrain.push( cell.attributes );
            // console.log(cellsTerrain[index])
          })
        }
        cellDb()

        _this.$el.html(tmpl.worldTmpl(cellsTerrain))
        $('div.sunny').hide()
        $('div.sunny').fadeIn(2000)
        var character = $('span')
        var characterStats = characterCollection.models[0].attributes

        $('body').on('keydown', function (e) {
          // $('#overworld').removeClass('top left right bottom red-boy-up1 red-boy-down1 red-boy-left1 red-boy-right1 red-boy-up2 red-boy-down2 red-boy-left2 red-boy-right2')
          // check each step for a battle event

          var direction = 'top'
          var classDirection = 0
          // var ffSprite = 'ff-sprite'
          if (e.which === 38) {
            direction = 'top'
            $('span.ff-sprite').removeClass('red-boy-left1 red-boy-right1 red-boy-down1 red-boy-down2 red-boy-left2 red-boy-right2')
            $('span.ff-sprite').addClass('red-boy-up1')
            $('span.ff-sprite').toggleClass('red-boy-up2')
          } else if (e.which === 37) {
            direction = 'left'
            $('span.ff-sprite').removeClass('red-boy-up1 red-boy-right1 red-boy-down1 red-boy-up2 red-boy-down2 red-boy-right2')
            $('span.ff-sprite').addClass('red-boy-left1')
            $('span.ff-sprite').toggleClass('red-boy-left2')
          } else if (e.which === 39) {
            direction = 'right'
            $('span.ff-sprite').removeClass('red-boy-left1 red-boy-up1 red-boy-down1 red-boy-down2 red-boy-left2 red-boy-up2')
            $('span.ff-sprite').addClass('red-boy-right1')
            $('span.ff-sprite').toggleClass('red-boy-right2')
          } else if (e.which === 40) {
            direction = 'bottom'
            $('span.ff-sprite').removeClass('red-boy-left1 red-boy-right1 red-boy-up1 red-boy-up2 red-boy-left2 red-boy-right2')
            $('span.ff-sprite').addClass('red-boy-down1')
            $('span.ff-sprite').toggleClass('red-boy-down2')
          }
            
            var classes = [direction].join(' ')

            $('#overworld').addClass(classes)
            moveTo(findDirection(direction))
            // }
            if (_.random(0, 20) === 1) {
            console.log(characterStats.currentPosition)
            var terrain = findTerrain(findCell(characterStats.currentPosition.x, characterStats.currentPosition.y))

            $('body').off()
            clearInterval(checkSunny)
            clearInterval(rainedOn)
            clearInterval(raining)
            clearInterval(lightning)
            clearTimeout(lightningStrike)
            clearInterval(rainOrNot)
            clearInterval(sunny)
            characterModels = characterCollection.models;
            characterModels[0].addPosition(characterStats.currentPosition)
            console.log(characterModels)
            // console.log(wtf)
            $('#world').animate({volume: 0}, 2000)
            $('div.sunny').fadeOut(2000)
            var leaveBattle = setTimeout(function () {
              $('#world').trigger('leave')
              App.router.navigate('battle/' + terrain, { trigger: true })
              
            }, 2000)
            timerArray.push(leaveBattle)
            // enemyNameByArea()
          }

        })
        
        $('#world').on('leave', function () {
          this.pause();
        });

        function findCell(x, y) {
          // console.log(x, y)
          return $('.row:nth-child(' + y + ') > div:nth-child(' + x + ')')

        }

        function buildTerrain(cells) {
          return cells.forEach(function (cell) {
            findCell(cell.x + 1, cell.y + 1).addClass(cell.terrain)
          })
        }

        function moveTo(cell) {
          var coords = findCell(cell.x, cell.y).offset()
          character.css({
            top: coords.top,
            left: coords.left
          })
          characterStats.currentPosition = { x: cell.x, y: cell.y }
          console.log(characterStats.currentPosition)
          return characterStats.currentPosition
        }

        function findTerrain(cell) {
          return cell.attr('class')
        }

        function findDirection(direction) {

          var x = characterStats.currentPosition.x
          var y = characterStats.currentPosition.y

          if (direction === 'top') {
            y--
          } else if (direction === 'bottom') {
            y++
          } else if (direction === 'right') {
            x++
          } else if (direction === 'left') {
            x--
          }
          return { x: x, y: y }
        }

        moveTo(characterStats.currentPosition)

        buildTerrain(cellsTerrain)
        // for the rain if I decide to use it
        var raining = {}
        var lightning = 0
        var raining = 0
        var lightningStrike = 0
        function rain () {    
          $('.sunny').addClass('rain')
         
          raining = setInterval(function () {
            $('.sunny').toggleClass('rain2')
          }, 200)
          timerArray.push(raining)

          lightning = setInterval(function () {
            var randomLightning = _.random(1, 20)
            $('.sunny').removeClass('lightning')
            if (randomLightning === 1) {
              lightningStrike = setTimeout(function () {
                $('.sunny').addClass('lightning')
                console.log('lightning')
                 
              }, 200)
              timerArray.push(lightningStrike)
            }
             
          }, 300)
          timerArray.push(lightning)
          console.log('raining')
        }

        var randomRain = _.random(0)
        var rainOrNot = 0
        rainOrNot = setInterval(function () {
          randomRain = _.random(0, 5)
          if (randomRain === 1) {
            if($('.sunny').hasClass('rain')) return false
            else {
              object.trigger("run");
            }  
          }
        }, 2000)
        console.log(timerArray)
        timerArray.push(rainOrNot)

        var randomSunny = 0
        var sunny = 0
        var rainedOn = 0
        var checkSunny = 0

        rainedOn = setInterval(function () {
          console.log('check')
          if ($('.sunny').hasClass('rain')) {
            console.log('check if sunny')
            sunny = setInterval(function () {
              randomSunny = _.random(0, 1)
              if (randomSunny) {
                console.log('what')
                object.off("run", "all", function () {
                  console.log('stop')
                })
                // object.off()
                clearInterval(raining)
                clearInterval(lightning)
                $('.sunny').removeClass('rain rain2 lightning')

              }
            }, 10000)
            timerArray.push(sunny)
          }
        }, 10000)
        timerArray.push(rainedOn)

        checkSunny = setInterval(function () {
         
          if ($('.sunny').hasClass('rain') === false) {
            clearInterval(sunny)
            console.log('omg')
          }
        }, 5000)
        timerArray.push(checkSunny)
     
        var object = {};

        _.extend(object, Backbone.Events);

        object.on("run", function() {
          rain();
          console.log('started raining')
        });
        // object.off(null, null, function () {
        //   console.log('stopped raining')
        // })
      })
    })
  }
});

module.exports = GameWorld;