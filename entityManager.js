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
  [0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, -1, -1, 0],
  [0, 0, 0, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, -1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0],
],

_enemies : [],
airIconSelected : false,
arrowIconSelected : false,
cannonIconSelected : false,
spriteOnMouse : null,
isSpriteOnMouse : false,


arrowTowerStats : {
  damage : 20,
  splash : false,
  land : true,
  air : true,
  radius : 100,
  firerate : 160,
  cost : 50
},

airTowerStats : {
  damage : 40,
  splash : false,
  land : false,
  air : true,
  radius : 80,
  firerate : 150,
  cost : 70
},

cannonTowerStats : {
  damage : 60,
  splash : true,
  land : true,
  air : false,
  radius : 60,
  firerate : 50,
  cost : 100
},

// "PRIVATE" METHODS

generateEnemies : function(descr) {
  for (var i = 0; i < descr.num; i++) {
    descr.cy -= 30;
    this._enemies.push(new Enemy(descr));
  }
},




//Generates a tower at mouse location if spot is legal and available
generateArrowTower : function(descr) {
  var x = Math.floor(descr.cx/40);
  var y =  Math.floor(descr.cy/40);
  descr.cx = x*40 + 20;
  descr.cy = y*40 + 20;
  descr.damage = this.arrowTowerStats.damage;
  descr.splash = this.arrowTowerStats.splash;
  descr.land = this.arrowTowerStats.land;
  descr.air = this.arrowTowerStats.air;
  descr.radius = this.arrowTowerStats.radius;
  // Skjóta this.arrowTowerStats.firerate sinnum á mín
  descr.firerate = (60/this.arrowTowerStats.firerate)*(1000/NOMINAL_UPDATE_INTERVAL);
  if(this._towerSpots[y][x] === 0 && GOLD >= 50) {
    removeGold(50);
    this._towers.push(new Tower(descr));
    this._towerSpots[y][x] = 1;
  }
},


generateCannonTower : function(descr) {
  var x = Math.floor(descr.cx/40);
  var y =  Math.floor(descr.cy/40);
  descr.cx = x*40 + 20;
  descr.cy = y*40 + 20;
  descr.damage = this.cannonTowerStats.damage;
  descr.splash = this.cannonTowerStats.splash;
  descr.land = this.cannonTowerStats.land;
  descr.air = this.cannonTowerStats.air;
  descr.radius = this.cannonTowerStats.radius;
  // Skjóta this.cannonTowerStats.firerate sinnum á mín
  descr.firerate = (60/this.cannonTowerStats.firerate)*(1000/NOMINAL_UPDATE_INTERVAL);
  if(this._towerSpots[y][x] === 0 && GOLD >= 100){
    removeGold(100);
    this._towers.push(new Tower(descr));
    this._towerSpots[y][x] = 1;
  }

},

generateAirTower : function(descr) {
  var x = Math.floor(descr.cx/40);
  var y =  Math.floor(descr.cy/40);
  descr.cx = x*40 + 20;
  descr.cy = y*40 + 20;
  descr.damage = this.airTowerStats.damage;
  descr.splash = this.airTowerStats.splash;
  descr.land = this.airTowerStats.land;
  descr.air = this.airTowerStats.air;
  descr.radius = this.airTowerStats.radius;
  // Skjóta this.airTowerStats.firerate sinnum á mín
  descr.firerate = (60/this.airTowerStats.firerate)*(1000/NOMINAL_UPDATE_INTERVAL);
  if(this._towerSpots[y][x] === 0 && GOLD >= 70){
    removeGold(70);
    this._towers.push(new Tower(descr));
    this._towerSpots[y][x] = 1;
  }
},


_findNearestShip : function(posX, posY) {
  var nearest = 1000000;
  var nearestEnemy;
  for(var i = 0; i < this._enemies.length; i++){
    var posEnemy = this._enemies[i].getPos();
    var distance = util.distSq(posX,posY,posEnemy.posX,posEnemy.posY);
    if(distance <= nearest){
      nearestEnemy = this._enemies[i];
      nearest = distance;
    }
  }
  return nearestEnemy;
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
    this._categories = [this._enemies,this._bullets, this._towers];
},

init: function() {


    // I could have made some ships here too, but decided not to.
    //this._generateShip();
},


fireBullet: function(damage, cx, cy, velX, velY, rotation) {
  this._bullets.push(new Bullet( {
                                  damage : damage,
                                  sprite : g_sprites.arrow,
                                  cx: cx,
                                  cy: cy,
                                  velX: velX,
                                  velY: velY,
                                  rotation: rotation}));
},

beginningOfLevel : true,

KEY_CONTINUE : ' '.charCodeAt(0),
continue : true,

