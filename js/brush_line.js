(function(window)
{

function LineBrush()
{
this.old_mid_x = 0;
this.old_mid_y = 0;
this.old_x = 0;
this.old_y = 0;

this.all_points = [];
}


LineBrush.prototype.setupDraw = function( context )
{
var thickness = Thickness.getValue();
var color = Color.toString();

context.strokeStyle = color;
context.lineCap = 'round';
context.lineJoin = 'round';
context.lineWidth = thickness;
context.shadowBlur = 10;
context.shadowColor = color;
};


LineBrush.prototype.drawLine = function( context )
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
};



LineBrush.prototype.startDraw = function( event )
{
this.all_points.push({
        x: event.clientX,
        y: event.clientY
    });

this.setupDraw( DRAW_CTX );
};



LineBrush.prototype.duringDraw = function( event )
{
var mouseX = event.clientX;
var mouseY = event.clientY;

DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

this.all_points.push({
        x: mouseX,
        y: mouseY
    });

this.drawLine( DRAW_CTX );
};


LineBrush.prototype.endDraw = function()
{
DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

this.setupDraw( MAIN_CTX );
this.drawLine( MAIN_CTX );

this.all_points.length = 0;
};


window.LineBrush = LineBrush;

}(window));