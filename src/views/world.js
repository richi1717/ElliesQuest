'use strict'

var $ = require('jquery');
var Backbone = require('backbone');
var tmpl = require('../template.js');
var Handlebars = require('hbsfy/runtime');
var _ = require('lodash')
var App = require('../app');
var cellCollection = require('../collections/cell.js');
var cellTerrain = require('../models/cell.js');

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
    var _this = this;
    cellCollection.fetch().done(function (cell) {
      
      function cellDb(cells) {
        cellCollection.forEach(function (cell, index) {
          // console.log(cell.attributes)

          cellsTerrain.push( cell.attributes );
          // console.log(cellsTerrain[index])
        })
      }
      cellDb()

      _this.$el.html(tmpl.worldTmpl(cellsTerrain))
      var character = $('span')
      var characterStats = {
        name: 'Link',
        str: 1,
        def: 1,
        direction: 'right',
        position: {
          x: 5,
          y: 10
        }
      }

      $('body').on('keydown', function (e) {
        $('#overworld').removeClass('top left right bottom red-boy-up1 red-boy-down1 red-boy-left1 red-boy-right1 red-boy-up2 red-boy-down2 red-boy-left2 red-boy-right2')
        // check each step for a battle event

        var direction = 'top'
        var classDirection = 'red-boy-up1'
        var ffSprite = 'ff-sprite'
        if (e.which === 38) {
          direction = 'top'
          $('red-boy-up1').removeClass('red-boy-up2 red-boy-down2 red-boy-left2 red-boy-right2')
          classDirection = 'red-boy-up1'
          // classDirection = $('red-boy-up1').toggleClass('red-boy-up2')
        } else if (e.which === 37) {
          direction = 'left'
          $('red-boy-left1').removeClass('red-boy-up2 red-boy-down2 red-boy-left2 red-boy-right2')
          classDirection = 'red-boy-left1'
          // classDirection = $('red-boy-left1').toggleClass('red-boy-left2')
        } else if (e.which === 39) {
          direction = 'right'
          $('red-boy-right1').removeClass('red-boy-up2 red-boy-down2 red-boy-left2 red-boy-right2')
          classDirection = 'red-boy-right1'
          // classDirection = $('red-boy-right1').toggleClass('red-boy-right2')
        } else if (e.which === 40) {
          direction = 'bottom'
          $('red-boy-down1').removeClass('red-boy-up2 red-boy-down2 red-boy-left2 red-boy-right2')
          classDirection = 'red-boy-down1'
          // classDirection = $('red-boy-down1').toggleClass('red-boy-down2')
        }
          
          var classes = [ffSprite, classDirection, direction].join(' ')

          $('#overworld').addClass(classes)
          moveTo(findDirection(direction))
          // }
          if (_.random(0, 20) === 1) {
          console.log(characterStats.position)
          var terrain = findTerrain(findCell(characterStats.position.x, characterStats.position.y))


          App.router.navigate('battle/' + terrain, { trigger: true })
          // enemyNameByArea()
        }

      })

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
        characterStats.position = { x: cell.x, y: cell.y }
        console.log(characterStats.position)
        return characterStats.position
      }

      function findTerrain(cell) {
        return cell.attr('class')
      }

      function findDirection(direction) {

        var x = characterStats.position.x
        var y = characterStats.position.y

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

      moveTo(characterStats.position)

      buildTerrain(cellsTerrain)
      // for the rain if I decide to use it
      var raining = {}
      var lightning = 0
      var raining = 0
      function rain () {    
        $('.sunny').addClass('rain')
       
        raining = setInterval(function () {
          $('.sunny').toggleClass('rain2')
        }, 200)

        lightning = setInterval(function () {
          var randomLightning = _.random(1, 20)
          $('.sunny').removeClass('lightning')
          if (randomLightning === 1) {
            setTimeout(function () {
              $('.sunny').addClass('lightning')
              console.log('lightning')
               
            }, 200)
          }
           
        }, 300)
        console.log('raining')
      }

      var randomRain = _.random(0)
      setInterval(function () {
        randomRain = _.random(0, 5)
        if (randomRain === 1) {
          if($('.sunny').hasClass('rain')) return false
          else {
            object.trigger("run");
          }  
        }
      }, 2000)

      var randomSunny = 0
      var sunny = 0

      setInterval(function () {
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
        }
      }, 10000)

      setInterval(function () {
       
        if ($('.sunny').hasClass('rain') === false) {
          clearInterval(sunny)
          console.log('omg')
        }
      }, 5000)
   
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
  }
});

module.exports = GameWorld;