update: function(du) {
  if (eatKey(this.KEY_CONTINUE)) this.continue = true;
  //console.log(this.beginningOfLevel, this.continue);
  if(this.beginningOfLevel && this.continue) {

    LEVEL++;
      this.generateEnemies({
        cy : 0,
        lives: 100+LEVEL*10,
        sprite : LEVEL === 1 ? g_sprites.enemy1 : LEVEL === 2 ? g_sprites.enemy2 : g_sprites.enemy3,
        num : 4 + LEVEL
      });
      this.beginningOfLevel = false;
  }

   var x = g_mouseX;
   var y = g_mouseY;
   var radius = 38/2;
   if(x >= 630-radius && x <= 630 + radius && y >= 150 - radius && y <= 150 + radius){
     this.arrowIconSelected = true;
     if(mouseDown && GOLD >= 50){
       this.spriteOnMouse = g_sprites.arrowTower;
       this.isSpriteOnMouse = true;
       mouseDown = false;
     }
   }
   else if(x >= 680-radius && x <= 680 + radius && y >= 150 - radius && y <= 150 + radius){
     this.airIconSelected = true;
     if(mouseDown && GOLD >= 70){
       this.spriteOnMouse = g_sprites.airTower;
       this.isSpriteOnMouse = true;
       mouseDown = false;
     }
   }
   else if(x >= 730-radius && x <= 730 + radius && y >= 150 - radius && y <= 150 + radius){
     this.cannonIconSelected = true;
     if(mouseDown && GOLD >= 100){
       this.spriteOnMouse = g_sprites.cannonTower;
       this.isSpriteOnMouse = true;
       mouseDown = false;
     }
   }
   else{
      this.airIconSelected = false;
      this.arrowIconSelected = false;
      this.cannonIconSelected = false;
   }

   if(this.isSpriteOnMouse){
     if(mouseDown){
       if(this.spriteOnMouse === g_sprites.arrowTower){
       entityManager.generateArrowTower({
         cx : g_mouseX,
         cy : g_mouseY,
         sprite : g_sprites.arrowTower
       });
     }
       if(this.spriteOnMouse === g_sprites.airTower){
       entityManager.generateAirTower({
         cx : g_mouseX,
         cy : g_mouseY,
         sprite : g_sprites.airTower
       });
     }
       if(this.spriteOnMouse === g_sprites.cannonTower){
       entityManager.generateCannonTower({
         cx : g_mouseX,
         cy : g_mouseY,
         sprite : g_sprites.cannonTower
       });
     }
      mouseDown = false;
      this.isSpriteOnMouse = false;
     }
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
        LIVES--;
      } else {
        i++;
      }

    }

  }

},

renderTowerStats: function(ctx, tower){
  var towerstats;
  ctx.font= "bold 18px Georgia";
  ctx.fillStyle = 'black';
  if(tower === "arrow"){
    ctx.fillText("Arrow Tower", 667, 23);
    towerstats = this.arrowTowerStats;
  }
  else if(tower === "air"){
    ctx.fillText("Air Tower", 677, 23);
    towerstats = this.airTowerStats;
  }
  else if(tower === "cannon"){
    ctx.fillText("Cannon Tower", 660, 23);
    towerstats = this.cannonTowerStats;
  }
  ctx.font= "bold 14px Georgia";
  if(towerstats.cost > GOLD)
   ctx.fillStyle = 'red';
  else{
    ctx.fillStyle = 'green';
  }
  ctx.fillText("Cost: " + towerstats.cost, 610, 35);
  ctx.fillStyle = 'cyan';
  ctx.fillText("Damage: " + towerstats.damage, 610, 49);
  ctx.fillText("Splash Damage: " + towerstats.splash, 610, 63);
  ctx.fillText("Land Attacks: " + towerstats.land, 610, 77);
  ctx.fillText("Air Attacks: " +  towerstats.air, 610, 91);
  ctx.fillText("Radius: " + towerstats.radius, 610, 105);
  ctx.fillText("Firerate: " + towerstats.firerate, 610, 119);
},

renderInfo: function(ctx){
  ctx.font= "bold 17px Georgia";
  //Gold
  ctx.fillStyle = 'yellow';
  ctx.fillText("Gold: " + GOLD, 610, 20);
  //lives
  ctx.fillStyle = 'red';
  ctx.fillText("Lives: " + LIVES, 765, 20);
  //level
  ctx.fillStyle = 'cyan';
  ctx.fillText("Level: " + LEVEL, 610, 40);


},

render: function(ctx) {
  g_sprites.background.drawAt(ctx, 0, 0);
  //Interface
  if(!this.arrowIconSelected && !this.airIconSelected && !this.cannonIconSelected){
    this.renderInfo(ctx);
  }
  else{
    if(this.arrowIconSelected){
      this.renderTowerStats(ctx, "arrow");
    }
    else if(this.airIconSelected){
      this.renderTowerStats(ctx, "air");
    }
    else if(this.cannonIconSelected){
      this.renderTowerStats(ctx, "cannon");
    }
  }


  //Icons
  g_sprites.iconTowerArrow.drawCentredAt (ctx, 630, 150, 0);
  g_sprites.iconTowerAir.drawCentredAt (ctx, 680, 150, 0);
  g_sprites.iconTowerCannon.drawCentredAt (ctx, 730, 150, 0);

  //Sprite following mouse
  if(this.isSpriteOnMouse){
    var x = Math.floor(g_mouseX/40);
    var y =  Math.floor(g_mouseY/40);
    var towerStats;
    if(this.spriteOnMouse === g_sprites.arrowTower)
      towerStats = this.arrowTowerStats;
    else if(this.spriteOnMouse === g_sprites.airTower)
      towerStats = this.airTowerStats;
    else if(this.spriteOnMouse === g_sprites.cannonTower)
      towerStats = this.cannonTowerStats;
    if(x < this._towerSpots[0].length && y < this._towerSpots.length){
      if(this._towerSpots[y][x] === 0){
        ctx.fillStyle = 'green';
        ctx.fillRect(x*40, y*40, 40, 40);
        this.spriteOnMouse.drawCentredAt(ctx, x*40+20, y*40+20, 0);
        ctx.beginPath();
        ctx.arc(x*40+20,y*40+20,towerStats.radius,0,2*Math.PI);
        ctx.stroke();
      }
      else{
        ctx.fillStyle = 'red';
        ctx.fillRect(g_mouseX-20, g_mouseY-20, 40, 40);
        this.spriteOnMouse.drawCentredAt(ctx, g_mouseX, g_mouseY, 0);
        ctx.beginPath();
        ctx.arc(g_mouseX,g_mouseY,towerStats.radius,0,2*Math.PI);
        ctx.stroke();
      }

    }

  }


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
