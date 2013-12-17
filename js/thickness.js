(function(window)
{

var THICKNESS = 5;


function Thickness( container )
{
var thicknessContainer = container.querySelector( '#thickness' );

var thicknessSlider = thicknessContainer.querySelector( '#thicknessSlider' );
var thicknessValue = thicknessContainer.querySelector( '#thicknessValue' );


$( thicknessSlider ).slider({
    value : THICKNESS,
    min   : 0.5,
    max   : 30,
    step  : 0.5,
    range : 'min',
    slide : function(event, ui)
        {
        thicknessValue.innerHTML = ui.value;
        
        THICKNESS = ui.value;
        }
    });
}


Thickness.getValue = function()
{
return THICKNESS;
};



window.Thickness = Thickness;


}(window));