(function(window)
{

function SprayBrush()
{
    // declaring the properties that will be used later on (the values will change from these, for example from the controls in the menu
this.currentX = 0;
this.currentY = 0;
this.interval_f = null;
this.minimum_opacity = 0;
this.maximum_opacity = 1;
this.radius = 50;
this.total_points = 50;

    // init. controls

var container1 = document.querySelector( '#brushControls1' );

this.opacity_control = new Control({
        name: 'Opacity',
        minValue: 0,
        maxValue: 1,
        initValue: [0.25, 1],
        step: 0.05,
        container: container1,
        onSlideFunction: function() { Paint.updateCurrentColor(); }
    });
this.radius_control = new Control({
        name: 'Radius',
        minValue: 10,
        maxValue: 100,
        initValue: 50,
        step: 1,
        container: container1
    });
this.total_points_control = new Control({
        name: 'Total Points',
        minValue: 10,
        maxValue: 100,
        initValue: 50,
        step: 1,
        container: container1
    });
}

SprayBrush.prototype.setupDraw = function( context )
{
var opacity = this.opacity_control.getValue();

this.minimum_opacity = opacity[ 0 ];
this.maximum_opacity = opacity[ 1 ];

this.radius = this.radius_control.getValue();
this.total_points = this.total_points_control.getValue();

context.beginPath();
context.lineCap = 'round';
context.lineJoin = 'round';
};

SprayBrush.prototype.drawLine = function( context )
{
for (var a = 0 ; a < this.total_points ; a++)
    {
    var angle = getRandomFloat( 0, 2 * Math.PI );
    var distance = getRandomInt( 0, this.radius );

    context.globalAlpha = getRandomFloat( this.minimum_opacity, this.maximum_opacity );
    context.fillRect(
            this.currentX + distance * Math.cos( angle ),
            this.currentY + distance * Math.sin( angle ),
            1,
            1
        );
    }
};


SprayBrush.prototype.startDraw = function( event )
{
var this_ = this;

this.currentX = event.clientX;
this.currentY = event.clientY;

DRAW_CTX.save();

this.setupDraw( DRAW_CTX );

this.interval_f = window.setInterval( function()
    {
    this_.drawLine( DRAW_CTX );

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


SprayBrush.prototype.clear = function()
{
this.opacity_control.clear();
this.radius_control.clear();
this.total_points_control.clear();
};


window.SprayBrush = SprayBrush;

}(window));
