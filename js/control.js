(function(window)
{

/*
    args = {
        id        : String,
        name      : String,
        minValue  : Number,
        maxValue  : Number,
        initValue : Number,
        step      : Number,
        container : HTMLElement,
        onSlideFunction : Function,
        cssClass  : String
    }

    If initValue is an array, means its a range slider (has a minimum and maximum value, otherwise is a single value slider

    The return of .getValue() also depends on the type of slider, if its a single value slider it returns a number, otherwise an array with the min/max values
 */

function Control( args )
{
var _this = this;

this.id = args.id;
this.value = args.initValue;


var container = args.container;

var controlContainer = document.createElement( 'div' );
var controlText = document.createElement( 'span' );
var controlValue = document.createElement( 'span' );
var controlSlider = document.createElement( 'div' );

$( controlText ).text( args.name );
$( controlValue ).text( this.value );

$( controlContainer ).addClass( 'Control' );

if ( args.cssClass )
    {
    $( controlContainer ).addClass( args.cssClass );
    }

controlContainer.appendChild( controlText );
controlContainer.appendChild( controlValue );
controlContainer.appendChild( controlSlider );

container.appendChild( controlContainer );

this.mainContainer = container;
this.thicknessContainer = controlContainer;


var sliderOptions = {
    min   : args.minValue,
    max   : args.maxValue,
    step  : args.step
    };


    // means its a range slider
if ( args.initValue instanceof Array )
    {
    sliderOptions.range = true;
    sliderOptions.values = args.initValue;
    sliderOptions.slide = function( event, ui )
        {
        var min = ui.values[ 0 ];
        var max = ui.values[ 1 ];

        $( controlValue ).text( min + ', ' + max );

        _this.value = [ min, max ];

        if ( args.onSlideFunction )
            {
            args.onSlideFunction( event, ui );
            }
        };
    }

    // single value slider
else
    {
    sliderOptions.range = 'min';
    sliderOptions.value = args.initValue;
    sliderOptions.slide = function( event, ui )
        {
        $( controlValue ).text( ui.value );

        _this.value = ui.value;

        if ( args.onSlideFunction )
            {
            args.onSlideFunction( event, ui );
            }
        };
    }


$( controlSlider ).slider( sliderOptions );
}


Control.prototype.getValue = function()
{
return this.value;
};


Control.prototype.clear = function()
{
this.mainContainer.removeChild( this.thicknessContainer );
};



window.Control = Control;


}(window));