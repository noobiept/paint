(function(window)
{

function LineBrush()
{
this.all_points = [];

this.addControls();
}


LineBrush.prototype.addControls = function()
{
this.opacity_control = new Control({
        name: 'Opacity',
        minValue: 0,
        maxValue: 1,
        initValue: 1,
        step: 0.1,
        onSlideFunction: function() { Paint.updateCurrentColor(); }
    });
this.thickness_control = new Control({
        name: 'Thickness',
        minValue: 0.5,
        maxValue: 30,
        initValue: 5,
        step: 0.5
    });
this.shadow_blur_control = new Control({
        name: 'Shadow Blur',
        minValue: 0,
        maxValue: 10,
        initValue: 0,
        step: 0.5
    });
};


LineBrush.prototype.setupDraw = function( context )
{
var color = Color.getValues();

var opacity = this.opacity_control.getValue();

var colorCss = toCssColor( color.red, color.green, color.blue, opacity );

context.beginPath();
context.strokeStyle = colorCss;
context.lineCap = 'round';
context.lineJoin = 'round';
context.lineWidth = this.thickness_control.getValue();
context.shadowBlur = this.shadow_blur_control.getValue();
context.shadowColor = colorCss;
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

DRAW_CTX.save();

this.setupDraw( DRAW_CTX );
};



LineBrush.prototype.duringDraw = function( event )
{
DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

this.all_points.push({
        x: event.clientX,
        y: event.clientY
    });

this.drawLine( DRAW_CTX );
};


LineBrush.prototype.endDraw = function()
{
DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

DRAW_CTX.restore();

MAIN_CTX.save();

this.setupDraw( MAIN_CTX );
this.drawLine( MAIN_CTX );

MAIN_CTX.restore();

this.all_points.length = 0;
};


LineBrush.prototype.clear = function()
{
this.thickness_control.clear();
this.opacity_control.clear();
this.shadow_blur_control.clear();
};


window.LineBrush = LineBrush;

}(window));