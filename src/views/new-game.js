var $ = require('jquery');
var Backbone = require('backbone');
var tmpl = require('../template.js');

// App
var App = require('../app');
var User = require('../models/user')
var Character = require('../models/character')

// View: List Users
var NewGame = Backbone.View.extend({
  el: $('main'),

  render: function () {
    this.$el.html(tmpl.newGame());
    $('main').append('<audio id="login-music" controls autoplay name="media"> <source src="../../utility/3-16 The Prelude.mp3" type="audio/mpeg"> </audio>')
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
          newPassword = $('div.new-game-input').text()
           var newData = {
            name: newName,
            password: newPassword
          };
          App.Collections.user.create(newData, {
            success: function (user) {
              $.ajax({
                method: "POST",
                url: "http://localhost:3000/currentUser",
                data: { id: user.id }
              }).done(function () {
                $.ajax({
                  method: "POST",
                  url: "http://localhost:3000/characters",
                  traditional: true,
                  data: { "userId": user.id, "name": "Link", "battleName": "hero1", "classes": "ff-sprite red-boy-down1", "str": 20, "def": 16, "exp": 0, "maxMp": 30, "currentMp": 30, "maxHp": 350, "currentHp": 350, "accuracy": 10, "magic": 10, "evade": 6, "agility": 11, "currentPositionX": 5, "currentPositionY": 10, "items": ["Health Tonic", "Magic Tonic", "Elixir", "Revive", "Super Health Tonic", "Super Magic Tonic"]},  
                  
                }).done(function () {
                $.ajax({
                    method: "POST",
                    url: "http://localhost:3000/characters",
                    traditional: true,
                    data: {"userId": user.id, "name": "Ellie", "battleName": "hero2", "classes": "white-girl-down1 ff-sprite", "magicAbilities": [ "Cure1", "Fire1", "Lightning1" ], "magic": 19, "str": 11, "def": 10, "exp": 0, "maxMp": 50, "currentMp": 50, "maxHp": 219, "currentHp": 219, "accuracy": 8, "evade": 6, "agility": 9, "items": ["Health Tonic", "Magic Tonic", "Elixir", "Revive", "Super Health Tonic", "Super Magic Tonic"]}
                  }).done(function () {
                    $('#login-music').animate({volume: 0}, 2000)
                    setTimeout(function () {
                      $('#login-music').trigger('leave', { trigger: true })
                      App.router.navigate('/game', { trigger: true });
                    }, 1500)
                  }) 
                })

              })
            }
          })
        }
      } else {
        newName = $('div.new-game-input').text()
        console.log(newName)
        $('div.new-game-input').text('Enter Your Password')
        $('button#start').addClass('click')
      }
    })
    function myFunction(e) {
      // e.preventDefault()
      var x = e.which;
      if (x == 37) {
        $('button:focus').prev().focus()
      } else if (x == 39) {
        $('button:focus').next().focus()
      } else if (x == 40) {
        classic = $('button:focus').data('next') + 1
        console.log(classic)
        if (!$.isNumeric(classic)) {
          if ($('div').hasClass('new-game-start')) {
            if ($('button#start').is(':focus')) {
              $('button[data-next="1"]').prevAll().focus()
            } else {
              $('button#start').focus()
            }
          } else {
            $('button:focus').prevAll().focus()
            
          }
        } else {
          $('button:focus').next().nextUntil('[data-next="' + classic + '"]').focus()
          
         }
      } else if (x == 38) {
        classic = $('button:focus').data('next') - 1
        if (!$.isNumeric(classic)) {
          $('button[data-next="1"]').next().focus()
        } else {
          $('button:focus').prev().prevUntil('[data-next="' + classic + '"]').focus()
          
        }
      }
    }
    $('html').on('keydown', function (e) {
      myFunction(e)
      
    })
  }
});

module.exports = NewGame;