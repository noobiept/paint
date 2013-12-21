(function(window)
{

function LinePatternBrush()
{
this.all_points = [];

var container1 = document.querySelector( '#brushControls1' );
var container2 = document.querySelector( '#brushControls2' );

    // main line
this.opacity_control = new Control({
        name: 'Opacity',
        minValue: 0,
        maxValue: 1,
        initValue: 1,
        step: 0.1,
        container: container1,
        onSlideFunction: function() { Paint.updateCurrentColor(); }
    });
this.thickness_control = new Control({
        name: 'Thickness',
        minValue: 0.5,
        maxValue: 30,
        initValue: 10,
        step: 0.5,
        container: container1
    });

    // pattern
this.angle_control = new Control({
        name: 'Pattern Angle',
        minValue: 0,
        maxValue: 135,
        initValue: 0,
        step: 45,
        container: container2
    });
this.pattern_thickness_control = new Control({
        name: 'Pattern Thickness',
        minValue: 0.5,
        maxValue: 10,
        initValue: 5,
        step: 0.5,
        container: container2
    });
}


LinePatternBrush.prototype.getPattern = function()
{
var lineWidth = this.pattern_thickness_control.getValue();
var angle = this.angle_control.getValue();
var color = Color.getValues();

var opacity = this.opacity_control.getValue();

var colorCss = toCssColor( color.red, color.green, color.blue, opacity );

var width = 15;
var height = 15;

var pattern = document.createElement( 'canvas' );

pattern.width = width;
pattern.height = height;

var ctx = pattern.getContext( '2d' );

//var length = 40;
//var angleRads = angle * Math.PI / 180;
//var adjacent = length * Math.cos( angleRads );
//var opposite = length * Math.sin( angleRads );

ctx.beginPath();
ctx.strokeStyle = colorCss;
ctx.fillStyle = colorCss;
ctx.lineWidth = lineWidth;


var halfWidth = width / 2;
var halfHeight = height / 2;

    // line centered
if ( angle == 0 )
    {
    ctx.moveTo( 0, halfHeight );
    ctx.lineTo( width, halfHeight );
    ctx.stroke();
    }

    // diagonal
else if ( angle == 45 )
    {
    ctx.moveTo( 0, 0 );
    ctx.lineTo( width, height );
    ctx.stroke();

    var opposite = lineWidth / 2;
    var angleRads = Math.PI / 4;

    var hypotenuse = opposite / Math.sin( angleRads );

    ctx.moveTo( 0, height - hypotenuse );
    ctx.lineTo( hypotenuse, height );
    ctx.lineTo( 0, height );

    ctx.moveTo( width - hypotenuse, 0 );
    ctx.lineTo( width, hypotenuse );
    ctx.lineTo( width, 0 );

    ctx.fill();
    }

    // line centered as well
else if ( angle == 90 )
    {
    ctx.moveTo( halfWidth, 0 );
    ctx.lineTo( halfWidth, height );
    ctx.stroke();
    }

    // diagonal
else if ( angle == 135 )
    {
    ctx.moveTo( 0, height );
    ctx.lineTo( width, 0 );
    ctx.stroke();

    var opposite = lineWidth / 2;
    var angleRads = Math.PI / 4;

    var hypotenuse = opposite / Math.sin( angleRads );

    ctx.moveTo( 0, 0 );
    ctx.lineTo( hypotenuse, 0 );
    ctx.lineTo( 0, hypotenuse );

    ctx.moveTo( width, height - hypotenuse );
    ctx.lineTo( width - hypotenuse, height );
    ctx.lineTo( width, height );

    ctx.fill();
    }


return ctx.createPattern( pattern, 'repeat' );
};




LinePatternBrush.prototype.startDraw = function( event )
{
this.all_points.push({
        x: event.clientX,
        y: event.clientY
    });

DRAW_CTX.save();

DRAW_CTX.beginPath();
DRAW_CTX.strokeStyle = this.getPattern();
DRAW_CTX.lineCap = 'round';
DRAW_CTX.lineJoin = 'round';
DRAW_CTX.lineWidth = this.thickness_control.getValue();
};



LinePatternBrush.prototype.duringDraw = function( event )
{
DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

this.all_points.push({
        x: event.clientX,
        y: event.clientY
    });

    // draw the line
var point1 = this.all_points[ 0 ];
var point2 = this.all_points[ 1 ];

DRAW_CTX.beginPath();
DRAW_CTX.moveTo( point1.x, point1.y );

for (var a = 1 ; a < this.all_points.length ; a++)
    {
    var midPointX = Math.floor( (point1.x + point2.x) / 2 );
    var midPointY = Math.floor( (point1.y + point2.y) / 2 );

    DRAW_CTX.quadraticCurveTo( point1.x, point1.y, midPointX, midPointY);

    point1 = this.all_points[ a ];
    point2 = this.all_points[ a + 1 ];
    }

DRAW_CTX.stroke();
};



LinePatternBrush.prototype.endDraw = function( event )
{
MAIN_CTX.drawImage( DRAW_CANVAS, 0, 0 );

DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );
DRAW_CTX.restore();

this.all_points.length = 0;
};



LinePatternBrush.prototype.clear = function()
{
this.opacity_control.clear();
this.thickness_control.clear();
this.angle_control.clear();
this.pattern_thickness_control.clear();
};



window.LinePatternBrush = LinePatternBrush;

}(window));
