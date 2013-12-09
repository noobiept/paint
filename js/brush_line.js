(function(window)
{

function LineBrush()
{
this.old_mid_x = 0;
this.old_mid_y = 0;
this.old_x = 0;
this.old_y = 0;
}


LineBrush.prototype.startDraw = function( event )
{
this.old_x = event.clientX;
this.old_y = event.clientY;

this.old_mid_x = this.old_x;
this.old_mid_y = this.old_y;

var thickness = Thickness.getValue();
var color = Color.toString();

CTX.beginPath();

CTX.strokeStyle = color;
CTX.lineCap = 'round';
CTX.lineJoin = 'round';
CTX.lineWidth = thickness;
};



LineBrush.prototype.duringDraw = function( event )
{
var mouseX = event.clientX;
var mouseY = event.clientY;

var midPointX = Math.floor( (this.old_x + mouseX) / 2 );
var midPointY = Math.floor( (this.old_y + mouseY) / 2 );


CTX.moveTo( midPointX, midPointY );
CTX.quadraticCurveTo( this.old_x, this.old_y, this.old_mid_x, this.old_mid_y );
CTX.stroke();

this.old_x = mouseX;
this.old_y = mouseY;

this.old_mid_x = midPointX;
this.old_mid_y = midPointY;
};



window.LineBrush = LineBrush;

}(window));