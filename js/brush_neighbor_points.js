(function(window)
{

function NeighborPointsBrush()
{
this.all_shapes = [];
}


NeighborPointsBrush.prototype.startDraw = function( event )
{
var mouseX = event.clientX;
var mouseY = event.clientY;

var thickness = Thickness.getValue();

CTX.strokeStyle = Color.toString();
CTX.lineCap = 'round';
CTX.lineJoin = 'round';
CTX.lineWidth = thickness;

this.all_shapes.push({
        x: mouseX,
        y: mouseY
    });


var colorValues = Color.getValues();

var newAlpha = colorValues.alpha - 0.6;

if ( newAlpha < 0.05 )
    {
    newAlpha = 0.05;
    }

    // the secondary lines will have different styling (less pronounced)
this.secondaryLinesStyle = 'rgba(' + colorValues.red + ',' + colorValues.green + ',' + colorValues.blue + ',' + newAlpha + ')';
this.secondaryLinesWidth = thickness / 4;
};


NeighborPointsBrush.prototype.duringDraw = function( event )
{
var mouseX = event.clientX;
var mouseY = event.clientY;

var lastShape = this.all_shapes[ this.all_shapes.length - 1 ];

CTX.beginPath();
CTX.moveTo( lastShape.x, lastShape.y );
CTX.lineTo( mouseX, mouseY );
CTX.stroke();

this.all_shapes.push({
    x: mouseX,
    y: mouseY
    });

    // save the main styling
CTX.save();

CTX.strokeStyle = this.secondaryLinesStyle;
CTX.lineWidth = this.secondaryLinesWidth;

    // find lines/points close to the current one
for (var a = 0 ; a < this.all_shapes.length ; a++)
    {
        // construct a triangle, to check the distance between points (the current one, with others previously saved)
    var adjacent = this.all_shapes[ a ].x - mouseX;
    var opposite = this.all_shapes[ a ].y - mouseY;

        // the distance would be the square root of this. we don't do that as an optimization
    var distance = adjacent * adjacent + opposite * opposite;

    if ( distance < 1000 )  // sqrt(1000) == 31.6 which is the distance
        {
        CTX.beginPath();
        CTX.moveTo( mouseX + adjacent * 0.2, mouseY + opposite * 0.2 );
        CTX.lineTo( this.all_shapes[ a ].x - adjacent * 0.2, this.all_shapes[ a ].y - opposite * 0.2 );
        CTX.stroke();
        }
    }

CTX.restore();
};


NeighborPointsBrush.prototype.endDraw = function()
{
this.all_shapes.length = 0;
};


window.NeighborPointsBrush = NeighborPointsBrush;

}(window));