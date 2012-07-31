

(function(window)
{

function Thickness()
{

}

var THICKNESS = 5;


Thickness.init = function()
{
var thicknessContainer = document.querySelector( '#thickness' );

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
};



Thickness.getValue = function()
{
return THICKNESS;
};



window.Thickness = Thickness;


}(window));