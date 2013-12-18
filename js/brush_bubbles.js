(function(window)
{

function BubblesBrush()
{
this.all_points = [];
this.minimum_radius = 5;
this.maximum_radius = 10;
this.minimum_opacity = 0;   // the min/max opacity variables will be updated after depending on what is set in the menu
this.maximum_opacity = 1;

this.addControls();
}



BubblesBrush.prototype.addControls = function()
{
var container = document.querySelector( '#brushControls1' );

this.opacity_control = new Control({
        name: 'Opacity',
        minValue: 0,
        maxValue: 1,
        initValue: [ 0.25, 1 ],
        step: 0.1,
        container: container,
        onSlideFunction: function() { Paint.updateCurrentColor() }
    });
this.radius_control = new Control({
        name: 'Radius',
        minValue: 1,
        maxValue: 20,
        initValue: [ this.minimum_radius, this.maximum_radius ],
        step: 0.5,
        container: container
    });
};


BubblesBrush.prototype.setupDraw = function( context )
{
var color = Color.getValues();

context.beginPath();
context.fillStyle = toCssColor( color.red, color.green, color.blue );


var opacity = this.opacity_control.getValue();

this.minimum_opacity = opacity[ 0 ];
this.maximum_opacity = opacity[ 1 ];

var radius = this.radius_control.getValue();

this.minimum_radius = radius[ 0 ];
this.maximum_radius = radius[ 1 ];
};



BubblesBrush.prototype.drawLine = function( context )
{
for (var a = 0 ; a < this.all_points.length ; a++)
    {
    var circle = this.all_points[ a ];

    context.beginPath();
    context.globalAlpha = circle.opacity;
    context.arc( circle.x, circle.y, circle.radius, 0, Math.PI * 2 );
    context.fill();
    }
};


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
this.setupDraw( DRAW_CTX );
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

this.drawLine( DRAW_CTX );
};


BubblesBrush.prototype.endDraw = function( event )
{
DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

    // we're done with drawing, so restore the previous styling
DRAW_CTX.restore();

    // same for the main canvas, save before making changes, and restore after all is set and done
MAIN_CTX.save();

this.setupDraw( MAIN_CTX );
this.drawLine( MAIN_CTX );

MAIN_CTX.restore();

this.all_points.length = 0;
};


BubblesBrush.prototype.clear = function()
{
this.radius_control.clear();
this.opacity_control.clear();
};


window.BubblesBrush = BubblesBrush;

}(window));