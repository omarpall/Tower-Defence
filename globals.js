// =======
// GLOBALS
// =======
/*

Evil, ugly (but "necessary") globals, which everyone can use.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Multiply by this to convert seconds into "nominals"
var SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;

var GOLD = 200;

var LIVES = 10;

var LEVEL = 0;

var text = "Lets start the first round! Drag some ";
var text2 = "towers to the field to kill the enemies";
var buttonSelect = false;

function addGold(amount){
  GOLD += amount;
}
function removeGold(amount){
  GOLD -= amount;
}
