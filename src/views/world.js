'use strict'

var $ = require('jquery');
var Backbone = require('backbone');
var tmpl = require('../template.js');
var Handlebars = require('hbsfy/runtime');
var _ = require('lodash')
var App = require('../app');

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
    this.$el.html(tmpl.worldTmpl())
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

    var cells = [
      {"x": 0, "y": 0, "terrain": "forest", "traversable": true},
      {"x": 1, "y": 0, "terrain": "desert", "traversable": true},
      {"x": 2, "y": 0, "terrain": "forest", "traversable": true},
      {"x": 3, "y": 0, "terrain": "forest", "traversable": true},
      {"x": 4, "y": 0, "terrain": "forest", "traversable": true},
      {"x": 5, "y": 0, "terrain": "water", "traversable": false},
      {"x": 6, "y": 0, "terrain": "grass", "traversable": true},
      {"x": 7, "y": 0, "terrain": "desert", "traversable": true},
      {"x": 8, "y": 0, "terrain": "grass", "traversable": true},
      {"x": 9, "y": 0, "terrain": "grass", "traversable": true},
      {"x": 10, "y": 0, "terrain": "desert", "traversable": true},
      {"x": 11, "y": 0, "terrain": "desert", "traversable": true},
      {"x": 12, "y": 0, "terrain": "desert", "traversable": true},
      {"x": 13, "y": 0, "terrain": "desert", "traversable": true},   
      {"x": 14, "y": 0, "terrain": "desert", "traversable": true},
      {"x": 15, "y": 0, "terrain": "desert", "traversable": true},
      {"x": 16, "y": 0, "terrain": "grass", "traversable": true},
      {"x": 17, "y": 0, "terrain": "grass", "traversable": true},
      {"x": 18, "y": 0, "terrain": "grass", "traversable": true},
      {"x": 19, "y": 0, "terrain": "grass", "traversable": true}, 
   
      {"x": 0, "y": 1, "terrain": "desert", "traversable": true},
      {"x": 1, "y": 1, "terrain": "grass", "traversable": true},
      {"x": 2, "y": 1, "terrain": "forest", "traversable": true},
      {"x": 3, "y": 1, "terrain": "forest", "traversable": true},
      {"x": 4, "y": 1, "terrain": "water", "traversable": false},
      {"x": 5, "y": 1, "terrain": "water", "traversable": false},
      {"x": 6, "y": 1, "terrain": "water", "traversable": false},
      {"x": 7, "y": 1, "terrain": "grass", "traversable": true},
      {"x": 8, "y": 1, "terrain": "grass", "traversable": true},
      {"x": 9, "y": 1, "terrain": "grass", "traversable": true},
      {"x": 10, "y": 1, "terrain": "desert", "traversable": true},
      {"x": 11, "y": 1, "terrain": "desert", "traversable": true},
      {"x": 12, "y": 1, "terrain": "desert", "traversable": true},
      {"x": 13, "y": 1, "terrain": "desert", "traversable": true},
      {"x": 14, "y": 1, "terrain": "desert", "traversable": true},
      {"x": 15, "y": 1, "terrain": "desert", "traversable": true},
      {"x": 16, "y": 1, "terrain": "grass", "traversable": true},
      {"x": 17, "y": 1, "terrain": "grass", "traversable": true},
      {"x": 18, "y": 1, "terrain": "grass", "traversable": true},
      {"x": 19, "y": 1, "terrain": "grass", "traversable": true},
   
   
      {"x": 0, "y": 2, "terrain": "desert", "traversable": true},
      {"x": 1, "y": 2, "terrain": "desert", "traversable": true},
      {"x": 2, "y": 2, "terrain": "grass", "traversable": true},
      {"x": 3, "y": 2, "terrain": "grass", "traversable": true},
      {"x": 4, "y": 2, "terrain": "grass", "traversable": true},
      {"x": 5, "y": 2, "terrain": "water", "traversable": false},
      {"x": 6, "y": 2, "terrain": "grass", "traversable": true},
      {"x": 7, "y": 2, "terrain": "grass", "traversable": true},
      {"x": 8, "y": 2, "terrain": "grass", "traversable": true},
      {"x": 9, "y": 2, "terrain": "grass", "traversable": true},
      {"x": 10, "y": 2, "terrain": "desert", "traversable": true},
      {"x": 11, "y": 2, "terrain": "desert", "traversable": true},
      {"x": 12, "y": 2, "terrain": "desert", "traversable": true},
      {"x": 13, "y": 2, "terrain": "desert", "traversable": true},
      {"x": 14, "y": 2, "terrain": "desert", "traversable": true},
      {"x": 15, "y": 2, "terrain": "desert", "traversable": true},
      {"x": 16, "y": 2, "terrain": "grass", "traversable": true},
      {"x": 17, "y": 2, "terrain": "grass", "traversable": true},
      {"x": 18, "y": 2, "terrain": "grass", "traversable": true},
      {"x": 19, "y": 2, "terrain": "grass", "traversable": true},
   
   
      {"x": 0, "y": 3, "terrain": "desert", "traversable": true},
      {"x": 1, "y": 3, "terrain": "desert", "traversable": true},
      {"x": 2, "y": 3, "terrain": "desert", "traversable": true},
      {"x": 3, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 4, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 5, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 6, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 7, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 8, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 9, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 10, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 11, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 12, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 13, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 14, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 15, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 16, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 17, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 18, "y": 3, "terrain": "grass", "traversable": true},
      {"x": 19, "y": 3, "terrain": "grass", "traversable": true},
   
   
      {"x": 0, "y": 4, "terrain": "desert", "traversable": true},
      {"x": 1, "y": 4, "terrain": "desert", "traversable": true},
      {"x": 2, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 3, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 4, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 5, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 6, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 7, "y": 4, "terrain": "desert", "traversable": true},
      {"x": 8, "y": 4, "terrain": "desert", "traversable": true},
      {"x": 9, "y": 4, "terrain": "desert", "traversable": true},
      {"x": 10, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 11, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 12, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 13, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 14, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 15, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 16, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 17, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 18, "y": 4, "terrain": "grass", "traversable": true},
      {"x": 19, "y": 4, "terrain": "grass", "traversable": true},
   
   
      {"x": 0, "y": 5, "terrain": "desert", "traversable": true},
      {"x": 1, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 2, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 3, "y": 5, "terrain": "water", "traversable": false},
      {"x": 4, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 5, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 6, "y": 5, "terrain": "desert", "traversable": true},
      {"x": 7, "y": 5, "terrain": "desert", "traversable": true},
      {"x": 8, "y": 5, "terrain": "desert", "traversable": true},
      {"x": 9, "y": 5, "terrain": "desert", "traversable": true},
      {"x": 10, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 11, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 12, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 13, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 14, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 15, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 16, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 17, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 18, "y": 5, "terrain": "grass", "traversable": true},
      {"x": 19, "y": 5, "terrain": "grass", "traversable": true},
   
   
      {"x": 0, "y": 6, "terrain": "desert", "traversable": true},
      {"x": 1, "y": 6, "terrain": "desert", "traversable": true},
      {"x": 2, "y": 6, "terrain": "grass", "traversable": true},
      {"x": 3, "y": 6, "terrain": "grass", "traversable": true},
      {"x": 4, "y": 6, "terrain": "grass", "traversable": true},
      {"x": 5, "y": 6, "terrain": "desert", "traversable": true},
      {"x": 6, "y": 6, "terrain": "desert", "traversable": true},
      {"x": 7, "y": 6, "terrain": "desert", "traversable": true},
      {"x": 8, "y": 6, "terrain": "desert", "traversable": true},
      {"x": 9, "y": 6, "terrain": "desert", "traversable": true},
      {"x": 10, "y": 6, "terrain": "grass", "traversable": true},
      {"x": 11, "y": 6, "terrain": "grass", "traversable": true},
      {"x": 12, "y": 6, "terrain": "grass", "traversable": true},
      {"x": 13, "y": 6, "terrain": "grass", "traversable": true},
      {"x": 14, "y": 6, "terrain": "grass", "traversable": true},
      {"x": 15, "y": 6, "terrain": "grass", "traversable": true},
      {"x": 16, "y": 6, "terrain": "grass", "traversable": true},
      {"x": 17, "y": 6, "terrain": "grass", "traversable": true},
      {"x": 18, "y": 6, "terrain": "grass", "traversable": true},
      {"x": 19, "y": 6, "terrain": "grass", "traversable": true},
   
   
      {"x": 0, "y": 7, "terrain": "desert", "traversable": true},
      {"x": 1, "y": 7, "terrain": "desert", "traversable": true},
      {"x": 2, "y": 7, "terrain": "desert", "traversable": true},
      {"x": 3, "y": 7, "terrain": "grass", "traversable": true},
      {"x": 4, "y": 7, "terrain": "desert", "traversable": true},
      {"x": 5, "y": 7, "terrain": "desert", "traversable": true},
      {"x": 6, "y": 7, "terrain": "desert", "traversable": true},
      {"x": 7, "y": 7, "terrain": "desert", "traversable": true},
      {"x": 8, "y": 7, "terrain": "desert", "traversable": true},
      {"x": 9, "y": 7, "terrain": "desert", "traversable": true},
      {"x": 10, "y": 7, "terrain": "grass", "traversable": true},
      {"x": 11, "y": 7, "terrain": "grass", "traversable": true},
      {"x": 12, "y": 7, "terrain": "grass", "traversable": true},
      {"x": 13, "y": 7, "terrain": "grass", "traversable": true},
      {"x": 14, "y": 7, "terrain": "grass", "traversable": true},
      {"x": 15, "y": 7, "terrain": "grass", "traversable": true},
      {"x": 16, "y": 7, "terrain": "grass", "traversable": true},
      {"x": 17, "y": 7, "terrain": "grass", "traversable": true},
      {"x": 18, "y": 7, "terrain": "grass", "traversable": true},
      {"x": 19, "y": 7, "terrain": "grass", "traversable": true},
   
   
      {"x": 0, "y": 8, "terrain": "desert", "traversable": true},
      {"x": 1, "y": 8, "terrain": "desert", "traversable": true},
      {"x": 2, "y": 8, "terrain": "desert", "traversable": true},
      {"x": 3, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 4, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 5, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 6, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 7, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 8, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 9, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 10, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 11, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 12, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 13, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 14, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 15, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 16, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 17, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 18, "y": 8, "terrain": "grass", "traversable": true},
      {"x": 19, "y": 8, "terrain": "grass", "traversable": true},
   
   
      {"x": 0, "y": 9, "terrain": "desert", "traversable": true},
      {"x": 1, "y": 9, "terrain": "desert", "traversable": true},
      {"x": 2, "y": 9, "terrain": "desert", "traversable": true},
      {"x": 3, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 4, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 5, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 6, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 7, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 8, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 9, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 10, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 11, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 12, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 13, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 14, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 15, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 16, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 17, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 18, "y": 9, "terrain": "grass", "traversable": true},
      {"x": 19, "y": 9, "terrain": "grass", "traversable": true},

      {"x": 0, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 1, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 2, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 3, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 4, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 5, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 6, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 7, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 8, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 9, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 10, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 11, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 12, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 13, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 14, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 15, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 16, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 17, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 18, "y": 10, "terrain": "grass", "traversable": true},
      {"x": 19, "y": 10, "terrain": "grass", "traversable": true}
    ] 

    $('body').on('keydown', function (e) {
      $('#overworld').removeClass('top left right bottom red-boy-up1 red-boy-down1 red-boy-left1 red-boy-right1')
      // check each step for a battle event

      var direction = 'top'
      var classDirection = 'red-boy-up1'
      var ffSprite = 'ff-sprite'
      if (e.keyCode === 38) {
        direction = 'top'
        classDirection = 'red-boy-up1'
      } else if (e.keyCode === 37) {
        direction = 'left'
        classDirection = 'red-boy-left1'

      } else if (e.keyCode === 39) {
        direction = 'right'
        classDirection = 'red-boy-right1'
      } else if (e.keyCode === 40) {
        direction = 'bottom'
        classDirection = 'red-boy-down1'
      }
        
        var classes = [ffSprite, classDirection, direction].join(' ')

        $('#overworld').addClass(classes)
        moveTo(findDirection(direction))
        // }
        if (_.random(0, 10) === 1) {
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

    buildTerrain(cells)
    // for the rain if I decide to use it
    $('.sunny').addClass('rain')
    setInterval(function () {
      $('.sunny').toggleClass('rain2')
    }, 200)








  }
});

module.exports = GameWorld;