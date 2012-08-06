/*global $*/
/*jslint vars: true, white: true*/


"use strict";


(function(window)
{

var THICKNESS = 5;

var THICKNESS_SLIDER_HANDLE = null;
var THICKNESS_SLIDER_RANGE = null;

function Thickness( container )
{
var thicknessContainer = container.querySelector( '#thickness' );

var thicknessSlider = thicknessContainer.querySelector( '#thicknessSlider' );
var thicknessValue = thicknessContainer.querySelector( '#thicknessValue' );


$( thicknessSlider ).slider({
    value : THICKNESS,
    min   : 1,
    max   : 30,
    step  : 1,
    range : 'min',
    slide : function(event, ui)
        {
        thicknessValue.innerHTML = ui.value;
        
        THICKNESS = ui.value;
        }
    });


THICKNESS_SLIDER_HANDLE = thicknessSlider.querySelector('.ui-slider-handle');

THICKNESS_SLIDER_RANGE = thicknessSlider.querySelector('.ui-slider-range');


Thickness.changeSliderColor( Color.toString() );
}



Thickness.getValue = function()
{
return THICKNESS;
};


Thickness.changeSliderColor = function( rgbaString )
{
$( THICKNESS_SLIDER_HANDLE ).css( 'background', rgbaString );
$( THICKNESS_SLIDER_RANGE  ).css( 'background', rgbaString );
};



window.Thickness = Thickness;


}(window));