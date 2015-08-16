var Backbone = require('backbone');

// App
var App = require('./app');
var monsterCollection = require('./collections/monster');
var characterCollection = require('./collections/character')
var magicCollection = require('./collections/magic')
var cellCollection = require('./collections/cell')

// View: List Users
var TerrainBattleView = require('./views/terrain-battle');
App.Views.TerrainBattle  = new TerrainBattleView;

// View: Home Page
var HomePage = require('./views/home');
App.Views.HomePage = new HomePage;

var NewGame = require('./views/new-game')
App.Views.NewGame = new NewGame

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
    '*actions': 'index'
  },

  // Route handlers
  index: function() {
    App.Views.HomePage.render();
  },

  terrainBattle: function(terrain) {
      App.Views.TerrainBattle.render(terrain);
  },

  listMagics: function() {
    App.Views.ListMagics.render();
  },

  showMagic: function(id) {
    App.Views.ListMagics.render(id);
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
    App.Views.ListCharacters.render();
  },

  showCharacter: function(id) {
    App.Views.ListCharacters.render(id);
  },

  world: function(id) {
    App.Views.GameWorld.render();
  },

  newGame: function() {
    App.Views.NewGame.render()
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
