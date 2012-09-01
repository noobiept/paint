/*global Stage, Ticker, Color, Thickness*/
/*jslint vars: true, white: true*/

"use strict";

(function(window)
{
var CANVAS;
var STAGE;


var CONTAINER;


var IS_MOUSE_DOWN = false;


var OLD_MID_X, OLD_MID_Y, OLD_X, OLD_Y;

var CURRENT_SHAPE;


var SHAPES_ARRAY = [];

var BACKGROUND_ELEMENT = null;

/*
    Arguments:
        
        canvas    : the html <canvas> element
        container : the html element, parent of the canvas and the controls
        backgroundElement : if provided, we make the background not selectable
 */

function Paint( canvas, container, backgroundElement )
{
CANVAS = canvas;
CONTAINER = container;

    // so that the cursor stays the default (instead of the text selection image)
canvas.onselectstart = function() { return false; };
  

STAGE = new Stage( CANVAS );

    //HERE onMouseDown funciona independentemente de qual a tecla do rato k foi pressionada
    // se calhar era melhor distinguir entre left e right click, para ter funcionalidade diferente?..
STAGE.onMouseDown = mouseDownEvents;    
STAGE.onMouseUp = mouseUpEvents;

Ticker.addListener( Paint );

STAGE.update();

Color( container );
Thickness( container );

var clear = container.querySelector( '#clearCanvas' );

clear.onclick = clearCanvas;


var save = container.querySelector( '#saveCanvas' );

save.onclick = saveCanvas;

var remove = container.querySelector( '#removeCanvas' );

remove.onclick = removeCanvas;


    // :: Undo / Redo :: //
    
var undo = container.querySelector( '#Paint-undo' );

undo.onclick = function() { UndoRedo.stuff("undo"); };

var redo = container.querySelector( '#Paint-redo' );

redo.onclick = function() { UndoRedo.stuff("redo"); };


    
if (typeof backgroundElement != 'undefined')
    {
    $( backgroundElement ).addClass('backgroundUnselectable');
    
    BACKGROUND_ELEMENT = backgroundElement;
    }
}




function mouseDownEvents( event )
{
IS_MOUSE_DOWN = true;

var shape = new Shape();

OLD_X = STAGE.mouseX;
OLD_Y = STAGE.mouseY;

OLD_MID_X = STAGE.mouseX;
OLD_MID_Y = STAGE.mouseY;

var g = shape.graphics;

var thickness = Thickness.getValue();

    /* 
        arguments:
        
            thickness: width of the stroke
            caps: type of caps at the end of the line (butt, round, square)
            joints: type of joints when two lines meet (bevel, round, miter)
            miter: if joints is set to miter, choose a miter limit ratio
     */
g.setStrokeStyle( thickness + 1, 'round', 'round' );

var color = Color.toString();

g.beginStroke( color );

STAGE.addChild( shape );

CURRENT_SHAPE = shape;

SHAPES_ARRAY.push( shape );

UndoRedo.addStroke( shape );
}



function mouseUpEvents( event )
{
IS_MOUSE_DOWN = false;
}


function clearCanvas()
{
STAGE.removeAllChildren();

SHAPES_ARRAY.length = 0;

STAGE.update();
}



function saveCanvas()
{
var image = CANVAS.toDataURL("image/png");

window.open(image, '_newtab');
}


/*
    Removes the <canvas> element and the controls from the page
 */

function removeCanvas()
{
CONTAINER.removeChild( CANVAS );

var controls = CONTAINER.querySelector( '#paintControls' );
CONTAINER.removeChild( controls );

if ( BACKGROUND_ELEMENT !== null )
    {
    $( BACKGROUND_ELEMENT ).removeClass('backgroundUnselectable');
    }
}





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



Paint.tick = function()
{
if ( IS_MOUSE_DOWN )
    {
    var mouseX = STAGE.mouseX;
    var mouseY = STAGE.mouseY;
    
    var midPointX = Math.floor( (OLD_X + mouseX) / 2 );
    var midPointY = Math.floor( (OLD_Y + mouseY) / 2 );
    
    
    CURRENT_SHAPE.graphics.moveTo( midPointX, midPointY );
    CURRENT_SHAPE.graphics.curveTo( OLD_X, OLD_Y, OLD_MID_X, OLD_MID_Y );
    
    OLD_X = mouseX;
    OLD_Y = mouseY;
    
    OLD_MID_X = midPointX;
    OLD_MID_Y = midPointY;
    }
    
STAGE.update();
};



window.Paint = Paint;


}(window));