(function(window)
{
function Brush()
{

}

var BRUSHES = [
        { name: 'line', classObject: LineBrush },
        { name: 'neighbor_points', classObject: NeighborPointsBrush }
    ];

var BRUSH_SELECTED = 0;
var BRUSH_OBJECT = null;


var IS_MOUSE_DOWN = false;


Brush.select = function( brushPosition )
{
BRUSH_SELECTED = brushPosition;

BRUSH_OBJECT = new BRUSHES[ brushPosition ].classObject();
};


Brush.startDraw = function( event )
{
IS_MOUSE_DOWN = true;

return BRUSH_OBJECT.startDraw( event );
};


Brush.duringDraw = function( event )
{
if ( IS_MOUSE_DOWN )
    {
    BRUSH_OBJECT.duringDraw( event );
    }
};


Brush.endDraw = function( event )
{
IS_MOUSE_DOWN = false;

return BRUSH_OBJECT.endDraw( event );
};



Brush.clear = function()
{
MAIN_CTX.clearRect( 0, 0, MAIN_CANVAS.width, MAIN_CANVAS.height );
};


window.Brush = Brush;

}(window));