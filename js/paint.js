"use strict";

(function(window)
{
function Paint()
{

}

Paint.init = function()
{
Brush.select( 1 );

var menu = document.querySelector( '#Menu' );

Color( menu );
Thickness( menu );

var clear = menu.querySelector( '#clearCanvas' );

clear.onclick = Paint.clearCanvas;

var save = menu.querySelector( '#saveCanvas' );

save.onclick = Paint.saveCanvas;


    // :: Undo / Redo :: //
    
var undo = menu.querySelector( '#undo' );

undo.onclick = function() { UndoRedo.stuff("undo"); };

var redo = menu.querySelector( '#redo' );

redo.onclick = function() { UndoRedo.stuff("redo"); };
};


/*
    Clears all elements from the canvas
 */

Paint.clearCanvas = function()
{
Brush.clear();
UndoRedo.clear();   //HERE dar para voltar ao estado actual, em vez de fazer reset
};


/*
    Opens a new tab with the image (so that you can just right-click on the image and save it to the computer)
 */

Paint.saveCanvas = function()
{
var image = CANVAS.toDataURL("image/png");

window.open( image, '_newtab' );
};



window.Paint = Paint;


}(window));