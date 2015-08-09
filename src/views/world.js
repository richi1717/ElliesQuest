'use strict'

var $ = require('jquery');
var Backbone = require('backbone');
var worldTmpl = require('../templates/world.hbs');
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
  this.$el.html(worldTmpl())
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
    {x: 0, y: 0, terrain: "forest", traversable:true},
    {x: 1, y: 0, terrain: "sand", traversable:true},
    {x: 2, y: 0, terrain: "forest", traversable:true},
    {x: 3, y: 0, terrain: "forest", traversable:true},
    {x: 4, y: 0, terrain: "forest", traversable:true},
    {x: 5, y: 0, terrain: "water", traversable:false},
    {x: 6, y: 0, terrain: "grass", traversable:true},
    {x: 7, y: 0, terrain: "sand", traversable:true},
    {x: 8, y: 0, terrain: "grass", traversable:true},
    {x: 9, y: 0, terrain: "grass", traversable:true},
    {x: 10, y: 0, terrain: "sand", traversable:true},
    {x: 11, y: 0, terrain: "sand", traversable:true},
    {x: 12, y: 0, terrain: "sand", traversable:true},
    {x: 13, y: 0, terrain: "sand", traversable:true},   
    {x: 14, y: 0, terrain: "sand", traversable:true},
    {x: 15, y: 0, terrain: "sand", traversable:true}, 


    {x: 0, y: 1, terrain: "sand", traversable:true},
    {x: 1, y: 1, terrain: "grass", traversable:true},
    {x: 2, y: 1, terrain: "forest", traversable:true},
    {x: 3, y: 1, terrain: "forest", traversable:true},
    {x: 4, y: 1, terrain: "water", traversable:false},
    {x: 5, y: 1, terrain: "water", traversable:false},
    {x: 6, y: 1, terrain: "water", traversable:false},
    {x: 7, y: 1, terrain: "grass", traversable:true},
    {x: 8, y: 1, terrain: "grass", traversable:true},
    {x: 9, y: 1, terrain: "grass", traversable:true},
    {x: 10, y: 1, terrain: "sand", traversable:true},
    {x: 11, y: 1, terrain: "sand", traversable:true},
    {x: 12, y: 1, terrain: "sand", traversable:true},
    {x: 13, y: 1, terrain: "sand", traversable:true},
    {x: 14, y: 1, terrain: "sand", traversable:true},
    {x: 15, y: 1, terrain: "sand", traversable:true},


    {x: 0, y: 2, terrain: "sand", traversable:true},
    {x: 1, y: 2, terrain: "sand", traversable:true},
    {x: 2, y: 2, terrain: "grass", traversable:true},
    {x: 3, y: 2, terrain: "grass", traversable:true},
    {x: 4, y: 2, terrain: "grass", traversable:true},
    {x: 5, y: 2, terrain: "water", traversable:false},
    {x: 6, y: 2, terrain: "grass", traversable:true},
    {x: 7, y: 2, terrain: "grass", traversable:true},
    {x: 8, y: 2, terrain: "grass", traversable:true},
    {x: 9, y: 2, terrain: "grass", traversable:true},
    {x: 10, y: 2, terrain: "sand", traversable:true},
    {x: 11, y: 2, terrain: "sand", traversable:true},
    {x: 12, y: 2, terrain: "sand", traversable:true},
    {x: 13, y: 2, terrain: "sand", traversable:true},
    {x: 14, y: 2, terrain: "sand", traversable:true},
    {x: 15, y: 2, terrain: "sand", traversable:true},


    {x: 0, y: 3, terrain: "sand", traversable:true},
    {x: 1, y: 3, terrain: "sand", traversable:true},
    {x: 2, y: 3, terrain: "sand", traversable:true},
    {x: 3, y: 3, terrain: "grass", traversable:true},
    {x: 4, y: 3, terrain: "grass", traversable:true},
    {x: 5, y: 3, terrain: "grass", traversable:true},
    {x: 6, y: 3, terrain: "grass", traversable:true},
    {x: 7, y: 3, terrain: "grass", traversable:true},
    {x: 8, y: 3, terrain: "grass", traversable:true},
    {x: 9, y: 3, terrain: "grass", traversable:true},
    {x: 10, y: 3, terrain: "grass", traversable:true},
    {x: 11, y: 3, terrain: "grass", traversable:true},
    {x: 12, y: 3, terrain: "grass", traversable:true},
    {x: 13, y: 3, terrain: "grass", traversable:true},
    {x: 14, y: 3, terrain: "grass", traversable:true},
    {x: 15, y: 3, terrain: "grass", traversable:true},


    {x: 0, y: 4, terrain: "sand", traversable:true},
    {x: 1, y: 4, terrain: "sand", traversable:true},
    {x: 2, y: 4, terrain: "grass", traversable:true},
    {x: 3, y: 4, terrain: "grass", traversable:true},
    {x: 4, y: 4, terrain: "grass", traversable:true},
    {x: 5, y: 4, terrain: "grass", traversable:true},
    {x: 6, y: 4, terrain: "grass", traversable:true},
    {x: 7, y: 4, terrain: "sand", traversable:true},
    {x: 8, y: 4, terrain: "sand", traversable:true},
    {x: 9, y: 4, terrain: "sand", traversable:true},
    {x: 10, y: 4, terrain: "grass", traversable:true},
    {x: 11, y: 4, terrain: "grass", traversable:true},
    {x: 12, y: 4, terrain: "grass", traversable:true},
    {x: 13, y: 4, terrain: "grass", traversable:true},
    {x: 14, y: 4, terrain: "grass", traversable:true},
    {x: 15, y: 4, terrain: "grass", traversable:true},


    {x: 0, y: 5, terrain: "sand", traversable:true},
    {x: 1, y: 5, terrain: "grass", traversable:true},
    {x: 2, y: 5, terrain: "grass", traversable:true},
    {x: 3, y: 5, terrain: "water", traversable:false},
    {x: 4, y: 5, terrain: "grass", traversable:true},
    {x: 5, y: 5, terrain: "grass", traversable:true},
    {x: 6, y: 5, terrain: "sand", traversable:true},
    {x: 7, y: 5, terrain: "sand", traversable:true},
    {x: 8, y: 5, terrain: "sand", traversable:true},
    {x: 9, y: 5, terrain: "sand", traversable:true},
    {x: 10, y: 5, terrain: "grass", traversable:true},
    {x: 11, y: 5, terrain: "grass", traversable:true},
    {x: 12, y: 5, terrain: "grass", traversable:true},
    {x: 13, y: 5, terrain: "grass", traversable:true},
    {x: 14, y: 5, terrain: "grass", traversable:true},
    {x: 15, y: 5, terrain: "grass", traversable:true},


    {x: 0, y: 6, terrain: "sand", traversable:true},
    {x: 1, y: 6, terrain: "sand", traversable:true},
    {x: 2, y: 6, terrain: "grass", traversable:true},
    {x: 3, y: 6, terrain: "grass", traversable:true},
    {x: 4, y: 6, terrain: "grass", traversable:true},
    {x: 5, y: 6, terrain: "sand", traversable:true},
    {x: 6, y: 6, terrain: "sand", traversable:true},
    {x: 7, y: 6, terrain: "sand", traversable:true},
    {x: 8, y: 6, terrain: "sand", traversable:true},
    {x: 9, y: 6, terrain: "sand", traversable:true},
    {x: 10, y: 6, terrain: "grass", traversable:true},
    {x: 11, y: 6, terrain: "grass", traversable:true},
    {x: 12, y: 6, terrain: "grass", traversable:true},
    {x: 13, y: 6, terrain: "grass", traversable:true},
    {x: 14, y: 6, terrain: "grass", traversable:true},
    {x: 15, y: 6, terrain: "grass", traversable:true},


    {x: 0, y: 7, terrain: "sand", traversable:true},
    {x: 1, y: 7, terrain: "sand", traversable:true},
    {x: 2, y: 7, terrain: "sand", traversable:true},
    {x: 3, y: 7, terrain: "grass", traversable:true},
    {x: 4, y: 7, terrain: "sand", traversable:true},
    {x: 5, y: 7, terrain: "sand", traversable:true},
    {x: 6, y: 7, terrain: "sand", traversable:true},
    {x: 7, y: 7, terrain: "sand", traversable:true},
    {x: 8, y: 7, terrain: "sand", traversable:true},
    {x: 9, y: 7, terrain: "sand", traversable:true},
    {x: 10, y: 7, terrain: "grass", traversable:true},
    {x: 11, y: 7, terrain: "grass", traversable:true},
    {x: 12, y: 7, terrain: "grass", traversable:true},
    {x: 13, y: 7, terrain: "grass", traversable:true},
    {x: 14, y: 7, terrain: "grass", traversable:true},
    {x: 15, y: 7, terrain: "grass", traversable:true},


    {x: 0, y: 8, terrain: "sand", traversable:true},
    {x: 1, y: 8, terrain: "sand", traversable:true},
    {x: 2, y: 8, terrain: "sand", traversable:true},
    {x: 3, y: 8, terrain: "grass", traversable:true},
    {x: 4, y: 8, terrain: "grass", traversable:true},
    {x: 5, y: 8, terrain: "grass", traversable:true},
    {x: 6, y: 8, terrain: "grass", traversable:true},
    {x: 7, y: 8, terrain: "grass", traversable:true},
    {x: 8, y: 8, terrain: "grass", traversable:true},
    {x: 9, y: 8, terrain: "grass", traversable:true},
    {x: 10, y: 8, terrain: "grass", traversable:true},
    {x: 11, y: 8, terrain: "grass", traversable:true},
    {x: 12, y: 8, terrain: "grass", traversable:true},
    {x: 13, y: 8, terrain: "grass", traversable:true},
    {x: 14, y: 8, terrain: "grass", traversable:true},
    {x: 15, y: 8, terrain: "grass", traversable:true},


    {x: 0, y: 9, terrain: "sand", traversable:true},
    {x: 1, y: 9, terrain: "sand", traversable:true},
    {x: 2, y: 9, terrain: "sand", traversable:true},
    {x: 3, y: 9, terrain: "grass", traversable:true},
    {x: 4, y: 9, terrain: "grass", traversable:true},
    {x: 5, y: 9, terrain: "grass", traversable:true},
    {x: 6, y: 9, terrain: "grass", traversable:true},
    {x: 7, y: 9, terrain: "grass", traversable:true},
    {x: 8, y: 9, terrain: "grass", traversable:true},
    {x: 9, y: 9, terrain: "grass", traversable:true},
    {x: 10, y: 9, terrain: "grass", traversable:true},
    {x: 11, y: 9, terrain: "grass", traversable:true},
    {x: 12, y: 9, terrain: "grass", traversable:true},
    {x: 13, y: 9, terrain: "grass", traversable:true},
    {x: 14, y: 9, terrain: "grass", traversable:true},
    {x: 15, y: 9, terrain: "grass", traversable:true}
  ] 

  $('body').on('keydown', function (e) {
    $('span').removeClass('top left right bottom red-boy-up1 red-boy-down1 red-boy-left1 red-boy-right1')
    // check each step for a battle event
    if (_.random(0, 10) === 1) {
      findTerrain()


      App.router.navigate('battle/desert', { trigger: true })
      // enemyNameByArea()
    }
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
      // if (characterStats.direction !== direction) {
      //   $('span').addClass(direction)
      //   characterStats.direction = direction
      // } else {
        var classes = [ffSprite, classDirection, direction].join(' ')

        $('span').addClass(classes)
        moveTo(findDirection(direction))
      // }

  })

  function findCell(x, y) {
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
  }

  function findTerrain() {
    
    


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

  function battle() {
    var random = _.random(1, 20)
    var inRange = _.inRange(random, 10, 20)
    if (inRange) {
      console.log('hit')
    } else {
      console.log('miss')
    }


  }
  // will determine what type of enemy they will be
  // function enemyNameByArea() {
  //   if (_.random(1, 6) === 1) {
  //     console.log('you fight gorgon')
  //     battle()
  //   } else if (_.random(1, 6) === 2) {
  //     console.log('you fight templar')
  //     battle()
  //   } else if (_.random(1, 6) === 3) {
  //     console.log('you fight wolf')
  //     battle()
  //   } else if (_.random(1, 6) === 4) {
  //     console.log('you fight dog')
  //     battle()
  //   } else if (_.random(1, 6) === 5) {
  //     console.log('you fight snake')
  //     battle()
  //   } else {
  //     console.log('you fight yahoos')
  //     battle()
  //   }
  // }

  // // checks to see if enemy is defeated or if character is defeated
  // if (enemy.hp === 0) {
  //   if (enemyTotal === 0) {
  //     console.log('you win')
  //   } else {
  //     console.log('continue the fight')
  //   }
  // } else if (characterStats.hp === 0) {
  //   if (characterTotal === 0) {
  //     console.log('Game Over')
  //   } else {
  //     console.log('You are dead but your buddy lives on')
  //   }
  // }

  moveTo(characterStats.position)
  // var element = document.getElementsByTagName('span');
  // console.log(element)
  // var position = element.getBoundingClientRect();
  // var x = position.left;
  // var y = position.top;
  // console.log(x,y)


  buildTerrain(cells)
  // buildCharacter()







  }
});

module.exports = GameWorld;