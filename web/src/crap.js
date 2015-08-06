"use strict";

(function() {

    var $ = require('jquery');
    var Backbone = require('backbone');
    var _ = require('underscore');
    Backbone.$ = $;

    var worldBounds = {
        min: {x: 0, y: 0},
        max: {x: 15, y: 9}
    };

    var bounds = {
        min: {x: 0, y: 0},
        max: {x: 15, y: 9}
    };

    var Direction = {
        top: 12,
        right: 3,
        bottom: 6,
        left: 9
    }

    // Elements
    var personEl = document.querySelector("p");

    
    // Objects
    function Person(){
        this.facing = Direction.right;
        this.x = 5;
        this.y = 5;
        this.moveUp = function(){

            if(this.facing != Direction.top){
                this.facing = Direction.top;
                return false;
            }

            var target = {x: this.x, y:this.y - 1};

            if(inBoundary(target)){

                // check if the target is traversable
                var targetCell = getCell(target);

                if(targetCell.traversable){
                    if(targetCell.terrain == "quicksand"){
                        alert("You Died");
                        resetGame(this);
                    }
                    else
                    {
                        this.y = target.y;       
                    }
                    
                }                
            } 
            else {
                if(inWorld(target)){

                    bounds = {
                        min: {x: bounds.min.x, y: bounds.min.y - 10},
                        max: {x: bounds.max.x, y: bounds.max.y - 10}
                    };
                    this.y = bounds.max.y;    
                }
            }                   
        };
        this.moveDown = function(){

            if(this.facing != Direction.bottom){
                this.facing = Direction.bottom;
                return false;
            }

            var target = {x: this.x, y: this.y + 1};
            if(inBoundary(target)){                
                var targetCell = getCell(target);
                if(targetCell.traversable){
                    if(targetCell.terrain == "quicksand"){
                        alert("You Died");
                        resetGame(this);
                    }
                    else
                    {
                        this.y = target.y;
                    }
                }
            }  
            else {
                if(inWorld(target)){

                    bounds = {
                        min: {x: bounds.min.x, y: bounds.min.y + 10},
                        max: {x: bounds.max.x, y: bounds.max.y + 10}
                    };
                    this.y = bounds.min.y;    
                }
            }          
        };
        this.moveLeft = function(){

            if(this.facing != Direction.left){
                this.facing = Direction.left;
                return false;
            }


            var target = {x: this.x - 1, y: this.y};
            
            if(inBoundary(target)){                
                var targetCell = getCell(target);
                if(targetCell.traversable){
                    if(targetCell.terrain == "quicksand"){
                        alert("You Died");
                        resetGame(this);
                    }
                    else
                    {
                        this.x = target.x;
                    }
                }
            } else {

                if(inWorld(target)){

                     bounds = {
                        min: {x: bounds.min.x - 16, y: bounds.min.y},
                        max: {x: bounds.max.x - 16, y: bounds.max.y}
                    };
                    this.x = bounds.max.x;    
                }
                
            }           
        };
        this.moveRight = function(){

            if(this.facing != Direction.right){
                this.facing = Direction.right;
                return false;
            }

            var target = {x: this.x + 1, y: this.y};
            if(inBoundary(target)){                
                var targetCell = getCell(target);
                if(targetCell.traversable){
                    if(targetCell.terrain == "quicksand"){
                        alert("You Died");
                        resetGame(this);
                    }
                    else
                    {
                        this.x = target.x;
                    }
                }
            } else {
                // Load new boundary
                if(inWorld(target)){
                    bounds = {
                        min: {x: bounds.min.x + 16, y: bounds.min.y},
                        max: {x: bounds.max.x + 16, y: bounds.max.y}
                    };
                    this.x = bounds.min.x;
                }
            }            
        };

    }

    function resetGame(person){
        bounds = {
            min: {x: 0, y: 0},
            max: {x: 15, y: 9}
        };
        person.x = 5;
        person.y = 5;

    }
    
    
    var jim = new Person();
    _.extend(jim, Backbone.Events);
    jim.on("moveUp", function(e) {
        this.moveUp();        
    });
    jim.on("moveDown", function(e) {
        this.moveDown();        
    });
    jim.on("moveLeft", function(e) {
        this.moveLeft();        
    });
    jim.on("moveRight", function(e) {
        this.moveRight();        
    });

    // Data
    var cells = [
        {x: 0, y: 0, terrain: "sand", traversable:true},
        {x: 1, y: 0, terrain: "sand", traversable:true},
        {x: 2, y: 0, terrain: "grass", traversable:true},
        {x: 3, y: 0, terrain: "grass", traversable:true},
        {x: 4, y: 0, terrain: "grass", traversable:true},
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
        {x: 2, y: 1, terrain: "grass", traversable:true},
        {x: 3, y: 1, terrain: "grass", traversable:true},
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
 
    ];

    // bounds = {
    //     min: {x: 8, y:0},
    //     max: {x: 15, y:7}
    // };
    drawMap(cells, bounds);    
    drawPerson(jim);

    // Bind Document Events
    $("body").on("keydown", function(e){
        
        // Map arrows to events
        if(e.keyCode === 38){
            jim.trigger("moveUp");            
            e.preventDefault();
        } else if (e.keyCode === 37){
            jim.trigger("moveLeft");            
            e.preventDefault();
        } else if (e.keyCode === 39){
            jim.trigger("moveRight");            
            e.preventDefault();
        } else if (e.keyCode === 40){
            jim.trigger("moveDown");            
            e.preventDefault();
        } else if (e.keyCode === 32){

        } else {
            // nothing
            console.log(e.keyCode);
        }
        drawMap(cells);
        drawPerson(jim);
        
    });
    
    
    function drawMap(cells, bounds){
        var cell;
        for (var i = 0; i < cells.length; i++) {

            cell = cells[i];

            if(inBoundary(cell)) {
                drawTerrain(cell);    
            }
            
            
        }
    }
    function drawPerson(person){

        var child = coordToIndex(person.x, person.y);
        var selector = '.content div:nth-child(' + child + ')';
        var el = document.querySelector(selector);

        personEl.style.width =  el.offsetWidth  + "px";
        personEl.style.left =  el.offsetLeft + "px";
        personEl.style.top = el.offsetTop + "px";

        $(personEl).removeClass("top right bottom left")        
        if(person.facing == Direction.right){
            $(personEl).addClass("right");            
        } else if (person.facing == Direction.bottom) {
            $(personEl).addClass("bottom");
        } else if (person.facing == Direction.left) {
            $(personEl).addClass("left");
        } else if (person.facing == Direction.top) {
            $(personEl).addClass("top");
        } else {
            // Nothing
        } 

    }

    function drawTerrain(cell){

        var child = coordToIndex(cell.x, cell.y);
        var selector = '.content div:nth-child(' + child + ')';
        var el = document.querySelector(selector);
        var color = "black";

        el.className = cell.terrain;

    }

    function inBoundary(target){

        if(target.x < bounds.min.x) {
            return false;
        }

        if(target.x > bounds.max.x) {
            return false;
        }

        if(target.y < bounds.min.y) {
            return false;
        }

        if(target.y > bounds.max.y) {
            return false;
        }

        return true;

    }

    function inWorld(target){

        if(target.x < worldBounds.min.x){
            return false;
        }

        if(target.x > worldBounds.max.x){
            return false;
        }

        if(target.y < worldBounds.min.y){
            return false;
        }

        if(target.y > worldBounds.max.y){
            return false;
        }

        return true;

    }

    function coordToIndex(x, y){

        // Convert a coordinate to an index 1-16
        var idx = (16 * (y - bounds.min.y)) + (x - bounds.min.x) + 1;
        return idx
    }

    function getCell(point) {

        var cell = cells.find(function(el){
            return el.x == point.x && el.y == point.y;
        })

        return cell;
    }

    if (!Array.prototype.find) {
      Array.prototype.find = function(predicate) {
        if (this == null) {
          throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
        return undefined;
      };
    }

})();