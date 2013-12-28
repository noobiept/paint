(function(window)
{

function SprayBrush( args )
{
var opacityId = 'opacity';
var radiusId = 'radius';
var totalPointsId = 'totalPoints';

if ( typeof args[ opacityId ] == 'undefined' )
    {
    args[ opacityId ] = [0.25, 1];
    }

if ( typeof args[ radiusId ] == 'undefined' )
    {
    args[ radiusId ] = 50;
    }

if ( typeof args[ totalPointsId ] == 'undefined' )
    {
    args[ totalPointsId ] = 50;
    }


    // declaring the properties that will be used later on (the values will change from these, for example from the controls in the menu
this.currentX = 0;
this.currentY = 0;
this.interval_f = null;
this.minimum_opacity = args[ opacityId ][ 0 ];
this.maximum_opacity = args[ opacityId ][ 1 ];
this.radius = args[ radiusId ];
this.total_points = args[ totalPointsId ];

    // init. controls

var container1 = document.querySelector( '#brushControls1' );

this.opacity_control = new Control({
        id: opacityId,
        name: 'Opacity',
        minValue: 0,
        maxValue: 1,
        initValue: args[ opacityId ],
        step: 0.05,
        container: container1,
        onSlideFunction: function() { Paint.updateCurrentColor(); }
    });
this.radius_control = new Control({
        id: radiusId,
        name: 'Radius',
        minValue: 10,
        maxValue: 100,
        initValue: args[ radiusId ],
        step: 1,
        container: container1
    });
this.total_points_control = new Control({
        id: totalPointsId,
        name: 'Total Points',
        minValue: 10,
        maxValue: 100,
        initValue: args[ totalPointsId ],
        step: 1,
        container: container1
    });

this.all_controls = [ this.opacity_control, this.radius_control, this.total_points_control ];
}



SprayBrush.prototype.startDraw = function( event )
{
var this_ = this;

this.currentX = event.clientX;
this.currentY = event.clientY;

DRAW_CTX.save();

var color = Color.getValues();
var opacity = this.opacity_control.getValue();

this.minimum_opacity = opacity[ 0 ];
this.maximum_opacity = opacity[ 1 ];

this.radius = this.radius_control.getValue();
this.total_points = this.total_points_control.getValue();

DRAW_CTX.beginPath();
DRAW_CTX.lineCap = 'round';
DRAW_CTX.lineJoin = 'round';
DRAW_CTX.fillStyle = toCssColor( color.red, color.green, color.blue );

    // keep adding points, until the mouse button stops being pressed
this.interval_f = window.setInterval( function()
    {
    for (var a = 0 ; a < this_.total_points ; a++)
        {
        var angle = getRandomFloat( 0, 2 * Math.PI );
        var distance = getRandomInt( 0, this_.radius );

        DRAW_CTX.globalAlpha = getRandomFloat( this_.minimum_opacity, this_.maximum_opacity );
        DRAW_CTX.fillRect(
            this_.currentX + distance * Math.cos( angle ),
            this_.currentY + distance * Math.sin( angle ),
            1,
            1
            );
        }

    }, 50 );
};


SprayBrush.prototype.duringDraw = function( event )
{
this.currentX = event.clientX;
this.currentY = event.clientY;
};


SprayBrush.prototype.endDraw = function( event )
{
window.clearInterval( this.interval_f );

MAIN_CTX.drawImage( DRAW_CANVAS, 0, 0 );

DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );
DRAW_CTX.restore();
};


SprayBrush.prototype.getSettings = function()
{
var settings = {};

for (var a = 0 ; a < this.all_controls.length ; a++)
    {
    var control = this.all_controls[ a ];

    settings[ control.id ] = control.getValue();
    }

return settings;
};


SprayBrush.prototype.clear = function()
{
for (var a = 0 ; a < this.all_controls.length ; a++)
    {
    this.all_controls[ a ].clear();
    }
};


window.SprayBrush = SprayBrush;

}(window));
