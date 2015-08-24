var $ = require('jquery');
var Backbone = require('backbone');
var tmpl = require('../template.js');

// App
var App = require('../app');
var User = require('../models/user')
var userCollection = require('../collections/user.js')

var Login = Backbone.View.extend({
  el: $('main'),

  render: function () {
    var _this = this
    userCollection.fetch().done(function (user) {
      _this.$el.html(tmpl.login(user))
      $('main').on('click', '#shift', function () {
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

      $('button#clear').on('click', 'button#clear', function () {

      })

      $('button#backspace').on('click', 'button#backspace', function () {

      })
      $('main').on('click', 'button', function () {
        if (!$(this).is('#start')) {
          if (!$(this).is('#delete')) {
            if(!$(this).is('#shift')) {
              if(!$(this).is('#clear')) {
                if (!$(this).is('#backspace')) {
                  if($('div.new-game-input').text() === 'Enter Your Password' || $('div.new-game-input').text() === 'Try Again') {
                    $('main').append('<div class="new-game-start"><button id="start">Continue</button><button id="delete">Delete</button></div>')
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
                  if ($('button').hasClass('click') && $('div.new-game-input').text().length < 2) {
                    console.log('hey')
                    $('div.new-game-input').text('Enter Your Password')
                    
                  } else {
                    if ($('div.new-game-input').text().length < 2) {
                      $('div.new-game-input').text('Enter Your Password')
                    } else if ($('div.new-game-input').text() === 'Enter Your Password' || $('div.new-game-input').text() === 'Try Again') {
                      $('div.new-game-input').text('Enter Your Password')
                    } else {
                      strLength = $('div.new-game-input').text().length - 1
                      str = $('div.new-game-input').text().slice(0, strLength)
                      $('div.new-game-input').text(str)
                    }
                  }
                }
              } else {
                if ($('div.new-game-input').text() === 'Enter Your Password' || $('div.new-game-input').text() === 'Try Again') {
                  $('div.new-game-input').text('Enter Your Password')
                } else {
                  if ($('button#start').hasClass('click')) {
                    $('div.new-game-input').text('Enter Your Password')
                  } else {
                    $('div.new-game-input').text('Enter Your Password')
                  }
                }
              }
            }
          } else {
            if (password == $('div.new-game-input').text()) {
              $('main > div').show()
              $('div.new-game-screen').remove()
              console.log(userLog)
              $('button[data-id="' + userLog + '"]').remove()
              App.router.navigate('#/user/' + userLog + '/delete', { trigger: true })
            } else {
              $('div.new-game-input').text('Try Again')
            } 
          }
        } else {
          if (password == $('div.new-game-input').text()) {
            $.ajax({
              method: "POST",
              url: "http://localhost:3000/currentUser",
              data: { id: userLog }
            }).done(function () {
              $('#login-music').animate({volume: 0}, 2000)
              setTimeout(function () {
                $('#login-music').trigger('leave', { trigger: true })
                App.router.navigate('/game', {trigger: true})
              }, 1500)
            })
          } else {
            $('div.new-game-input').text('Try Again')
          }
        }
      })

      $('main').on('click', 'button[data-id]', function () {
        userLog = $(this).data('id')
        $.get(App.Settings.apiRoot + '/users/' + userLog).done(function (user) {
        }).done(function (user) {
          password = user.password
        }).done(function () {
          $('main > div').hide()
          $('main').append(tmpl.newGame())
          if ($('div.new-game-input').text() === "Enter Your Name") {
            $('div.new-game-input').text('Enter Your Password')
          }
          console.log(password)
        })
      })
      $('#login-music').on('leave', function () {
        this.pause()
      })
    })
  }
});

module.exports = Login;