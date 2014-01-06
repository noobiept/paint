/*
    Libraries required:
    
        jquery          - 2.0
        jqueryui        - 1.10
            slider
            start theme
            
        createjs
            easeljs     - 0.7
 */
 
 /*
    to doo:
    
        - pattern, draw a full canvas (same width/height as main canvas), to be able to have all the angles

        - undo/redo, have separate canvas, where you draw to there instead of the main one, so that when you want to undo, you simply clear one of those canvas (so we'll have a limit to how many undos we can do)

        - when changing the color in the menu, and using the spray brush, it draws on the canvas (if the radius is big enough)
  */

    // main canvas, will contain the drawing with all the shapes
var MAIN_CANVAS;
var MAIN_CTX;

    // draw canvas, used to show the line being drawn only
var DRAW_CANVAS;
var DRAW_CTX;




window.onload = function()
{
MAIN_CANVAS = document.querySelector( "#mainCanvas" );
MAIN_CTX = MAIN_CANVAS.getContext( '2d' );


DRAW_CANVAS = document.querySelector( '#drawCanvas' );
DRAW_CTX = DRAW_CANVAS.getContext( '2d' );


    // so that the cursor stays the default (instead of the text selection image)
MAIN_CANVAS.onselectstart = function() { return false; };

Color.init( SaveLoad.getRgb() );

var savedCanvas = localStorage.getObject( 'saved_canvas' );

if ( savedCanvas != true )
    {
    savedCanvas = false;
    }

Paint.init( savedCanvas );

        //HERE onMouseDown funciona independentemente de qual a tecla do rato k foi pressionada
    // se calhar era melhor distinguir entre left e right click, para ter funcionalidade diferente?..
document.body.onmousedown = Paint.startDraw;
document.body.onmousemove = Paint.duringDraw;
document.body.onmouseup = Paint.endDraw;


if ( savedCanvas )
    {
    SaveLoad.loadCanvasImage();
    }

else
    {
        // set the dimensions of the canvas, to fill the available space in the window
    var menuHeight = $( '#Menu' ).outerHeight();
    var windowWidth = $( window ).outerWidth();
    var windowHeight = $( window ).outerHeight();

    var canvasWidth = windowWidth;
    var canvasHeight = windowHeight - menuHeight;

    MAIN_CANVAS.width = canvasWidth;
    MAIN_CANVAS.height = canvasHeight;

    DRAW_CANVAS.width = canvasWidth;
    DRAW_CANVAS.height = canvasHeight;
    }
};



window.onunload = function()
{
SaveLoad.save();
};