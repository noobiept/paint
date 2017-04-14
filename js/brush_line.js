(function(window)
{

function LineBrush( args )
{
var opacityId = 'opacity';
var thicknessId = 'thickness';
var shadowBlurId = 'shadowBlur';

if ( typeof args[ opacityId ] == 'undefined' )
    {
    args[ opacityId ] = 1;
    }

if ( typeof args[ thicknessId ] == 'undefined' )
    {
    args[ thicknessId ] = 5;
    }

if ( typeof args[ shadowBlurId ] == 'undefined' )
    {
    args[ shadowBlurId ] = 0;
    }


    // add controls
var container = document.querySelector( '#brushControls1' );

this.opacity_control = new Control({
        id: opacityId,
        name: 'Opacity:',
        minValue: 0,
        maxValue: 1,
        initValue: args[ opacityId ],
        step: 0.1,
        container: container,
        onSlideFunction: function() { Paint.updateCurrentColor(); }
    });
this.thickness_control = new Control({
        id: thicknessId,
        name: 'Thickness:',
        minValue: 0.5,
        maxValue: 30,
        initValue: args[ thicknessId ],
        step: 0.5,
        container: container
    });
this.shadow_blur_control = new Control({
        id: shadowBlurId,
        name: 'Shadow Blur:',
        minValue: 0,
        maxValue: 10,
        initValue: args[ shadowBlurId ],
        step: 0.5,
        container: container
    });

        // init stuff
this.all_points = [];

this.all_controls = [ this.opacity_control, this.thickness_control, this.shadow_blur_control ];
}



LineBrush.prototype.startDraw = function( event )
{
this.all_points.push({
        x: event.pageX,
        y: event.pageY
    });


DRAW_CTX.save();

var color;
var opacity = this.opacity_control.getValue();

    // when we're erasing, we draw unto the draw canvas with a white color, and later what was drawn is removed/erased from the main canvas
if ( Paint.isEraseBrush() )
    {
    color = {
            red: 255,
            green: 255,
            blue: 255
        };
    }

    // otherwise just get the color from the color picker in the menu
else
    {
    color = Color.getValues();
    }

var colorCss = toCssColor( color.red, color.green, color.blue, opacity );

DRAW_CTX.beginPath();
DRAW_CTX.strokeStyle = colorCss;
DRAW_CTX.lineCap = 'round';
DRAW_CTX.lineJoin = 'round';
DRAW_CTX.lineWidth = this.thickness_control.getValue();
DRAW_CTX.shadowBlur = this.shadow_blur_control.getValue();
DRAW_CTX.shadowColor = colorCss;
};



LineBrush.prototype.duringDraw = function( event )
{
DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

this.all_points.push({
        x: event.pageX,
        y: event.pageY
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

    DRAW_CTX.quadraticCurveTo( point1.x, point1.y, midPointX, midPointY );

    point1 = this.all_points[ a ];
    point2 = this.all_points[ a + 1 ];
    }

DRAW_CTX.stroke();
};


LineBrush.prototype.endDraw = function( event )
{
    // draw what is in the draw canvas into the main one
MAIN_CTX.save();

if ( Paint.isEraseBrush() )
    {
    MAIN_CTX.globalCompositeOperation = 'destination-out';
    }

MAIN_CTX.drawImage( DRAW_CANVAS, 0, 0 );
MAIN_CTX.restore();

DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

    // we're done with drawing, so restore the previous styling
DRAW_CTX.restore();

this.all_points.length = 0;
};


LineBrush.prototype.getSettings = function()
{
var settings = {};

for (var a = 0 ; a < this.all_controls.length ; a++)
    {
    var control = this.all_controls[ a ];

        // this assumes the setting key is the same string as the control id
    settings[ control.id ] = control.getValue();
    }

return settings;
};


LineBrush.prototype.clear = function()
{
for (var a = 0 ; a < this.all_controls.length ; a++)
    {
    this.all_controls[ a ].clear();
    }
};


window.LineBrush = LineBrush;

}(window));
