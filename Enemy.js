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
    this.wait = 8;
    this.frame = 0;

}
Enemy.prototype.KEY_FIRE  = ' '.charCodeAt(0);
Enemy.prototype = new Entity();
Enemy.prototype.TOTAL_LIFE;
Enemy.prototype.SPEED = 1;
Enemy.prototype.type = 'ground';
Enemy.prototype.drawcoin = false;
Enemy.prototype.timeToDie = 6;
Enemy.prototype.flightImgPos = 0;
Enemy.prototype.countImg = 2;
Enemy.prototype.rotation = 0;

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
    if(this.countImg < 0){
    this.flightImgPos++;
    this.countImg = 4;
  }
    this.countImg -= du;

    if (this.lives <= 0) {
        this.drawCoin = true;
        this.timeToDie -= du;
        if(this.timeToDie < 0){
          addGold(10);

          this.kill();
        }
        return;
    }

    spatialManager.register(this);

    return null;
};

Enemy.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
}

Enemy.prototype.getType = function() {
  return this.type;
}

Enemy.prototype.takeBulletHit = function (damage) {
    if(this.lives - damage < 0)
      this.lives = 0;
    else{
      this.lives = this.lives - damage;
    }
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
    if(this.drawCoin){
        ctx.font = '20px serif';
        ctx.fillText('+10', this.cx, this.cy);
    }
    if(this.type === 'flight'){
      if(this.flightImgPos%2 === 0){
        this.sprite.drawAnimatedAt(ctx,this.cx,this.cy,this.rotation,0);
      }
      else{
        this.sprite.drawAnimatedAt(ctx,this.cx,this.cy,0,1);
      }
    } else if (this.boss) {
      if (this.wait === 0) {
          this.frame++;
          this.wait = 8;
      } else {
        this.wait--;
      }
      this.sprite.drawBossAnimation(ctx, this.cx, this.cy, this.frame);
      if (this.frame === 5) {
        this.frame = 0;
      }
      ctx.fillStyle="#7FFF00";
      ctx.fillRect(this.cx-10, this.cy-20, liveLeft*20, 3);
    }
    else{
    this.sprite.drawCentredAt (
      ctx, this.cx, this.cy,0
    );
  }
    }
};
