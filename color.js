


(function(window)
{

function Color()
{

}


var RED = 0;
var GREEN = 0;
var BLUE = 0;
var ALPHA = 1;


Color.init = function()
{
var colorContainer = document.querySelector( '#color' );

var redSlider = colorContainer.querySelector( '#redSlider' );
var redValue = colorContainer.querySelector( '#redValue' );


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
        }
    });

    
var greenSlider = colorContainer.querySelector( '#greenSlider' );
var greenValue = colorContainer.querySelector( '#greenValue' );


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
        }
    });    
    
var blueSlider = colorContainer.querySelector( '#blueSlider' );
var blueValue = colorContainer.querySelector( '#blueValue' );


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
        }
    });
    

var alphaSlider = colorContainer.querySelector( '#alphaSlider' );
var alphaValue = colorContainer.querySelector( '#alphaValue' );


$( alphaSlider ).slider({
    value : ALPHA,
    min   : 0,
    max   : 1,
    step  : 0.1,
    range : 'min',
    slide : function(event, ui)
        {
        alphaValue.innerHTML = ui.value;
        
        ALPHA = ui.value;
        }
    });
};



Color.toString = function()
{
return "rgba(" + RED + ',' + GREEN + ',' + BLUE + ',' + ALPHA + ')';
};



window.Color = Color;

}(window));