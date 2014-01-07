(function(window)
{

function BubblesBrush( args )
{
var opacityId = 'opacity';
var radiusId = 'radius';

if ( typeof args[ opacityId ] == 'undefined' )
    {
    args[ opacityId ] = [ 0.25, 1 ];
    }

if ( typeof args[ radiusId ] == 'undefined' )
    {
    args[ radiusId ] = [ 5, 10 ];
    }


this.all_points = [];
this.minimum_radius = args[ radiusId ][ 0 ];
this.maximum_radius = args[ radiusId ][ 1 ];
this.minimum_opacity = args[ opacityId ][ 0 ];
this.maximum_opacity = args[ opacityId ][ 1 ];

    // add the controls
var container = document.querySelector( '#brushControls1' );

this.opacity_control = new Control({
        id: opacityId,
        name: 'Opacity:',
        minValue: 0,
        maxValue: 1,
        initValue: args[ opacityId ],
        step: 0.1,
        container: container,
        onSlideFunction: function() { Paint.updateCurrentColor() }
    });
this.radius_control = new Control({
        id: radiusId,
        name: 'Radius:',
        minValue: 1,
        maxValue: 20,
        initValue: args[ radiusId ],
        step: 0.5,
        container: container
    });

this.all_controls = [ this.opacity_control, this.radius_control ];
}


BubblesBrush.prototype.startDraw = function( event )
{
this.all_points.push({
        x : event.clientX,
        y : event.clientY,
        radius  : getRandomInt( this.minimum_radius, this.maximum_radius ),
        opacity : getRandomFloat( this.minimum_opacity, this.maximum_opacity )
    });

    // before making changes to the styling, call context.save(), to save the previous state (we'll restore at the end)
DRAW_CTX.save();

var color = Color.getValues();

DRAW_CTX.beginPath();
DRAW_CTX.fillStyle = toCssColor( color.red, color.green, color.blue );


var opacity = this.opacity_control.getValue();

this.minimum_opacity = opacity[ 0 ];
this.maximum_opacity = opacity[ 1 ];

var radius = this.radius_control.getValue();

this.minimum_radius = radius[ 0 ];
this.maximum_radius = radius[ 1 ];
};


BubblesBrush.prototype.duringDraw = function( event )
{
DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

this.all_points.push({
        x : event.clientX,
        y : event.clientY,
        radius  : getRandomInt( this.minimum_radius, this.maximum_radius ),
        opacity : getRandomFloat( this.minimum_opacity, this.maximum_opacity )
    });

    // draw the line
for (var a = 0 ; a < this.all_points.length ; a++)
    {
    var circle = this.all_points[ a ];

    DRAW_CTX.beginPath();
    DRAW_CTX.globalAlpha = circle.opacity;
    DRAW_CTX.arc( circle.x, circle.y, circle.radius, 0, Math.PI * 2 );
    DRAW_CTX.fill();
    }
};


BubblesBrush.prototype.endDraw = function( event )
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


BubblesBrush.prototype.getSettings = function()
{
var settings = {};

for (var a = 0 ; a < this.all_controls.length ; a++)
    {
    var control = this.all_controls[ a ];

    settings[ control.id ] = control.getValue();
    }

return settings;
};


BubblesBrush.prototype.clear = function()
{
for (var a = 0 ; a < this.all_controls.length ; a++)
    {
    this.all_controls[ a ].clear();
    }
};


window.BubblesBrush = BubblesBrush;

}(window));
