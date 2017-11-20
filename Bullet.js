// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    this.fireSound.play();

/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.fireSound = new Audio(
    "sounds/bulletFire.ogg");
Bullet.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");

// Initial, inheritable, default values
Bullet.prototype.rotation = 0;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 3;
Bullet.prototype.velY = 3;
Bullet.prototype.radius = 1000;

// Convert times from milliseconds to "nominal" time units.
//Bullet.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Bullet.prototype.update = function (du) {
    // TODO: YOUR STUFF HERE! --- Unregister and check for death

    spatialManager.unregister(this);

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    

    if (this.cx < 0 || this.cx > g_canvas.width - 250) {
      return entityManager.KILL_ME_NOW;
    }
    if (this.cy < 0 || this.cy > g_canvas.height) {
      return entityManager.KILL_ME_NOW;
    }

    // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();

    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit(this.damage);
        if (canTakeHit) canTakeHit.call(hitEntity);
        if (this.sprite === g_sprites.cannonRound) {
          var entities = spatialManager.findEntitiesInRange(
              this.cx+this.velX*(2), this.cy+this.velY*(2), ((g_sprites.explosion.width/8)*this.splash)/2
          );
          console.log(((g_sprites.explosion.width/8)*this.splash)/2);
          if (entities) {
            for (var i in entities) {
              canTakeHit = entities[i].takeBulletHit(this.damage);
              if (canTakeHit) canTakeHit.call(entities[i]);
            }
          }
          console.log(this.velX, this.velY, this.cx+this.velX*(1.5), this.cy+this.velY*(1.5));
          entityManager.renderExplosion(this.cx+this.velX*(2), this.cy+this.velY*(2), this.splash);
        }
        return entityManager.KILL_ME_NOW;
    }

    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);

};

Bullet.prototype.getRadius = function () {
    return 20;
};

Bullet.prototype.takeBulletHit = function () {
    this.kill();

    // Make a noise when I am zapped by another bullet
    this.zappedSound.play();
};

Bullet.prototype.render = function (ctx) {
  this.sprite.drawCentredAt (
    ctx, this.cx, this.cy, this.rotation
  );
  console.log(this.rotation);
};
