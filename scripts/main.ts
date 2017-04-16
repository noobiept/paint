interface Point
    {
    x: number;
    y: number;
    }


interface BubblePoint extends Point
    {
    radius: number;
    opacity: number;
    }


interface Line
    {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    distanceX: number;
    distanceY: number;
    }


interface Settings
    {
    [id: string]: number | number[];
    }


interface BrushArgs {}
interface Brush
    {
    opacity_control: Control;
    all_controls: Control[];

    startDraw( event: MouseEvent ): void;
    duringDraw( event: MouseEvent ): void;
    endDraw( event: MouseEvent ): void;
    getSettings(): Settings;
    clear(): void;
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

var savedCanvas = Utilities.getObject( 'saved_canvas' );

if ( savedCanvas != true )
    {
    savedCanvas = false;
    }

Paint.init( savedCanvas );

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