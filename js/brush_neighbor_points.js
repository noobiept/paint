(function(window)
{

function NeighborPointsBrush()
{
this.all_points = [];   // the main line
this.additional_lines = [];  // the lines between the close points of the main line

this.addControls();
}


NeighborPointsBrush.prototype.addControls = function()
{
this.thickness = new Control( 'Thickness', 0.5, 30, 5, 0.5 );
};


NeighborPointsBrush.prototype.setupDraw = function( context )
{
var color = Color.toString();

context.beginPath();
context.strokeStyle = color;
context.lineCap = 'round';
context.lineJoin = 'round';
context.lineWidth = this.thickness.getValue();
context.shadowBlur = 10;
context.shadowColor = color;
};


NeighborPointsBrush.prototype.drawLine = function( context )
{
var point1 = this.all_points[ 0 ];
var point2 = this.all_points[ 1 ];

context.beginPath();
context.moveTo( point1.x, point1.y );

for (var a = 1 ; a < this.all_points.length ; a++)
    {
    var midPointX = Math.floor( (point1.x + point2.x) / 2 );
    var midPointY = Math.floor( (point1.y + point2.y) / 2 );

    context.quadraticCurveTo( point1.x, point1.y, midPointX, midPointY);

    point1 = this.all_points[ a ];
    point2 = this.all_points[ a + 1 ];
    }

context.stroke();


var lastPoint = this.all_points[ this.all_points.length - 1 ];

    // find lines/points close to the last one (which was just added)
for (a = 0 ; a < this.all_points.length ; a++)
    {
    var point = this.all_points[ a ];

        // construct a triangle, to check the distance between points (the current one, with others previously saved)
    var adjacent = point.x - lastPoint.x;
    var opposite = point.y - lastPoint.y;

        // the distance would be the square root of this. we don't do that as an optimization
    var distance = adjacent * adjacent + opposite * opposite;

    if ( distance < 1000 )  // sqrt(1000) == 31.6 which is the distance
        {
        this.additional_lines.push({
                x1: lastPoint.x,
                y1: lastPoint.y,
                x2: point.x,
                y2: point.y,
                distanceX: adjacent,
                distanceY: opposite
            });
        }
    }


    // save the main styling
context.save();

context.strokeStyle = this.secondaryLinesStyle;
context.lineWidth = this.secondaryLinesWidth;

    // draw all the additional lines
for (a = 0 ; a < this.additional_lines.length ; a++)
    {
    var line = this.additional_lines[ a ];

    context.moveTo( line.x1 + line.distanceX * 0.2, line.y1 + line.distanceY * 0.2 );
    context.lineTo( line.x2 - line.distanceX * 0.2, line.y2 - line.distanceY * 0.2 );
    }

context.stroke();
context.restore();
};



NeighborPointsBrush.prototype.startDraw = function( event )
{
var colorValues = Color.getValues();

var newAlpha = colorValues.alpha / 4;


    // the secondary lines will have different styling (less pronounced)
this.secondaryLinesStyle = 'rgba(' + colorValues.red + ',' + colorValues.green + ',' + colorValues.blue + ',' + newAlpha + ')';
this.secondaryLinesWidth = this.thickness.getValue() / 4;

this.all_points.push({
        x: event.clientX,
        y: event.clientY
    });

DRAW_CTX.save();
this.setupDraw( DRAW_CTX );
};


NeighborPointsBrush.prototype.duringDraw = function( event )
{
DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

this.all_points.push({
        x: event.clientX,
        y: event.clientY
    });

this.drawLine( DRAW_CTX );
};


NeighborPointsBrush.prototype.endDraw = function()
{
DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

DRAW_CTX.restore();

MAIN_CTX.save();

this.setupDraw( MAIN_CTX );
this.drawLine( MAIN_CTX );

MAIN_CTX.restore();

this.all_points.length = 0;
this.additional_lines.length = 0;
};


NeighborPointsBrush.prototype.clear = function()
{
this.thickness.clear();
};;


window.NeighborPointsBrush = NeighborPointsBrush;

}(window));