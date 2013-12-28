"use strict";

(function(window)
{
function Paint()
{

}

var BRUSHES = [
        {
            Class: LineBrush,
            previousValues: {}
        },
        {
            Class: NeighborPointsBrush,
            previousValues: {}
        },
        {
            Class: BubblesBrush,
            previousValues: {}
        },
        {
            Class: LinePatternBrush,
            previousValues: {}
        },
        {
            Class: SprayBrush,
            previousValues: {}
        }
    ];

var BRUSH_SELECTED = 0;
var BRUSH_OBJECT = null;

var IS_MOUSE_DOWN = false;


Paint.init = function()
{
var menu = document.querySelector( '#Menu' );


var clear = menu.querySelector( '#clearCanvas' );
var save = menu.querySelector( '#saveCanvas' );

clear.onclick = Paint.clearCanvas;
save.onclick = Paint.saveCanvas;


    // :: Brushes menu :: //

var brushesContainer = menu.querySelector( '#BrushesContainer' );

var brushes = brushesContainer.querySelectorAll( '.button' );

var selected = brushes[ 0 ];


var selectBrushFunction = function( position, htmlElement )
    {
        // this has a function within, to create a closure, so that the arguments are retained (otherwise in the loop below it wouldn't work, all would get the last value of 'a')
    return function()
        {
        $( selected ).removeClass( 'selected' );
        $( htmlElement ).addClass( 'selected' );

        selected = htmlElement;

        Paint.selectBrush( position );
        };
    };


for (var a = 0 ; a < brushes.length ; a++)
    {
    brushes[ a ].onclick = selectBrushFunction( a, brushes[ a ] );
    }

    // start the program with the first brush selected
selectBrushFunction( 0, selected )();


Paint.updateCurrentColor();
};



Paint.startDraw = function( event )
{
IS_MOUSE_DOWN = true;

event.preventDefault();

return BRUSH_OBJECT.startDraw( event );
};


Paint.duringDraw = function( event )
{
if ( IS_MOUSE_DOWN )
    {
    event.preventDefault();

    BRUSH_OBJECT.duringDraw( event );
    }
};


Paint.endDraw = function( event )
{
IS_MOUSE_DOWN = false;

event.preventDefault();

return BRUSH_OBJECT.endDraw( event );
};


Paint.selectBrush = function( brushPosition )
{
    // deal the previous brush (clear it, and save the values that were set for next time this brush is selected)
if ( BRUSH_OBJECT )
    {
    var current = BRUSHES[ BRUSH_SELECTED ];

    current.previousValues = BRUSH_OBJECT.getSettings();

    BRUSH_OBJECT.clear();
    }


var next = BRUSHES[ brushPosition ];

BRUSH_SELECTED = brushPosition;
BRUSH_OBJECT = new next.Class( next.previousValues );

Paint.updateCurrentColor();
};



Paint.updateCurrentColor = function()
{
var currentColor = document.querySelector( '#currentColor span' );

var color = Color.getValues();

var opacity = BRUSH_OBJECT.opacity_control.getValue();

    // means its a range (min/max value), so get the max value
if ( opacity instanceof Array )
    {
    opacity = opacity[ 1 ];
    }

var colorCss = toCssColor( color.red, color.green, color.blue, opacity );

$( currentColor ).css( 'background-color', colorCss );
};



/*
    Clears all elements from the canvas
 */

Paint.clearCanvas = function()
{
MAIN_CTX.clearRect( 0, 0, MAIN_CANVAS.width, MAIN_CANVAS.height );
};


/*
    Opens a new tab with the image (so that you can just right-click on the image and save it to the computer)
 */

Paint.saveCanvas = function()
{
var image = MAIN_CANVAS.toDataURL("image/png");

window.open( image, '_newtab' );
};



window.Paint = Paint;


}(window));