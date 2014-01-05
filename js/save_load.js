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

if ( Paint.savingCanvas() )
    {
    localStorage.setObject( 'saved_canvas', true );

        // save the canvas
    localStorage.setObject( 'canvas', MAIN_CANVAS.toDataURL( 'image/png' ) );
    localStorage.setObject( 'canvas_width', MAIN_CANVAS.width );
    localStorage.setObject( 'canvas_height', MAIN_CANVAS.height );
    }

else
    {
    localStorage.setObject( 'saved_canvas', false );
    }
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



SaveLoad.loadCanvasImage = function()
{
var canvas = localStorage.getObject( 'canvas' );
var canvasWidth = localStorage.getObject( 'canvas_width' );
var canvasHeight = localStorage.getObject( 'canvas_height' );

if ( canvas && $.isNumeric( canvasWidth ) && $.isNumeric( canvasHeight ) )
    {
    MAIN_CANVAS.width = canvasWidth;
    MAIN_CANVAS.height = canvasHeight;

    DRAW_CANVAS.width = canvasWidth;
    DRAW_CANVAS.height = canvasHeight;

    var img = new Image();

    img.src = canvas;
    img.onload = function()
        {
        MAIN_CTX.drawImage( img, 0, 0 );
        };
    }
};



window.SaveLoad = SaveLoad;

}(window));