(function(window)
{
function Brush()
{

}

var BRUSHES = [
        { name: 'line', classObject: LineBrush }
    ];

var BRUSH_SELECTED = 0;
var BRUSH_OBJECT = null;



Brush.select = function( brushPosition )
{
BRUSH_SELECTED = brushPosition;

BRUSH_OBJECT = new BRUSHES[ brushPosition ].classObject();
};



Brush.startDraw = function()
{
BRUSH_OBJECT.startDraw();
};


Brush.duringDraw = function()
{
BRUSH_OBJECT.duringDraw();
};



function LineBrush()
{
this.current_shape = null;
this.old_mid_x = 0;
this.old_mid_y = 0;
this.old_x = 0;
this.old_y = 0;
}


LineBrush.prototype.startDraw = function()
{
var shape = new createjs.Shape();

this.old_x = STAGE.mouseX;
this.old_y = STAGE.mouseY;

this.old_mid_x = STAGE.mouseX;
this.old_mid_y = STAGE.mouseY;

var thickness = Thickness.getValue();
var color = Color.toString();

var g = shape.graphics;

g.setStrokeStyle( thickness + 1, 'round', 'round' );
g.beginStroke( color );

this.current_shape = shape;

Paint.addShape( shape );

UndoRedo.addStroke( shape );
};



LineBrush.prototype.duringDraw = function()
{
var mouseX = STAGE.mouseX;
var mouseY = STAGE.mouseY;

var midPointX = Math.floor( (this.old_x + mouseX) / 2 );
var midPointY = Math.floor( (this.old_y + mouseY) / 2 );


this.current_shape.graphics.moveTo( midPointX, midPointY );
this.current_shape.graphics.curveTo( this.old_x, this.old_y, this.old_mid_x, this.old_mid_y );

this.old_x = mouseX;
this.old_y = mouseY;

this.old_mid_x = midPointX;
this.old_mid_y = midPointY;
};



window.Brush = Brush;

}(window));