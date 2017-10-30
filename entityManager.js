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



// "PRIVATE" METHODS

_generateEnemies : function() {

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
    this._categories = [this._enemies, this._bullets, this._ships];
},

init: function() {


    // I could have made some ships here too, but decided not to.
    //this._generateShip();
},



update: function(du) {




},

render: function(ctx) {
  g_sprites.background.drawAt(ctx, 0, 0);
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

entityManager.init();
