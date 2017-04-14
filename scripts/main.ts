interface Point
    {
    x: number;
    y: number;
    radius: number;
    opacity: number;
    }


    // main canvas, will contain the drawing with all the shapes
var MAIN_CANVAS: HTMLCanvasElement;
var MAIN_CTX: CanvasRenderingContext2D;

    // draw canvas, used to show the line being drawn only
var DRAW_CANVAS: HTMLCanvasElement;
var DRAW_CTX: CanvasRenderingContext2D;


window.onload = function()
{
MAIN_CANVAS = <HTMLCanvasElement> document.querySelector( "#mainCanvas" );
MAIN_CTX = MAIN_CANVAS.getContext( '2d' )!;


DRAW_CANVAS = <HTMLCanvasElement> document.querySelector( '#drawCanvas' );
DRAW_CTX = DRAW_CANVAS.getContext( '2d' )!;


    // so that the cursor stays the default (instead of the text selection image)
MAIN_CANVAS.onselectstart = function() { return false; };

Color.init( SaveLoad.getRgb() );

var savedCanvas = localStorage.getObject( 'saved_canvas' );

if ( savedCanvas != true )
    {
    savedCanvas = false;
    }

Paint.init( savedCanvas );

document.body.onmousedown = Paint.startDraw;
document.body.onmousemove = Paint.duringDraw;
document.body.onmouseup = Paint.endDraw;


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

if ( savedCanvas )
    {
    SaveLoad.loadCanvasImage();
    }
};


window.onunload = function()
{
SaveLoad.save();
};