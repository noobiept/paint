


var createjs = window;


var CANVAS;
var STAGE;


var IS_MOUSE_DOWN = false;


var OLD_MID_X, OLD_MID_Y, OLD_X, OLD_Y;

var CURRENT_SHAPE;


var SHAPES_ARRAY = [];


window.onload = function()
{
CANVAS = document.querySelector("#mainCanvas");

STAGE = new Stage( CANVAS );

    //HERE onMouseDown funciona independentemente de qual a tecla do rato k foi pressionada
    // se calhar era melhor distinguir entre left e right click, para ter funcionalidade diferente?..
STAGE.onMouseDown = mouseDownEvents;    
STAGE.onMouseUp = mouseUpEvents;

Ticker.addListener( window );

STAGE.update();

Color.init();
Thickness.init();

var clear = document.querySelector( '#clearCanvas' );

clear.onclick = function() { clearCanvas(); };


var save = document.querySelector( '#saveCanvas' );

save.onclick = function() { saveCanvas(); };
};




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



function tick()
{
if ( IS_MOUSE_DOWN )
    {
    var point = new Point( STAGE.mouseX, STAGE.mouseY );
    
    var midPointX = Math.floor( (OLD_X + point.x) / 2 );
    var midPointY = Math.floor( (OLD_Y + point.y) / 2 );
    
    
    CURRENT_SHAPE.graphics.moveTo( midPointX, midPointY );
    CURRENT_SHAPE.graphics.curveTo( OLD_X, OLD_Y, OLD_MID_X, OLD_MID_Y );
    
    OLD_X = point.x;
    OLD_Y = point.y;
    
    OLD_MID_X = midPointX;
    OLD_MID_Y = midPointY;
    
    STAGE.update();
    }
}