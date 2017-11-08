// ========
// ENTITIES
// ========
/*

Controllable entities of various kinds.

Many of...


INSTRUCTIONS:

You need to flesh out the "Bullet.js" and "Rock.js" files,
and update the "entityManager.js" module to manage them.

I've updated "Ship.js" so that it knows how to request bullet
creation, so you don't have to worry about that side of it,
but you will have to implement the `fireBullet` function in
the entityManager.

I've also implemented all the necessary new keys e.g. "1" to
generate a new ship, "K" to kill one, "0" to toggle rendering
of the rocks.

"handleMouse.js" has been modified so that it calls a new
function called `entityManager.yoinkNearestShip`, which you'll
have to implement -- it finds the nearest ship (if any) and
pulls it towards the specified xy coords.
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/





// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================



// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();

    entityManager.update(du);


}


var g_renderSpatialDebug = false;


var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');
var KEY_3 = keyCode('3');

var KEY_K = keyCode('K');
var KEY_SPATIAL = keyCode('X');

function processDiagnostics() {

if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;


  if (eatKey(KEY_1)) entityManager.generateArrowTower({
    cx : g_mouseX,
    cy : g_mouseY,
    fireRate : 10,
    sprite : g_sprites.arrowTower
  });

  if (eatKey(KEY_2)) entityManager.generateCannonTower({
    cx : g_mouseX,
    cy : g_mouseY,

    sprite : g_sprites.cannonTower
  });

  if (eatKey(KEY_3)) entityManager.generateAirTower({
    cx : g_mouseX,
    cy : g_mouseY,

    sprite : g_sprites.airTower
  });

  if (eatKey(KEY_K)) {

  }

}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

  entityManager.render(ctx);
  if (g_renderSpatialDebug) spatialManager.render(ctx);


}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
      airTower : "Textures/towerAir.png",
      arrowTower : "Textures/towerArrow.png",
      cannonTower : "Textures/towerCannon.png",
      enemy1 : "Textures/enemy1.png",
      background : "Textures/background.jpg",
      iconTowerAir : "Textures/iconTowerAir.png",
      iconTowerArrow : "Textures/iconTowerArrow.png",
      iconTowerCannon : "Textures/iconTowerCannon.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {



  g_sprites.airTower  = new Sprite(g_images.airTower);
  g_sprites.arrowTower = new Sprite(g_images.arrowTower);
  g_sprites.cannonTower = new Sprite(g_images.cannonTower);
  g_sprites.enemy1 = new Sprite(g_images.enemy1);
  g_sprites.background = new Sprite(g_images.background);
  g_sprites.iconTowerAir = new Sprite(g_images.iconTowerAir);
  g_sprites.iconTowerArrow = new Sprite(g_images.iconTowerArrow);
  g_sprites.iconTowerCannon = new Sprite(g_images.iconTowerCannon);
    main.init();
}

// Kick it off
requestPreloads();
