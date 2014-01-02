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
SaveLoad.loadBrushesValues( BRUSHES );

var menu = document.querySelector( '#Menu' );


var clear = menu.querySelector( '#clearCanvas' );
var save = menu.querySelector( '#saveCanvas' );

clear.onclick = Paint.clearCanvas;
save.onclick = Paint.saveCanvas;


    // :: Brushes menu :: //

var brushesContainer = menu.querySelector( '#BrushesContainer' );

var brushes = brushesContainer.querySelectorAll( '.button' );

    // start with the previously selected brush, or with the first brush (if fresh start)
var position = SaveLoad.getSelectedBrush();

var selected = brushes[ position ];


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

selectBrushFunction( position, selected )();

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
var colorContainer = document.querySelector( '#ColorPicker' );

    // get the elements to change the background color
var sliderHandles = colorContainer.querySelectorAll( '.ui-slider-handle' );
var sliderRanges = colorContainer.querySelectorAll( '.ui-slider-range' );

    // convert from nodelist to array
var handlesArray = Array.prototype.slice.call( sliderHandles );
var rangesArray = Array.prototype.slice.call( sliderRanges );

    // merge the 2 arrays
var elements = handlesArray.concat( rangesArray );

    // get the color
var color = Color.getValues();

var opacity = BRUSH_OBJECT.opacity_control.getValue();

    // means its a range (min/max value), so get the max value
if ( opacity instanceof Array )
    {
    opacity = opacity[ 1 ];
    }

var colorCss = toCssColor( color.red, color.green, color.blue, opacity );

    // change the background color
for (var a = 0 ; a < elements.length ; a++)
    {
    $( elements[ a ] ).css( 'background', colorCss );
    }
};


Paint.getBrushesValues = function()
{
    // update the .previousValues of the current selected brush (since we only update when switching between brushes)
if ( BRUSH_OBJECT )
    {
    BRUSHES[ BRUSH_SELECTED ].previousValues = BRUSH_OBJECT.getSettings();
    }


var values = [];

for (var a = 0 ; a < BRUSHES.length ; a++)
    {
    values.push({
            previousValues: BRUSHES[ a ].previousValues
        });
    }

return values;
};


Paint.getSelectedBrush = function()
{
return BRUSH_SELECTED;
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