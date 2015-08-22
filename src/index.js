var Backbone = require('backbone');

// App
var App = require('./app');
var HomePage = require('./views/home');
App.Views.HomePage = new HomePage;
var monsterCollection = require('./collections/monster');
// var characterCollection = require('./collections/character')
var magicCollection = require('./collections/magic')
var cellCollection = require('./collections/cell')

// View: List Users
var TerrainBattleView = require('./views/terrain-battle');
App.Views.TerrainBattle  = new TerrainBattleView;

// View: Home Page

var NewGame = require('./views/new-game')
App.Views.NewGame = new NewGame

var GameOver = require('./views/game-over.js')
App.Views.GameOver = new GameOver

var ListMonstersView = require('./views/list-monsters');
App.Views.ListMonsters = new ListMonstersView;

var ListCharactersView = require('./views/list-characters');
App.Views.ListCharacters = new ListCharactersView;

var ListMagicsView = require('./views/list-magics');
App.Views.ListMagics = new ListMagicsView;

// View: List Products
var GameWorldView = require('./views/world');
App.Views.GameWorld = new GameWorldView;

// App Router
App.Router = Backbone.Router.extend({

  // Route definitions
  routes: {
    '': 'index',
    'battle/:terrain(/)': 'terrainBattle',
    'monsters(/)': 'listMonsters',
    'monsters/:id(/)': 'showMonster',
    'magics(/)': 'listMagics',
    'magics/:id(/)': 'showMagic',
    'cells(/)': 'listCells',
    'cells/:id': 'showCell',
    'characters(/)': 'listCharacters',
    'characters/:id(/)': 'showCharacter',
    'game(/)': 'world',
    'new-game(/)': 'newGame',
    'game-over(/)': 'gameOver',
    '*actions': 'index'
  },

  // Route handlers
  index: function() {
    App.Views.HomePage.render();
  },

  terrainBattle: function(terrain) {
    $.get(App.Settings.apiRoot + '/currentUser').done(function (currentUser) {
      App.currentUser = currentUser;
      console.log(currentUser.id)
      App.Views.TerrainBattle.render(terrain);
    })
  },

  listMagics: function() {
    $.get(App.Settings.apiRoot + '/currentUser').done(function (currentUser) {
      App.currentUser = currentUser;
      console.log(currentUser.id)
      App.Views.ListMagics.render();
    })
  },

  showMagic: function(id) {
    $.get(App.Settings.apiRoot + '/currentUser').done(function (currentUser) {
      App.currentUser = currentUser;
      console.log(currentUser.id)
      App.Views.ListMagics.render(id);
    })
    console.log(id)
  },

  listCells: function() {
    App.Views.ListCells.render();
  },

  showCell: function(id) {
    App.Views.ListCells.render(id);
  },

  listMonsters: function() {
    App.Views.ListMonsters.render();
  },

  showMonster: function(id) {
    App.Views.ListMonsters.render(id);
    console.log(id)
  },

  listCharacters: function() {
    $.get(App.Settings.apiRoot + '/currentUser').done(function (currentUser) {
      App.currentUser = currentUser;
      console.log(currentUser.id)
      App.Views.ListCharacters.render();
    })
  },

  showCharacter: function(id) {
    $.get(App.Settings.apiRoot + '/currentUser').done(function (currentUser) {
      App.currentUser = currentUser;
      console.log(currentUser.id)
      App.Views.ListCharacters.render(id);
    })
  },

  world: function(id) {
    $.get(App.Settings.apiRoot + '/currentUser').done(function (currentUser) {
      App.currentUser = currentUser;
      console.log(currentUser.id)
      App.Views.GameWorld.render();
    })
  },

  newGame: function() {
    App.Views.NewGame.render()
  },

  gameOver: function() {
    App.Views.GameOver.render()
  },

  defaultRoute: function(actions) {
    
  }
});

// module.export = {
//   App.Router: App.Router
// }

// Initiate the router
App.router = new App.Router;

Backbone.history.start();
$.get(App.Settings.apiRoot + '/currentUser').done(function (currentUser) {
  App.currentUser = currentUser;
  console.log(currentUser.id)
})
timerArray = []
$(window).on('hashchange', function(){
console.log(timerArray)
  var length = timerArray.length
  var i = 0
  while (i < length) {
    timer = timerArray.pop()
    clearInterval(timer)
    clearTimeout(timer)
    console.log(timer)
    i++
  }
})
