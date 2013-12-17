(function(window)
{

/*
    If initValue is an array, means its a range slider (has a minimum and maximum value, otherwise is a single value slider

    The return of .getValue() also depends on the type of slider, if its a single value slider it returns a number, otherwise an array with the min/max values
 */

function Control( name, minValue, maxValue, initValue, step )
{
var _this = this;

this.value = initValue;

var container = document.querySelector( '#brushControls' );

var controlContainer = document.createElement( 'div' );
var controlValue = document.createElement( 'span' );
var controlSlider = document.createElement( 'div' );

$( controlContainer ).text( name + ': ' );
$( controlValue ).text( this.value );

controlContainer.appendChild( controlValue );
controlContainer.appendChild( controlSlider );

container.appendChild( controlContainer );

this.mainContainer = container;
this.thicknessContainer = controlContainer;


var sliderOptions = {
    min   : minValue,
    max   : maxValue,
    step  : step
    };


    // means its a range slider
if ( initValue instanceof Array )
    {
    sliderOptions.range = true;
    sliderOptions.values = initValue;
    sliderOptions.slide = function( event, ui )
        {
        var min = ui.values[ 0 ];
        var max = ui.values[ 1 ];

        $( controlValue ).text( min + ', ' + max );

        _this.value = [ min, max ];
        };
    }

    // single value slider
else
    {
    sliderOptions.range = 'min';
    sliderOptions.value = initValue;
    sliderOptions.slide = function( event, ui )
        {
        $( controlValue ).text( ui.value );

        _this.value = ui.value;
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