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



// Initial, inheritable, default values
Tower.prototype.cx = 200;
Tower.prototype.cy = 200;
Tower.prototype.damage = 0;
Tower.prototype.splash = false;
Tower.prototype.land = true;
Tower.prototype.air = true;
Tower.prototype.radius = 20;
Tower.prototype.firerate = 60;


Tower.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death


    if (this._isDeadNow) return entityManager.KILL_ME_NOW;


    // Handle firing
    this.maybeFireBullet();

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

Tower.prototype.maybeFireBullet = function () {

    if (keys[this.KEY_FIRE]) {

        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.2;

        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           this.velX + relVelX, this.velY + relVelY,
           this.rotation);

    }

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
