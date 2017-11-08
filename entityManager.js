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
gold : 0,
lives : 50,
level : 1,
airIconSelected : false,
arrowIconSelected : false,
cannonIconSelected : false,
spriteOnMouse : null,
isSpriteOnMouse : false,


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
  descr.damage = 10;
  descr.splash = false;
  descr.land = true;
  descr.air = true;
  descr.radius = 80;
  // Skjóta 100 sinnum á mín
  descr.firerate = (60/100)*(1000/NOMINAL_UPDATE_INTERVAL);
  if(this._towerSpots[y][x] === 0){
    this._towers.push(new Tower(descr));
    this._towerSpots[y][x] = 1;
  }
},


generateCannonTower : function(descr) {
  var x = Math.floor(descr.cx/40);
  var y =  Math.floor(descr.cy/40);
  descr.cx = x*40 + 20;
  descr.cy = y*40 + 20;
  descr.damage = 60;
  descr.splash = true;
  descr.land = true;
  descr.air = false;
  descr.radius = 120;
  // Skjóta 50 sinnum á mín
  descr.firerate = (60/50)*(1000/NOMINAL_UPDATE_INTERVAL);
  if(this._towerSpots[y][x] === 0){
    this._towers.push(new Tower(descr));
    this._towerSpots[y][x] = 1;
  }

},

generateAirTower : function(descr) {
  var x = Math.floor(descr.cx/40);
  var y =  Math.floor(descr.cy/40);
  descr.cx = x*40 + 20;
  descr.cy = y*40 + 20;
  descr.damage = 40;
  descr.splash = false;
  descr.land = false;
  descr.air = true;
  descr.radius = 80;
  // Skjóta 40 sinnum á mín
  descr.firerate = (60/40)*(1000/NOMINAL_UPDATE_INTERVAL);
  if(this._towerSpots[y][x] === 0){
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
    this._categories = [this._enemies,this._bullets, this._towers, this.gold, this.lives, this.level];
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
  console.log(this.beginningOfLevel, this.continue);
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
         removeGold(50);
       entityManager.generateArrowTower({
         cx : g_mouseX,
         cy : g_mouseY,
         sprite : g_sprites.arrowTower
       });
     }
       if(this.spriteOnMouse === g_sprites.airTower){
         removeGold(70);
       entityManager.generateAirTower({
         cx : g_mouseX,
         cy : g_mouseY,
         sprite : g_sprites.airTower
       });
     }
       if(this.spriteOnMouse === g_sprites.cannonTower){
        removeGold(100);
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
  if(tower === "arrow"){
    ctx.font= "bold 18px Georgia";
    ctx.fillStyle = 'black';
    ctx.fillText("Arrow Tower", 670, 23);
    ctx.font= "bold 16px Georgia";
    ctx.fillStyle = 'cyan';
    ctx.fillText("Damage: 10", 610, 40);
    ctx.fillText("Splash Damage: No", 610, 55);
    ctx.fillText("Land Attacks: Yes", 610, 70);
    ctx.fillText("Air Attacks: Yes", 610, 85);
    ctx.fillText("Radius: 80", 610, 100);
    ctx.fillText("firerate: 100", 610, 115);
  }
  if(tower === "air"){
    ctx.font= "bold 18px Georgia";
    ctx.fillStyle = 'black';
    ctx.fillText("Air Tower", 670, 23);
    ctx.font= "bold 16px Georgia";
    ctx.fillStyle = 'cyan';
    ctx.fillText("Damage: 40", 610, 40);
    ctx.fillText("Splash Damage: No", 610, 55);
    ctx.fillText("Land Attacks: No", 610, 70);
    ctx.fillText("Air Attacks: Yes", 610, 85);
    ctx.fillText("Radius: 80", 610, 100);
    ctx.fillText("firerate: 40", 610, 115);
  }
  if(tower === "cannon"){
    ctx.font= "bold 18px Georgia";
    ctx.fillStyle = 'black';
    ctx.fillText("Cannon Tower", 670, 23);
    ctx.font= "bold 16px Georgia";
    ctx.fillStyle = 'cyan';
    ctx.fillText("Damage: 60", 610, 40);
    ctx.fillText("Splash Damage: No", 610, 55);
    ctx.fillText("Land Attacks: Yes", 610, 70);
    ctx.fillText("Air Attacks: No", 610, 85);
    ctx.fillText("Radius: 120", 610, 100);
    ctx.fillText("firerate: 50", 610, 115);
  }
},

renderInfo: function(ctx){
  ctx.font= "16px Georgia";
  //Gold
  ctx.fillStyle = 'yellow';

  ctx.fillText("Gold: " + GOLD, 610, 20);
  //lives
  ctx.fillStyle = 'red';
  ctx.fillText("Lives: " + LIVES, 730, 20);
  //level
  ctx.fillStyle = 'cyan';
  ctx.fillText("Level: " + LEVEL, 610, 75);


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
    this.spriteOnMouse.drawCentredAt(ctx, g_mouseX, g_mouseY, 0);


      ctx.beginPath();
    if(this.spriteOnMouse === g_sprites.arrowTower)
      ctx.arc(g_mouseX,g_mouseY,80,0,2*Math.PI);
    if(this.spriteOnMouse === g_sprites.airTower)
      ctx.arc(g_mouseX,g_mouseY,80,0,2*Math.PI);
    if(this.spriteOnMouse === g_sprites.cannonTower)
      ctx.arc(g_mouseX,g_mouseY,120,0,2*Math.PI);
      ctx.stroke();
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
