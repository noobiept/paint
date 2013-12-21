(function(window)
{
function Brush()
{

}

var BRUSHES = [
        { name: 'line', classObject: LineBrush },
        { name: 'neighbor_points', classObject: NeighborPointsBrush },
        { name: 'bubbles', classObject: BubblesBrush },
        { name: 'line_pattern', classObject: LinePatternBrush },
        { name: 'spray', classObject: SprayBrush }
    ];

var BRUSH_SELECTED = 0;
var BRUSH_OBJECT = null;


var IS_MOUSE_DOWN = false;


Brush.select = function( brushPosition )
{
BRUSH_SELECTED = brushPosition;

if ( BRUSH_OBJECT )
    {
    BRUSH_OBJECT.clear();
    }

BRUSH_OBJECT = new BRUSHES[ brushPosition ].classObject();

Paint.updateCurrentColor();
};


Brush.startDraw = function( event )
{
IS_MOUSE_DOWN = true;

event.preventDefault();

return BRUSH_OBJECT.startDraw( event );
};


Brush.duringDraw = function( event )
{
if ( IS_MOUSE_DOWN )
    {
    event.preventDefault();

    BRUSH_OBJECT.duringDraw( event );
    }
};


Brush.endDraw = function( event )
{
IS_MOUSE_DOWN = false;

event.preventDefault();

return BRUSH_OBJECT.endDraw( event );
};


Brush.getSelected = function()
{
return BRUSH_OBJECT;
};


Brush.clear = function()
{
MAIN_CTX.clearRect( 0, 0, MAIN_CANVAS.width, MAIN_CANVAS.height );
};


window.Brush = Brush;

}(window));
