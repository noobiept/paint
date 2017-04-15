namespace SaveLoad
    {
    export function save()
        {
            // save the RGB values that were set
        var rgb = Color.getValues();

        Utilities.setObject( 'rgb', rgb );

            // save the control values of the brushes
        Utilities.setObject( 'brushes_values', Paint.getBrushesValues() );

            // save which brush is currently selected
        Utilities.setObject( 'selected_brush', Paint.getSelectedBrush() );

        if ( Paint.savingCanvas() )
            {
            Utilities.setObject( 'saved_canvas', true );

                // save the canvas
            Utilities.setObject( 'canvas', MAIN_CANVAS.toDataURL( 'image/png' ) );
            Utilities.setObject( 'canvas_width', MAIN_CANVAS.width );
            Utilities.setObject( 'canvas_height', MAIN_CANVAS.height );
            }

        else
            {
            Utilities.setObject( 'saved_canvas', false );
            }
        }


    export function getRgb()
        {
        var rgb = Utilities.getObject( 'rgb' );

        if ( rgb )
            {
            return rgb;
            }

        else
            {
            return null;
            }
        }


    export function loadBrushesValues( brushes: Paint.PreviousBrushSettings[] )
        {
        try
            {
            var brushesValues = Utilities.getObject( 'brushes_values' );
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
            brushes[ a ].previousSettings = brushesValues[ a ].previousValues;
            }
        }


    export function getSelectedBrush()
        {
        var selectedBrush = Utilities.getObject( 'selected_brush' );

        if ( selectedBrush && $.isNumeric( selectedBrush ) )
            {
            return selectedBrush;
            }

        else
            {
            return 0;
            }
        }


    export function loadCanvasImage()
        {
        var canvas = Utilities.getObject( 'canvas' );
        var canvasWidth = Utilities.getObject( 'canvas_width' );
        var canvasHeight = Utilities.getObject( 'canvas_height' );

        if ( canvas && $.isNumeric( canvasWidth ) && $.isNumeric( canvasHeight ) )
            {
            var currentWidth = MAIN_CANVAS.width;
            var currentHeight = MAIN_CANVAS.height;

                // see if we need to increase the size of the canvas (to avoid loosing part of the image)
            if ( currentWidth < canvasWidth )
                {
                MAIN_CANVAS.width = DRAW_CANVAS.width = canvasWidth;
                }

            if ( currentHeight < canvasHeight )
                {
                MAIN_CANVAS.height = DRAW_CANVAS.height = canvasHeight;
                }

            var img = new Image();

            img.src = canvas;
            img.onload = function()
                {
                MAIN_CTX.drawImage( img, 0, 0 );
                };
            }
        }
    }
