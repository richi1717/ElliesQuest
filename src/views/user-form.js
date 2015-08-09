var $ = require('jquery');
var Backbone = require('backbone');
var formTemplate = require('../templates/user-form.hbs');


/****************************************
  App
*****************************************/

var App = require('../app');
var User = require('../models/user');

/****************************************
  View: User Form
*****************************************/

var UserFormView = Backbone.View.extend({
  el: $("main"),
  editMode: false,

  render: function (userId) {
    var _this = this;
    this.editMode = !!userId;

    $('body').removeClass().addClass('users');

    // Display form in Create Mode
    if (!this.editMode) {
      var output = formTemplate();
      this.$el.html(output);

    // Display form in Update Mode
    } else {
      var user = this.user = new User({ id: userId });

      user.fetch().done(function () {
        var output = formTemplate(user.toJSON());
        _this.$el.html(output);
      });
    }
  },

  events: {
    "submit form.user": "submitForm"
  },

  submitForm: function () {
    // Collect Form Data
    var formData = {
      name: $('form.user input[name="name"]').val(),
      hobby: $('form.user input[name="hobby"]').val()
    };

    // Add Mode (Create User)
    if (!this.editMode) {

      // Check if fields are filled before submitting
      if(!!formData.name == false || !!formData.hobby == false){
        alert("Please fill out all the fields")
        return false;
      } else {
        // Only set the image on add mode
        formData.img = 'http://robohash.org/'+ Date.now().toString(16) + '.png'

        App.Collections.user.create(formData, {
          success: function (user) {
            App.router.navigate('/users', { trigger: true });
          }
        });
      }

    // Edit Mode (Update User)
    } else {
      this.user.set(formData);
      this.user.save().done(function () {
        App.router.navigate('/users', { trigger: true });
      });
    }

    // Prevent Default
    return false;
  }
});

module.exports = UserFormView;
