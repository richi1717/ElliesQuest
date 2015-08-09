var $ = require('jquery');
var Backbone = require('backbone');
var productTemplate = require('../templates/product-form.hbs');

/****************************************
  App
*****************************************/

var App = require('../app');
var Product = require('../models/product');

/****************************************
  View: Product Form
*****************************************/

var ProductFormView = Backbone.View.extend({
  el: $("main"),
  editMode: false,

  render: function (prodId) {
    var _this = this;
    this.editMode = !!prodId;

    $('body').removeClass().addClass('products');

    // Display form in Create Mode
    if (!this.editMode) {
      var output = productTemplate();
      this.$el.html(output);

    // Display form in Update Mode
    } else {
      var product = this.product = new Product({ id: prodId });
      
      product.fetch().done(function () {
        var output = productTemplate(product.toJSON());
        _this.$el.html(output);
      });
    }
  },

   events: {
    "submit form.product": "submitForm"
  },

  submitForm: function () {
    // Collect Form Data
    var formData = {
      name: $('form.product input[name="name"]').val(),
      type: $('form.product select[name="type"]').val(),
      price: $('form.product input[name="price"]').val(),
      qty: $('form.product input[name="qty"]').val(),
      img: $('form.product input[name="img"]').val(),
    };

    // Add Mode (Create Product)
    if (!this.editMode) {

      // Check if fields are filled before submitting
      if(!!formData.name == false || !!formData.type == false || !!formData.price == false || !!formData.qty == false || !!formData.img == false){
        alert("Please fill out all the fields")
        return false;
      } else {
        App.Collections.product.create(formData, {
          success: function () {
            App.router.navigate('/products', { trigger: true });
          }
        });
      }

    // Edit Mode (Update Product)
    } else {
      this.product.set(formData);
      this.product.save().done(function () {
        App.router.navigate('/products', { trigger: true });
      });
    }

    // Prevent Default
    return false;
  }
});

module.exports = ProductFormView;
