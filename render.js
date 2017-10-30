// GENERIC RENDERING

var g_frameCounter = 1;

function render(ctx) {

    util.clearCanvas(ctx);
    entityManager.render(ctx);
    ++g_frameCounter;
}
