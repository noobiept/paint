/*global $*/
/*jslint vars: true, white: true*/

"use strict";


(function(window)
{

var RED = 255;
var GREEN = 0;
var BLUE = 0;
var ALPHA = 1;


function Color( container )
{
var redSlider = container.querySelector( '#redSlider' );
var redValue = container.querySelector( '#redValue' );

$( redValue ).text( RED );

$( redSlider ).slider({
    value : RED,
    min   : 0,
    max   : 255,
    step  : 1,
    range : 'min',
    slide : function(event, ui)
        {
        $( redValue ).text( ui.value );
        
        RED = ui.value;
        
            // show the current color, in the thickness slider color
        Thickness.changeSliderColor( Color.toString() );
        }
    });

    
var greenSlider = container.querySelector( '#greenSlider' );
var greenValue = container.querySelector( '#greenValue' );

$( greenValue ).text( GREEN );

$( greenSlider ).slider({
    value : GREEN,
    min   : 0,
    max   : 255,
    step  : 1,
    range : 'min',
    slide : function(event, ui)
        {
        $( greenValue ).text( ui.value );

        GREEN = ui.value;
        
            // show the current color, in the thickness slider color
        Thickness.changeSliderColor( Color.toString() );
        }
    });    
    
var blueSlider = container.querySelector( '#blueSlider' );
var blueValue = container.querySelector( '#blueValue' );

$( blueValue ).text( BLUE );

$( blueSlider ).slider({
    value : BLUE,
    min   : 0,
    max   : 255,
    step  : 1,
    range : 'min',
    slide : function(event, ui)
        {
        $( blueValue ).text( ui.value );
        
        BLUE = ui.value;
        
            // show the current color, in the thickness slider color
        Thickness.changeSliderColor( Color.toString() );
        }
    });
    

var alphaSlider = container.querySelector( '#alphaSlider' );
var alphaValue = container.querySelector( '#alphaValue' );

$( alphaValue ).text( ALPHA );

$( alphaSlider ).slider({
    value : ALPHA,
    min   : 0,
    max   : 1,
    step  : 0.05,
    range : 'min',
    slide : function(event, ui)
        {
        $( alphaValue ).text( ui.value );
        
        ALPHA = ui.value;
        
            // show the current color, in the thickness slider color
        Thickness.changeSliderColor( Color.toString() );
        }
    });
}



Color.toString = function()
{
return "rgba(" + RED + ',' + GREEN + ',' + BLUE + ',' + ALPHA + ')';
};


Color.getValues = function()
{
return {
        red: RED,
        green: GREEN,
        blue: BLUE,
        alpha: ALPHA
    };
};



window.Color = Color;

}(window));