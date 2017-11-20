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
isTowerSelected : false,
towerSelected : null,
hoverOverLeftUpgradeBox : false,
hoverOverRightUpgradeBox : false,


arrowTowerStats : {
  damage : 10,
  splash : false,
  land : true,
  air : true,
  radius : 100,
  firerate : 160,
  cost : 50,
  upgradeCost: 10
},

airTowerStats : {
  type : "Air Tower",
  damage : 40,
  splash : false,
  land : false,
  air : true,
  radius : 80,
  firerate : 150,
  cost : 70,
  upgradeCost : 15
},

cannonTowerStats : {
  type : "Cannon Tower",
  damage : 30,
  splash : true,
  land : true,
  air : false,
  radius : 60,
  firerate : 50,
  cost : 100,
  upgradeCost: 20
},

// "PRIVATE" METHODS

generateEnemies : function(descr) {
  for (var i = 0; i < descr.num; i++) {
    descr.cy -= descr.space;
    this._enemies.push(new Enemy(descr));
  }
},




//Generates a tower at mouse location if spot is legal and available
generateArrowTower : function(descr) {
  var x = Math.floor(descr.cx/40);
  var y =  Math.floor(descr.cy/40);
  descr.cx = x*40 + 20;
  descr.cy = y*40 + 20;
  descr.type = this.arrowTowerStats.type;
  descr.cost = this.arrowTowerStats.cost;
  descr.damage = this.arrowTowerStats.damage;
  descr.splash = this.arrowTowerStats.splash;
  descr.land = true;
  descr.air = true;
  descr.radius = this.arrowTowerStats.radius;
  descr.firerate = this.arrowTowerStats.firerate;
  descr.upgradeCost = this.arrowTowerStats.upgradeCost;
  if(this._towerSpots[y][x] === 0 && GOLD >= 25) {
    removeGold(25);
    this._towers.push(new Tower(descr));
    this._towerSpots[y][x] = 1;
  }
},




