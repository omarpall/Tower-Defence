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

    this.rememberResets();

    // Default sprite, if not otherwise specified
    //this.sprite = g_sprites.tower;

    // Set normal drawing scale, and warp state off
    this._isWarping = false;
};

Tower.prototype = new Entity();

Tower.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Tower.prototype.KEY_FIRE   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Tower.prototype.rotation = 0;
Tower.prototype.cx = 200;
Tower.prototype.cy = 200;
Tower.prototype.numSubSteps = 1;

// HACKED-IN AUDIO (no preloading)
/*Tower.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");*/

/*
Ship.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -1;
    this.warpSound.play();

    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};
*/
/*
Ship.prototype._updateWarp = function (du) {

    var SHRINK_RATE = 3 / SECS_TO_NOMINALS;
    this._scale += this._scaleDirn * SHRINK_RATE * du;

    if (this._scale < 0.2) {

        this._moveToASafePlace();
        this.halt();
        this._scaleDirn = 1;

    } else if (this._scale > 1) {

        this._scale = 1;
        this._isWarping = false;

        // Reregister me from my old posistion
        // ...so that I can be collided with again
        spatialManager.register(this);

    }
};
*/
/*
Ship.prototype._moveToASafePlace = function () {

    // Move to a safe place some suitable distance away
    var origX = this.cx,
        origY = this.cy,
        MARGIN = 40,
        isSafePlace = false;

    for (var attempts = 0; attempts < 100; ++attempts) {

        var warpDistance = 100 + Math.random() * g_canvas.width /2;
        var warpDirn = Math.random() * consts.FULL_CIRCLE;

        this.cx = origX + warpDistance * Math.sin(warpDirn);
        this.cy = origY - warpDistance * Math.cos(warpDirn);

        this.wrapPosition();

        // Don't go too near the edges, and don't move into a collision!
        if (!util.isBetween(this.cx, MARGIN, g_canvas.width - MARGIN)) {
            isSafePlace = false;
        } else if (!util.isBetween(this.cy, MARGIN, g_canvas.height - MARGIN)) {
            isSafePlace = false;
        } else {
            isSafePlace = !this.isColliding();
        }

        // Get out as soon as we find a safe place
        if (isSafePlace) break;

    }
};*/

Tower.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);

    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

/*
    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }
*/
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

    spatialManager.register(this);


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
    g_sprites.tower.drawCentredAt (
      ctx, this.cx, this.cy, this.rotation
    );
};
