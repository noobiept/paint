/*global Stage, Ticker, Color, Thickness*/
/*jslint vars: true, white: true*/

"use strict";

(function(window)
{
var IS_MOUSE_DOWN = false;



var SHAPES_ARRAY = [];


function Paint()
{

}

Paint.init = function()
{
Brush.select( 0 );

var controls = document.querySelector( '#paintControls' );

Color( controls );
Thickness( controls );

var clear = controls.querySelector( '#clearCanvas' );

clear.onclick = Paint.clearCanvas;

var save = controls.querySelector( '#saveCanvas' );

save.onclick = Paint.saveCanvas;


    // :: Undo / Redo :: //
    
var undo = controls.querySelector( '#Paint-undo' );

undo.onclick = function() { UndoRedo.stuff("undo"); };

var redo = controls.querySelector( '#Paint-redo' );

redo.onclick = function() { UndoRedo.stuff("redo"); };
};


/*
    Clears all elements from the canvas
 */

Paint.clearCanvas = function()
{
STAGE.removeAllChildren();

SHAPES_ARRAY.length = 0;

UndoRedo.clear();   //HERE dar para voltar ao estado actual, em vez de fazer reset

STAGE.update();
};


/*
    Opens a new tab with the image (so that you can just right-click on the image and save it to the computer)
 */

Paint.saveCanvas = function()
{
var image = CANVAS.toDataURL("image/png");

window.open( image, '_newtab' );
};



/*  
    Removes the shape from the canvas
 */

Paint.removeShape = function( shapeObject )
{
var position = SHAPES_ARRAY.indexOf( shapeObject );

SHAPES_ARRAY.splice( position, 1 );

STAGE.removeChild( shapeObject );
};



/*
    Adds an existing Shape() object to the canvas
 */

Paint.addShape = function( shapeObject )
{
SHAPES_ARRAY.push( shapeObject );

STAGE.addChild( shapeObject );
};



Paint.mouseDownEvents = function( event )
{
IS_MOUSE_DOWN = true;

Brush.startDraw();
};



Paint.mouseUpEvents = function( event )
{
IS_MOUSE_DOWN = false;
};


Paint.tick = function()
{
if ( IS_MOUSE_DOWN )
    {
    Brush.duringDraw();
    }
    
STAGE.update();
};



window.Paint = Paint;


}(window));