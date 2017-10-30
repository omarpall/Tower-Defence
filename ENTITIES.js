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

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();

    entityManager.update(du);


}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;

var KEY_MIXED   = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');

var KEY_K = keyCode('K');

function processDiagnostics() {


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



}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
  background : "Textures/background.jpg"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.background = new Sprite(g_images.background);


    main.init();
}

// Kick it off
requestPreloads();