generateAirTower : function(descr) {
  var x = Math.floor(descr.cx/40);
  var y =  Math.floor(descr.cy/40);
  descr.cx = x*40 + 20;
  descr.cy = y*40 + 20;
  descr.type = this.airTowerStats.type;
  descr.cost = this.airTowerStats.cost;
  descr.damage = this.airTowerStats.damage;
  descr.splash = this.airTowerStats.splash;
  descr.land = false;
  descr.air = true;
  descr.radius = this.airTowerStats.radius;
  descr.firerate = this.airTowerStats.firerate;
  descr.upgradeCost = this.airTowerStats.upgradeCost;
  if(this._towerSpots[y][x] === 0 && GOLD >= 50){
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
  descr.type = this.cannonTowerStats.type;
  descr.cost = this.cannonTowerStats.cost;
  descr.damage = this.cannonTowerStats.damage;
  descr.splash = this.cannonTowerStats.splash;
  descr.land = true;
  descr.air = false;
  descr.radius = this.cannonTowerStats.radius;
  descr.firerate = this.cannonTowerStats.firerate;
  descr.upgradeCost = this.cannonTowerStats.upgradeCost;
  if(this._towerSpots[y][x] === 0 && GOLD >= 100){
    removeGold(100);
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


  generateTower: function(sprite){
    if(sprite === g_sprites.arrowTower){
    entityManager.generateArrowTower({
      cx : g_mouseX,
      cy : g_mouseY,
      sprite : g_sprites.arrowTower
    });
  }
    if(sprite === g_sprites.airTower){
    entityManager.generateAirTower({
      cx : g_mouseX,
      cy : g_mouseY,
      sprite : g_sprites.airTower
    });
  }
    if(sprite === g_sprites.cannonTower){
    entityManager.generateCannonTower({
      cx : g_mouseX,
      cy : g_mouseY,
      sprite : g_sprites.cannonTower
    });
  }
   mouseDown = false;
   this.isSpriteOnMouse = false;
 },

 selectTower: function(yIndex, xIndex){
   var x = xIndex*40+20;
   var y = yIndex*40+20;
   for(var i = 0; i < this._towers.length; i++){
     if(this._towers[i].cx === x && this._towers[i].cy === y){
        return this._towers[i];
      }
   }
   return null;
 },

 upgradeTower: function(upgrade){

   if(upgrade === "damage")
      this.towerSelected.damage = Math.floor(this.towerSelected.damage*1.2);
   else if(upgrade === "radius")
      this.towerSelected.radius = Math.floor(this.towerSelected.radius*1.2);
   else if(upgrade === "firerate")
      this.towerSelected.firerate = Math.floor(this.towerSelected.firerate*1.2);
   removeGold(this.towerSelected.upgradeCost);
   this.towerSelected.upgradeCost = Math.floor(this.towerSelected.upgradeCost*1.5);
   mouseDown = false;
 },

 isWithinRectangle: function(x, y, rectangleX, rectangleY, width, height){
     if(x <= rectangleX + width && x >= rectangleX && y <= rectangleY + height && y >= rectangleY)
      return true;
     else{
       return false;
     }
 },

beginningOfLevel : true,

KEY_CONTINUE : ' '.charCodeAt(0),
continue : true,

update: function(du) {
  if (eatKey(this.KEY_CONTINUE)) this.continue = true;
  //console.log(this.beginningOfLevel, this.continue);
  if(this.beginningOfLevel && this.continue) {

    LEVEL++;
    if(LEVEL === 1){
      this.generateEnemies({
        cy : 0,
        lives: 100,
        sprite : g_sprites.enemy1,
        num : 5,
        SPEED : 1,
        space : 30,
        type : 'ground'
      });
    }
    if(LEVEL === 2){
      this.generateEnemies({
        cy : 0,
        lives: 100,
        sprite : g_sprites.enemy1,
        num : 10,
        SPEED : 1,
        space : 22,
        type : 'ground'
      });
    }
    if(LEVEL === 3){
      this.generateEnemies({
        cy : 0,
        lives: 80,
        sprite : g_sprites.enemy2,
        num : 5,
        SPEED : 2,
        space : 10,
        type : 'flight'
      });
    }
    if(LEVEL === 4){
      this.generateEnemies({
        cy : 0,
        lives: 150,
        sprite : g_sprites.enemy3,
        num : 5,
        SPEED : 0.7,
        space : 40,
        type : 'ground'
      });
    }
    if(LEVEL === 5){
      this.generateEnemies({
        cy : 0,
        lives: 80,
        sprite : g_sprites.enemy2,
        num : 10,
        SPEED : 2,
        space : 10,
        type : 'flight'
      });
    }
    if(LEVEL === 6){
      this.generateEnemies({
        cy : 0,
        lives: 100,
        sprite : g_sprites.enemy1,
        num : 20,
        SPEED : 1,
        space : 20,
        type : 'ground'
      });
    }
    if(LEVEL === 7){
      this.generateEnemies({
        cy : 0,
        lives: 100,
        sprite : g_sprites.enemy1,
        num : 25,
        SPEED : 1,
        space : 10,
        type : 'ground'
      });
    }
    if(LEVEL === 8){
      this.generateEnemies({
        cy : 0,
        lives: 80,
        sprite : g_sprites.enemy2,
        num : 20,
        SPEED : 2,
        space : 8,
        type : 'flight'
      });
    }
    if(LEVEL === 9){
      this.generateEnemies({
        cy : 0,
        lives: 150,
        sprite : g_sprites.enemy3,
        num : 20,
        SPEED : 0.7,
        space : 10,
        type : 'ground'
      });
    }
    if(LEVEL === 10){
      this.generateEnemies({
        cy : 0,
        lives: 150,
        sprite : g_sprites.enemy3,
        num : 30,
        SPEED : 0.7,
        space : 8,
        type : 'ground'
      });
    }
      this.beginningOfLevel = false;
  }

   var x = g_mouseX;
   var y = g_mouseY;
   var radius = 38/2;
   if(this.isWithinRectangle(x, y, 612, 132, 38, 38)){
     this.arrowIconSelected = true;
     if(mouseDown && GOLD >= 50){
       this.spriteOnMouse = g_sprites.arrowTower;
       this.isSpriteOnMouse = true;
       mouseDown = false;
     }

   }
   else if(this.isWithinRectangle(x, y, 661, 132, 38, 38)){
     this.airIconSelected = true;
     if(mouseDown && GOLD >= 70){
       this.spriteOnMouse = g_sprites.airTower;
       this.isSpriteOnMouse = true;
       mouseDown = false;
     }
   }
   else if(this.isWithinRectangle(x, y, 711, 132, 38, 38)){
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


  if(this.isSpriteOnMouse && mouseDown){
    this.generateTower(this.spriteOnMouse);
  }


  else if(this.isTowerSelected){
      //Left box
      if(this.isWithinRectangle(x, y, this.towerSelected.cx - 50, this.towerSelected.cy - 70, 49, 50)){
        this.hoverOverLeftUpgradeBox = true;
        this.hoverOverRightUpgradeBox = false;
        if(mouseDown && GOLD > this.towerSelected.upgradeCost){
          if(this.towerSelected.type === "Arrow Tower" || this.towerSelected.type === "Cannon Tower")
            this.upgradeTower("damage");
          else if(this.towerSelected.type === "Air Tower")
            this.upgradeTower("radius");
        }
      }
      //Right box
      else if(this.isWithinRectangle(x, y, this.towerSelected.cx + 1, this.towerSelected.cy - 70, 49, 50)){
        this.hoverOverRightUpgradeBox = true;
        this.hoverOverLeftUpgradeBox = false;
        if(mouseDown && GOLD > this.towerSelected.upgradeCost){
          if(this.towerSelected.type === "Arrow Tower" || this.towerSelected.type === "Air Tower")
            this.upgradeTower("firerate");
          else if(this.towerSelected.type === "Cannon Tower")
            this.upgradeTower("radius");
        }
      }
      //Clicked outside of boxes
      else{
        this.hoverOverLeftUpgradeBox = false;
        this.hoverOverRightUpgradeBox = false;
        if(mouseDown)
          this.isTowerSelected = false;
      }

  }


  else if(mouseDown && x <= g_canvas.width - 250 && y <= g_canvas.height){
    var xIndex = Math.floor(x/40);
    var yIndex =  Math.floor(y/40);
    if(this._towerSpots[yIndex][xIndex] === 1){
      this.isTowerSelected = true;
      this.towerSelected = this.selectTower(yIndex, xIndex);
        mouseDown = false;
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

//Print stats of tower when hovered over
renderTowerStats: function(ctx, tower){
  var towerstats;
  ctx.font= "bold 18px Georgia";
  ctx.fillStyle = 'black';
  if(tower === "towerSelected"){
    ctx.fillText(this.towerSelected.type, 660, 23);
    towerstats = this.towerSelected;
    if(towerstats.upgradeCost > GOLD)
     ctx.fillStyle = 'red';
    else{
      ctx.fillStyle = 'green';
    }
  }
  if(tower === "arrow"){
    ctx.fillText("Arrow Tower", 667, 23);
    towerstats = this.arrowTowerStats;
    if(towerstats.cost > GOLD)
     ctx.fillStyle = 'red';
    else{
      ctx.fillStyle = 'green';
    }
  }
  else if(tower === "air"){
    ctx.fillText("Air Tower", 677, 23);
    towerstats = this.airTowerStats;
    if(towerstats.cost > GOLD)
     ctx.fillStyle = 'red';
    else{
      ctx.fillStyle = 'green';
    }
  }
  else if(tower === "cannon"){
    ctx.fillText("Cannon Tower", 660, 23);
    towerstats = this.cannonTowerStats;
    if(towerstats.cost > GOLD)
     ctx.fillStyle = 'red';
    else{
      ctx.fillStyle = 'green';
    }
  }

  ctx.font= "bold 14px Georgia";
  if(tower === "towerSelected")
  ctx.fillText("Cost: " + towerstats.upgradeCost, 610, 35);
  else{
    ctx.fillText("Cost: " + towerstats.cost, 610, 35);
  }
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

renderUpgradeOptions: function(ctx, option1, option2, name1, name2){
  ctx.fillText("" + name1, this.towerSelected.cx - 46, this.towerSelected.cy - 45);
  ctx.fillText("" + name2, this.towerSelected.cx + 5, this.towerSelected.cy - 45);
  ctx.font = "bold 12px Georgia";
  ctx.fillStyle = "#66ff33";
  ctx.fillText("+" + Math.floor(option1*0.2), this.towerSelected.cx - 35, this.towerSelected.cy - 30);
  ctx.fillText("+" + Math.floor(option2*0.2), this.towerSelected.cx + 10, this.towerSelected.cy - 30);
},

renderTowerUpgrade: function(ctx){
  //Draw box
  ctx.fillStyle = "grey";
  ctx.fillRect(this.towerSelected.cx - 50, this.towerSelected.cy - 70, 100, 50);
  ctx.strokeStyle = "black";
  ctx.strokeRect(this.towerSelected.cx - 50, this.towerSelected.cy - 70, 100, 50);
  ctx.moveTo(this.towerSelected.cx, this.towerSelected.cy - 70);
  ctx.lineTo(this.towerSelected.cx, this.towerSelected.cy - 20);
  ctx.stroke();
  //Draw upgrade options
  ctx.font = "bold 9.5px Georgia";
  ctx.fillStyle = "yellow";
  ctx.fillText("Upgrade", this.towerSelected.cx - 47, this.towerSelected.cy - 58);
  ctx.fillText("Upgrade", this.towerSelected.cx + 3, this.towerSelected.cy - 58);
  if(this.towerSelected.type === "Arrow Tower"){
    this.renderUpgradeOptions(ctx, this.towerSelected.damage, this.towerSelected.firerate, "damage", "firerate");
  }
  else if(this.towerSelected.type === "Air Tower"){
    this.renderUpgradeOptions(ctx, this.towerSelected.radius, this.towerSelected.firerate, "radius", "firerate");
  }
  else if(this.towerSelected.type === "Cannon Tower"){
    this.renderUpgradeOptions(ctx, this.towerSelected.damage, this.towerSelected.radius, "damage", "radius");
  }
},

renderSpriteOnMouse: function(ctx){
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
},

render: function(ctx) {
  g_sprites.background.drawAt(ctx, 0, 0);


  //Towers and enemies
  for (var c = 0; c < this._categories.length; ++c) {
      var aCategory = this._categories[c];
      for (var i = 0; i < aCategory.length; ++i) {
         aCategory[i].render(ctx);
      }
  }
  //Interface
    if(this.arrowIconSelected){
      this.renderTowerStats(ctx, "arrow");
    }
    else if(this.airIconSelected){
      this.renderTowerStats(ctx, "air");
    }
    else if(this.cannonIconSelected){
      this.renderTowerStats(ctx, "cannon");
    }



  //Upgrade menu
  else if(this.isTowerSelected){
      this.renderTowerUpgrade(ctx);
      if(this.hoverOverLeftUpgradeBox){
        this.renderTowerStats(ctx, "towerSelected");
      }
      else if(this.hoverOverRightUpgradeBox){
        this.renderTowerStats(ctx, "towerSelected");
      }
      else{
          this.renderInfo(ctx);
      }
    }

    else{
      this.renderInfo(ctx);
    }



  //Icons
  g_sprites.iconTowerArrow.drawCentredAt (ctx, 630, 150, 0);
  g_sprites.iconTowerAir.drawCentredAt (ctx, 680, 150, 0);
  g_sprites.iconTowerCannon.drawCentredAt (ctx, 730, 150, 0);



  //Sprite following mouse
  if(this.isSpriteOnMouse){
    this.renderSpriteOnMouse(ctx);
  }


}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

entityManager.init();
