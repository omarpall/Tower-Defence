/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_enemies   : [],
_bullets : [],
_ships   : [],
_towers  : [],

_towerSpots :

 [
  [0, -1, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0],
  [0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0],
  [0, -1, 0, 0, -1, -1, -1, -1, 0, 0, 0, -1, 0, 0, 0],
  [0, -1, -1, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0],
  [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0],
  [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0],
  [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0],
  [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, -1, -1, -1],
  [0, 0, 0, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
],

_enemies : [],
gold : 0,
lives : 50,
level : 1,



// "PRIVATE" METHODS

generateEnemies : function(descr) {
  for (var i = 0; i < 5; i++) {
    descr.cy -= 30;
    this._enemies.push(new Enemy(descr));
  }
},



//Generates a tower at mouse location if spot is legal and available
generateArrowTower : function(descr) {
  var rotation = 0;
  var x = Math.floor(descr.cx/40);
  var y =  Math.floor(descr.cy/40);
  descr.cx = x*40 + 20;
  descr.cy = y*40 + 20;
  if(this._towerSpots[y][x] === 0){
    this._towers.push(new Tower(descr));
    this._towerSpots[y][x] = 1;
  }
},


generateCannonTower : function(descr) {
  var rotation = 0;
  var x = Math.floor(descr.cx/40);
  var y =  Math.floor(descr.cy/40);
  descr.cx = x*40 + 20;
  descr.cy = y*40 + 20;
  descr.damage = 60;
  descr.splash = true;
  descr.land = true;
  descr.air = false;
  descr.radius = 120;
  descr.firerate = 50;
  if(this._towerSpots[y][x] === 0){
    this._towers.push(new Tower(descr));
    this._towerSpots[y][x] = 1;
  }

},

generateAirTower : function(descr) {
  var rotation = 0;
  var x = Math.floor(descr.cx/40);
  var y =  Math.floor(descr.cy/40);
  descr.cx = x*40 + 20;
  descr.cy = y*40 + 20;
  if(this._towerSpots[y][x] === 0){
    this._towers.push(new Tower(descr));
    this._towerSpots[y][x] = 1;
  }
},


_findNearestShip : function(posX, posY) {

},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
	fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,


// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._enemies,this._bullets, this._towers, this.gold, this.lives, this.level];
},

init: function() {


    // I could have made some ships here too, but decided not to.
    //this._generateShip();
},


fireBullet: function(cx, cy, velX, velY, rotation) {
  this._bullets.push(new Bullet( {cx: cx,
                                  cy: cy,
                                  velX: velX,
                                  velY: velY,
                                  rotation: rotation}));
},

beginningOfLevel : true,

update: function(du) {
  if(this.beginningOfLevel){

      this.generateEnemies({
        cy : 0,
        sprite : g_sprites.enemy1
      });
      this.beginningOfLevel = false;
  }

  for (var c = 0; c < this._categories.length; c++) {

    var aCategory = this._categories[c];
    var i = 0;

    while (i < aCategory.length) {
      var status = aCategory[i].update(du);
       if (status === this.KILL_ME_NOW) {
          aCategory.splice(i, 1);
       }
      if (status === "passed") {
        aCategory.splice(i, 1);
        this._categories[3]--;
      } else {
        i++;
      }

    }

  }

},

render: function(ctx) {
  g_sprites.background.drawAt(ctx, 0, 0);

  ctx.font= "16px Georgia";
  //gold
  ctx.fillStyle = 'yellow';
  ctx.fillText("Gold: " + this._categories[3], 610, 20);
  //lives
  ctx.fillStyle = 'red';
  ctx.fillText("Lives: " + this._categories[4], 730, 20);
  //level
  ctx.fillStyle = 'cyan';
  ctx.fillText("Level: " + this._categories[5], 610, 75);

  g_sprites.iconTowerAir.drawCentredAt (
    ctx, 700, 150, 0
  );


    for (var c = 0; c < this._categories.length; ++c) {
        var aCategory = this._categories[c];
        for (var i = 0; i < aCategory.length; ++i) {
           aCategory[i].render(ctx);
        }
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

entityManager.init();
