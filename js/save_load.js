(function(window)
{
function SaveLoad()
{

}

SaveLoad.save = function()
{
    // save the RGB values that were set
var rgb = Color.getValues();

localStorage.setObject( 'rgb', rgb );

    // save the control values of the brushes
localStorage.setObject( 'brushes_values', Paint.getBrushesValues() );

    // save which brush is currently selected
localStorage.setObject( 'selected_brush', Paint.getSelectedBrush() );
};



SaveLoad.getRgb = function()
{
var rgb = localStorage.getObject( 'rgb' );

if ( rgb )
    {
    return rgb;
    }

else
    {
    return null;
    }
};


SaveLoad.loadBrushesValues = function( brushes )
{
try
    {
    var brushesValues = localStorage.getObject( 'brushes_values' );
    }

catch (error)
    {
    return;
    }

if ( !brushesValues )
    {
    return;
    }


for (var a = 0 ; a < brushes.length ; a++)
    {
    brushes[ a ].previousValues = brushesValues[ a ].previousValues;
    }
};



SaveLoad.getSelectedBrush = function()
{
var selectedBrush = localStorage.getObject( 'selected_brush' );

if ( selectedBrush && $.isNumeric( selectedBrush ) )
    {
    return selectedBrush;
    }

else
    {
    return 0;
    }
};




window.SaveLoad = SaveLoad;

}(window));