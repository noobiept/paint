(function(window)
{
var RED = 255;
var GREEN = 0;
var BLUE = 0;


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

        Paint.updateCurrentColor();
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

        Paint.updateCurrentColor();
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

        Paint.updateCurrentColor();
        }
    });
}



Color.getValues = function()
{
return {
        red: RED,
        green: GREEN,
        blue: BLUE
    };
};



window.Color = Color;

}(window));