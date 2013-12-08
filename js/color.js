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


$( redSlider ).slider({
    value : RED,
    min   : 0,
    max   : 255,
    step  : 1,
    range : 'min',
    slide : function(event, ui)
        {
        redValue.innerHTML = ui.value;
        
        RED = ui.value;
        
            // show the current color, in the thickness slider color
        Thickness.changeSliderColor( Color.toString() );
        }
    });

    
var greenSlider = container.querySelector( '#greenSlider' );
var greenValue = container.querySelector( '#greenValue' );


$( greenSlider ).slider({
    value : GREEN,
    min   : 0,
    max   : 255,
    step  : 1,
    range : 'min',
    slide : function(event, ui)
        {
        greenValue.innerHTML = ui.value;
        
        GREEN = ui.value;
        
            // show the current color, in the thickness slider color
        Thickness.changeSliderColor( Color.toString() );
        }
    });    
    
var blueSlider = container.querySelector( '#blueSlider' );
var blueValue = container.querySelector( '#blueValue' );


$( blueSlider ).slider({
    value : BLUE,
    min   : 0,
    max   : 255,
    step  : 1,
    range : 'min',
    slide : function(event, ui)
        {
        blueValue.innerHTML = ui.value;
        
        BLUE = ui.value;
        
            // show the current color, in the thickness slider color
        Thickness.changeSliderColor( Color.toString() );
        }
    });
    

var alphaSlider = container.querySelector( '#alphaSlider' );
var alphaValue = container.querySelector( '#alphaValue' );


$( alphaSlider ).slider({
    value : ALPHA,
    min   : 0,
    max   : 1,
    step  : 0.05,
    range : 'min',
    slide : function(event, ui)
        {
        alphaValue.innerHTML = ui.value;
        
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



window.Color = Color;

}(window));