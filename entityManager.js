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
_enemies : [],



// "PRIVATE" METHODS

generateEnemies : function() {
    this._enemies.push(new Enemy());
},

generateShip : function(descr) {
    this._ships.push(new Ship(descr));
},

generateTower : function(descr) {
    this._towers.push(new Tower(descr));
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
    this._categories = [this._enemies, this._bullets, this._ships, this._towers, this._enemies];
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


update: function(du) {
  for (var c = 0; c < this._categories.length; c++) {

    var aCategory = this._categories[c];
    var i = 0;

    while (i < aCategory.length) {
      var status = aCategory[i].update(du);

      if (status === this.KILL_ME_NOW) {
        aCategory.splice(i, 1);
      } else {
        i++;
      }

    }

  }
},

render: function(ctx) {
  g_sprites.background.drawAt(ctx, 0, 0);
  var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowRocks &&
            aCategory == this._rocks)
            continue;
        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

entityManager.init();
