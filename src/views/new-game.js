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
            if($('div.new-game-input').text() === 'Enter Your Name' || $('div.new-game-input').text() === 'Enter Your Name Please...' || $('div.new-game-input').text() === 'Enter Your Password') {
              if ($('div.new-game-input').text().length > 0 || $('div.new-game-input').text('')) {
                if ($('div').hasClass('new-game-start')) {
                } else {
                  $('main').append('<div class="new-game-start"><button id="start">Start</button></div>')
                }
              }
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
              if ($('div.new-game-input').text().length > 0) {
                if ($('div').hasClass('new-game-start')) {
                } else {
                  $('main').append('<div class="new-game-start"><button id="start">Start</button></div>')
                }
              }
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
            if ($('button').hasClass('click') && $('div.new-game-input').text().length < 2) {
                console.log('hey')
                $('div.new-game-input').text('Enter Your Password')
              
            } else {
              if ($('div.new-game-input').text().length < 2) {
                $('div.new-game-start').remove()
                $('div.new-game-input').text('Enter Your Name')

              } else if ($('div.new-game-input').text() === 'Enter Your Name') {
                $('div.new-game-input').append(' Please...')
              } else if ($('div.new-game-input').text() === 'Enter Your Name Please...') {
                $('div.new-game-input').text('Enter Your Name')
              } else if ($('div.new-game-input').text() === 'Enter Your Password') {
                $('div.new-game-start').remove()
                $('div.new-game-input').text('Enter Your Name')
                $('button.click').removeClass('click')
              } else {
                strLength = $('div.new-game-input').text().length - 1
                str = $('div.new-game-input').text().slice(0, strLength)
                $('div.new-game-input').text(str)
              }
            }
          }
        } else {
          if ($('div.new-game-input').text() === 'Enter Your Password') {
            $('div.new-game-input').text('Enter Your Password')
          } else {
            if ($('button#start').hasClass('click')) {
              $('div.new-game-input').text('Enter Your Password')
            } else {
              $('div.new-game-input').text('Enter Your Name')
              $('div.new-game-start').remove()

              // $('div.new-game-input').text('Enter Your Name')
            }
          }
        }
      }
    })

    $('main').on('click', 'button#start', function () {
      if ($('button#start').hasClass('click')) {
        if ($('div.new-game-input').text() === 'Enter Your Password') {
          console.log('do nothing')
        } else {
          console.log($('div.new-game-input').text())
        }
      } else { 
        $('div.new-game-input').text('Enter Your Password')
        $('button#start').addClass('click')
      }
    })
    function myFunction(e) {
      e.preventDefault
      var x = e.which;
      if (x == 37) {  // 27 is the ESC key
        console.log("You pressed the Escape key!");
        $('button:focus').next().focus()
      }
    }
    $('html').on('keydown', function (e) {
      myFunction(e)
      
    })


  }
});

module.exports = NewGame;