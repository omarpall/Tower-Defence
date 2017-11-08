// ==========
// Tower STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Tower(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);



    // Default sprite, if not otherwise specified
    //this.sprite = g_sprites.tower;

    // Set normal drawing scale, and warp state off

};



Tower.prototype = new Entity();
Tower.prototype.rotation = 0;

Tower.prototype.KEY_FIRE   = ' '.charCodeAt(0);
Tower.prototype.KEY_ROTATE   = 'A'.charCodeAt(0);
// Initial, inheritable, default values



Tower.prototype.update = function (du) {

    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    var enemy = entityManager._findNearestShip(this.cx,this.cy);
    console.log(enemy);
    if(enemy == null){
      console.log("enginn eftir");
    }
    else{
      var pos = enemy.getPos();
      var dist = util.distSq(this.cx,this.cy,pos.posX,pos.posY);
      if(dist < 8000){
      var angleRadians = Math.atan2(pos.posY - this.cy, pos.posX - this.cx);
      this.maybeFireBullet(angleRadians);
    }
    }


    // TODO: YOUR STUFF HERE! --- Warp if isColliding, otherwise Register
/*
    var hitEntity = this.findHitEntity();

    if (hitEntity) {
        this.warp();
        return;
    }
*/




};
/*
Tower.prototype.computeSubStep = function (du) {

    var thrust = this.computeThrustMag();

    // Apply thrust directionally, based on our rotation
    var accelX = +Math.sin(this.rotation) * thrust;
    var accelY = -Math.cos(this.rotation) * thrust;

    accelY += this.computeGravity();

    this.applyAccel(accelX, accelY, du);

    this.wrapPosition();

    if (thrust === 0 || g_allowMixedActions) {
        this.updateRotation(du);
    }
};*/

Tower.prototype.maybeFireBullet = function (angleRadians) {

        var dX = +Math.sin(angleRadians+Math.PI/2);
        var dY = -Math.cos(angleRadians+Math.PI/2);
        var launchDist = 0.5;

        var relVel =  20;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
          relVelX, relVelY,
          this.rotation);



};

Tower.prototype.getRadius = function () {
    return (this.sprite.height*this.sprite.scale / 2) * 0.9;
};

Tower.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Tower.prototype.render = function (ctx) {
    this.sprite.drawCentredAt (
      ctx, this.cx, this.cy, this.rotation
    );
};
