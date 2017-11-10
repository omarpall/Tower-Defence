// ====
// ROCK
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Enemy(descr) {

    // Initial Enemy value
    this.cx = 60;
    this.cy = 0;


    this.SPEED = 1;

    this.setup(descr);
    this.TOTAL_LIFE = this.lives;

}
Enemy.prototype.KEY_FIRE  = ' '.charCodeAt(0);
Enemy.prototype = new Entity();
Enemy.prototype.TOTAL_LIFE;

Enemy.prototype.update = function (du) {

    spatialManager.unregister(this);

    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    if(this.cy > 400)
      return "passed";
    // I DID THIS BIT FOR YOU. NICE, AREN'T I?
    if(this.cy > 140 && this.cx < 140 && this.cx < 460){
      this.cx += this.SPEED * du;
    }
    else if (this.cy > 340 &&  140 < this.cx && this.cx < 300 && this.cx < 460) {
      this.cx += this.SPEED * du;
    }
    else if (this.cx >= 300 && this.cy < 400 && this.cy > 100 && this.cx < 460){
      this.cy -= this.SPEED * du;
    }
    else if (this.cx > 180 && this.cy < 100 && this.cy > 50 && this.cx < 460){
      this.cx -= this.SPEED * du;
    }
    else if (this.cx > 170 && this.cy < 100 && this.cy > 20 && this.cx < 460) {
      this.cy -= this.SPEED * du;
    }
    else if (this.cy < 20 && this.cx > 150 && this.cx < 460){
      this.cx += this.SPEED * du;
    }
    else if(this.cy > 300 && this.cx > 300 && this.cx < 540){
      this.cx += this.SPEED * du;
    }
    else {
      this.cy += this.SPEED * du;
    }


    if (this.lives <= 0) {
        addGold(10);
        this.kill();
        return;
    }

    spatialManager.register(this);

    return null;
};

Enemy.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
}

Enemy.prototype.takeBulletHit = function (damage) {
    this.lives = this.lives - damage;
};


Enemy.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy};
}

Enemy.prototype.getRadius = function () {
  return (this.sprite.height*this.sprite.scale / 2) * 0.9;
}

Enemy.prototype.render = function (ctx) {
  if(this.cx < 600 && this.cy < 400){
    var liveLeft = this.lives/this.TOTAL_LIFE;
    ctx.fillStyle="#FF0000";
    ctx.fillRect(this.cx-10, this.cy-20, 20, 3);
    ctx.fillStyle="#7FFF00";
    ctx.fillRect(this.cx-10, this.cy-20, liveLeft*20, 3);

    this.sprite.drawCentredAt (
      ctx, this.cx, this.cy,0
    );
    }
};
