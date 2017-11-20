/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>

_removeData: function(index) {
    delete this._entities[index];
},


// PUBLIC METHODS

getNewSpatialID : function() {

    // TODO: YOUR STUFF HERE!
    return this._nextSpatialID++;

},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    var radius = entity.getRadius();
  //  console.log("radius " + radius);
    // TODO: YOUR STUFF HERE!
    this._entities[spatialID] = pos;
    this._entities[spatialID].radius = radius;
    this._entities[spatialID].entity = entity;
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // TODO: YOUR STUFF HERE!
    this._removeData(spatialID);



},

findEntityInRange: function(posX, posY, radius) {

    // TODO: YOUR STUFF HERE!
    for (var ID in this._entities) {
        var distanceSq = util.distSq(posX, posY,
                                     this._entities[ID].posX,
                                     this._entities[ID].posY);
        var limitSq = util.square(radius + this._entities[ID].radius);
        if (distanceSq < limitSq) {
          return this._entities[ID].entity;
        }
    }

},

findEntitiesInRange: function (posX, posY, radius) {
  var entities = [];
  for (var ID in this._entities) {
      var distanceSq = util.distSq(posX, posY,
                                   this._entities[ID].posX,
                                   this._entities[ID].posY);
      var limitSq = util.square(radius + this._entities[ID].radius);
      if (distanceSq < limitSq) {
        entities.push(this._entities[ID].entity);
      }
  }
  return entities;
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
