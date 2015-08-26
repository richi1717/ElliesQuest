var $ = require('jquery')
var Backbone = require('backbone')
var tmpl = require('../template.js')

// App
var App = require('../app')
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
         .toggleClass("active")
        $('button:nth-child(29)')
         .text( ($('button:nth-child(29)').text() === '@' ? '2' : '@') )
         .toggleClass("active")
        $('button:nth-child(30)')
         .text( ($('button:nth-child(30)').text() === '#' ? '3' : '#') )
         .toggleClass("active")
        $('button:nth-child(31)')
         .text( ($('button:nth-child(31)').text() === '$' ? '4' : '$') )
         .toggleClass("active")
        $('button:nth-child(32)')
         .text( ($('button:nth-child(32)').text() === '%' ? '5' : '%') )
         .toggleClass("active")
        $('button:nth-child(33)')
         .text( ($('button:nth-child(33)').text() === '^' ? '6' : '^') )
         .toggleClass("active")
        $('button:nth-child(34)')
         .text( ($('button:nth-child(34)').text() === '&' ? '7' : '&') )
         .toggleClass("active")
        $('button:nth-child(35)')
         .text( ($('button:nth-child(35)').text() === '*' ? '8' : '*') )
         .toggleClass("active")
        $('button:nth-child(36)')
         .text( ($('button:nth-child(36)').text() === '-' ? '9' : '-') )
         .toggleClass("active")
        $('button:nth-child(37)')
         .text( ($('button:nth-child(37)').text() === '+' ? '0' : '+') )
         .toggleClass("active")
        $('button:nth-child(38)')
         .text( ($('button:nth-child(38)').text() === '~' ? '<' : '~') )
         .toggleClass("active")
        $('button:nth-child(39)')
         .text( ($('button:nth-child(39)').text() === '≈' ? '>' : '≈') )
         .toggleClass("active")
        $('button:nth-child(40)')
         .text( ($('button:nth-child(40)').text() === '\\' ? '/' : '\\') )
         .toggleClass("active")
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
              $('button[data-id="' + userLog + '"]').remove()
              $('.new-game-start').remove()
              $('button[data-id="1"]').trigger('focus')
              App.router.navigate('/user/' + userLog + '/delete', { trigger: true })
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
      $('button[data-id="1"]').trigger('focus')
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
        })
      })
      $('#login-music').on('leave', function () {
        this.pause()
      })
      function myFunction(e) {
        var x = e.which
        if (x == 37) {
          e.preventDefault()
          $('button:focus').prev().focus()
        } else if (x == 39) {
          $('button:focus').next().focus()
          e.preventDefault()
        } else if (x == 40) {
          e.preventDefault()
          classic = $('button:focus').data('next') + 1
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
          e.preventDefault()
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
    })
  }
})

module.exports = Login