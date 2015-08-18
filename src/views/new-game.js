var $ = require('jquery');
var Backbone = require('backbone');
var newGameTemplate = require('../templates/new-game.hbs');

// App
var App = require('../app');

// View: List Users
var NewGame = Backbone.View.extend({
  el: $('main'),

  render: function () {
    this.$el.html(newGameTemplate());
    $('#shift').on('click', function () {
      if ($(this).data('name') === 'click') {
        $(this).data('name', '')
      } else {
        $(this).data('name', 'click')
      }
        
      $('button.upper').toggleClass('uppercase')
      $('button:nth-child(28)')
       .text( ($('button:nth-child(28)').text() === '!' ? '1' : '!') )
       .toggleClass("active");
      $('button:nth-child(29)')
       .text( ($('button:nth-child(29)').text() === '@' ? '2' : '@') )
       .toggleClass("active");
      $('button:nth-child(30)')
       .text( ($('button:nth-child(30)').text() === '#' ? '3' : '#') )
       .toggleClass("active");
      $('button:nth-child(31)')
       .text( ($('button:nth-child(31)').text() === '$' ? '4' : '$') )
       .toggleClass("active");
      $('button:nth-child(32)')
       .text( ($('button:nth-child(32)').text() === '%' ? '5' : '%') )
       .toggleClass("active");
      $('button:nth-child(33)')
       .text( ($('button:nth-child(33)').text() === '^' ? '6' : '^') )
       .toggleClass("active");
      $('button:nth-child(34)')
       .text( ($('button:nth-child(34)').text() === '&' ? '7' : '&') )
       .toggleClass("active");
      $('button:nth-child(35)')
       .text( ($('button:nth-child(35)').text() === '*' ? '8' : '*') )
       .toggleClass("active");
      $('button:nth-child(36)')
       .text( ($('button:nth-child(36)').text() === '-' ? '9' : '-') )
       .toggleClass("active");
      $('button:nth-child(37)')
       .text( ($('button:nth-child(37)').text() === '+' ? '0' : '+') )
       .toggleClass("active");
      $('button:nth-child(38)')
       .text( ($('button:nth-child(38)').text() === '~' ? '<' : '~') )
       .toggleClass("active");
      $('button:nth-child(39)')
       .text( ($('button:nth-child(39)').text() === '≈' ? '>' : '≈') )
       .toggleClass("active");
      $('button:nth-child(40)')
       .text( ($('button:nth-child(40)').text() === '\\' ? '/' : '\\') )
       .toggleClass("active");
    })

    $('button#clear').on('click', function () {

    })

    $('button#backspace').on('click', function () {

    })
    $('button').on('click', function () {
      if(!$(this).is('#shift')) {
        if(!$(this).is('#clear')) {
          if (!$(this).is('#backspace')) {
            if($('div.new-game-input').text() === 'Enter Your Name') {
              if ($(this).text() === '⏘') {
                $('div.new-game-input').text(' ')
              } else {
                if ($('button#shift').data('name') === 'click') {
                  $('div.new-game-input').text($(this).text().toUpperCase())
                } else {
                  $('div.new-game-input').text($(this).text())
                }
              }
            } else {
              if ($('button#shift').data('name') === 'click') {
                if ($(this).text() === '⏘') {
                  $('div.new-game-input').append(' ')
                } else {
                  $('div.new-game-input').append($(this).text().toUpperCase())
                }
              } else {
                if ($(this).text() === '⏘') {
                  $('div.new-game-input').append(' ')
                } else {
                  $('div.new-game-input').append($(this).text())
                }
              }
            }
          } else {
            strLength = $('div.new-game-input').text().length - 1
            str = $('div.new-game-input').text().slice(0, strLength)
            $('div.new-game-input').text(str)
          }
        } else {
          $('div.new-game-input').text('Enter Your Name')
        }
      }
    })
    function myFunction(e) {
      e.preventDefault
      var x = e.which;
      if (x == 37) {  // 27 is the ESC key
        console.log("You pressed the Escape key!");
        $('button:focus').next()
      }
    }
    $('html').on('keydown', function (e) {
      myFunction(e)
      
    })


  }
});

module.exports = NewGame;