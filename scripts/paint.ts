namespace Paint
    {
    var BRUSHES = [
            {
                Class: LineBrush,
                previousValues: {}
            },
            {
                Class: NeighborPointsBrush,
                previousValues: {}
            },
            {
                Class: BubblesBrush,
                previousValues: {}
            },
            {
                Class: LinePatternBrush,
                previousValues: {}
            },
            {
                Class: SprayBrush,
                previousValues: {}
            }
        ];

    var BRUSH_SELECTED = 0;
    var BRUSH_OBJECT = null;

    var IS_MOUSE_DOWN = false;


    var SAVE_CANVAS = false;
    var ERASE_BRUSH = false;    // if the current selected brush is used to draw or to erase

    /**
        'savedCanvas' determines if we're going to load a saved canvas from the previous session (we need to know this to update the related button in the menu).
    */
    export function init( savedCanvas: boolean )
        {
        SaveLoad.loadBrushesValues( BRUSHES );

        var menu = document.querySelector( '#Menu' );

        var saveCanvas = menu.querySelector( '#saveCanvas' );
        var eraseBrush = menu.querySelector( '#erase' );
        var clear = menu.querySelector( '#clearCanvas' );
        var exportCanvas = menu.querySelector( '#exportCanvas' );

        saveCanvas.onclick = Paint.saveCanvas;
        eraseBrush.onclick = Paint.eraseBrush;
        clear.onclick = Paint.clearCanvas;
        exportCanvas.onclick = Paint.exportCanvas;

        if ( savedCanvas == true )
            {
                // the default is being off, so by calling the .saveCanvas() function we turn in to on
            Paint.saveCanvas();
            }

            // :: Brushes menu :: //

        var brushesContainer = menu.querySelector( '#BrushesContainer' );

        var brushes = brushesContainer.querySelectorAll( '.button' );

            // start with the previously selected brush, or with the first brush (if fresh start)
        var position = SaveLoad.getSelectedBrush();

        var selected = brushes[ position ];


        var selectBrushFunction = function( position, htmlElement )
            {
                // this has a function within, to create a closure, so that the arguments are retained (otherwise in the loop below it wouldn't work, all would get the last value of 'a')
            return function()
                {
                $( selected ).removeClass( 'selected' );
                $( htmlElement ).addClass( 'selected' );

                selected = htmlElement;

                Paint.selectBrush( position );
                };
            };


        for (var a = 0 ; a < brushes.length ; a++)
            {
            brushes[ a ].onclick = selectBrushFunction( a, brushes[ a ] );
            }

        selectBrushFunction( position, selected )();


        Paint.updateCurrentColor();
        }


    export function startDraw( event )
        {
        IS_MOUSE_DOWN = true;

        event.preventDefault();

        return BRUSH_OBJECT.startDraw( event );
        }


    export function duringDraw( event )
        {
        if ( IS_MOUSE_DOWN )
            {
            event.preventDefault();

            BRUSH_OBJECT.duringDraw( event );
            }
        }


    export function endDraw( event )
        {
        IS_MOUSE_DOWN = false;

        event.preventDefault();

        return BRUSH_OBJECT.endDraw( event );
        }


    export function selectBrush( brushPosition )
        {
            // deal the previous brush (clear it, and save the values that were set for next time this brush is selected)
        if ( BRUSH_OBJECT )
            {
            var current = BRUSHES[ BRUSH_SELECTED ];

            current.previousValues = BRUSH_OBJECT.getSettings();

            BRUSH_OBJECT.clear();
            }


        var next = BRUSHES[ brushPosition ];

        BRUSH_SELECTED = brushPosition;
        BRUSH_OBJECT = new next.Class( next.previousValues );

        Paint.updateCurrentColor();
        }


    export function updateCurrentColor()
        {
        var colorContainer = document.querySelector( '#ColorPicker' );

            // get the elements to change the background color
        var sliderHandles = colorContainer.querySelectorAll( '.ui-slider-handle' );
        var sliderRanges = colorContainer.querySelectorAll( '.ui-slider-range' );

            // convert from nodelist to array
        var handlesArray = Array.prototype.slice.call( sliderHandles );
        var rangesArray = Array.prototype.slice.call( sliderRanges );

            // merge the 2 arrays
        var elements = handlesArray.concat( rangesArray );

            // get the color
        var color = Color.getValues();

        var opacity = BRUSH_OBJECT.opacity_control.getValue();

            // means its a range (min/max value), so get the max value
        if ( opacity instanceof Array )
            {
            opacity = opacity[ 1 ];
            }

        var colorCss = toCssColor( color.red, color.green, color.blue, opacity );

            // change the background color
        for (var a = 0 ; a < elements.length ; a++)
            {
            $( elements[ a ] ).css( 'background', colorCss );
            }
        }


    export function getBrushesValues()
        {
            // update the .previousValues of the current selected brush (since we only update when switching between brushes)
        if ( BRUSH_OBJECT )
            {
            BRUSHES[ BRUSH_SELECTED ].previousValues = BRUSH_OBJECT.getSettings();
            }

        var values = [];

        for (var a = 0 ; a < BRUSHES.length ; a++)
            {
            values.push({
                    previousValues: BRUSHES[ a ].previousValues
                });
            }

        return values;
        }


    export function getSelectedBrush()
        {
        return BRUSH_SELECTED;
        }


    /*
        Clears all elements from the canvas
    */
    export function clearCanvas()
        {
        MAIN_CTX.clearRect( 0, 0, MAIN_CANVAS.width, MAIN_CANVAS.height );
        }


    /*
        Opens a new tab with the image (so that you can just right-click on the image and save it to the computer)
    */
    export function exportCanvas()
        {
        var image = MAIN_CANVAS.toDataURL( "image/png" );

        window.open( image, '_newtab' );
        }


    export function saveCanvas()
        {
        var saveCanvas = $( '#saveCanvas' );

        if ( saveCanvas.hasClass( 'off' ) )
            {
            saveCanvas.removeClass( 'off' );
            saveCanvas.addClass( 'on' );

            SAVE_CANVAS = true;
            }

        else
            {
            saveCanvas.removeClass( 'on' );
            saveCanvas.addClass( 'off' );

            SAVE_CANVAS = false;
            }
        }


    export function eraseBrush()
        {
        var erase = $( '#erase' );

        if ( erase.hasClass( 'off' ) )
            {
            erase.removeClass( 'off' );
            erase.addClass( 'on' );

            ERASE_BRUSH = true;
            }

        else
            {
            erase.removeClass( 'on' );
            erase.addClass( 'off' );

            ERASE_BRUSH = false;
            }
        }


    export function savingCanvas()
        {
        return SAVE_CANVAS;
        }


    export function isEraseBrush()
        {
        return ERASE_BRUSH;
        }
    }