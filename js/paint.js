"use strict";

(function(window)
{
function Paint()
{

}

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

        Brush.select( position );
        };
    };


for (var a = 0 ; a < brushes.length ; a++)
    {
    brushes[ a ].onclick = selectBrushFunction( a, brushes[ a ] );
    }

    // start the program with the first brush selected
selectBrushFunction( 0, selected )();


    // :: Undo / Redo :: //
    
var undo = menu.querySelector( '#undo' );

undo.onclick = function() { UndoRedo.stuff("undo"); };

var redo = menu.querySelector( '#redo' );

redo.onclick = function() { UndoRedo.stuff("redo"); };


Paint.updateCurrentColor();
};



Paint.updateCurrentColor = function()
{
var currentColor = document.querySelector( '#currentColor span' );

var color = Color.getValues();

var opacity = Brush.getSelected().opacity_control.getValue();

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
Brush.clear();
UndoRedo.clear();   //HERE dar para voltar ao estado actual, em vez de fazer reset
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