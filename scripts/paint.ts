namespace Paint
    {
    export interface PreviousBrushSettings
        {
        brushClass: { new( args: BrushArgs ): Brush };
        previousSettings: Settings;
        }


    var BRUSHES: PreviousBrushSettings[] = [
            {
                brushClass: LineBrush,
                previousSettings: {}
            },
            {
                brushClass: NeighborPointsBrush,
                previousSettings: {}
            },
            {
                brushClass: BubblesBrush,
                previousSettings: {}
            },
            {
                brushClass: LinePatternBrush,
                previousSettings: {}
            },
            {
                brushClass: SprayBrush,
                previousSettings: {}
            }
        ];

    var BRUSH_SELECTED = 0;
    var BRUSHES_CONTAINER: HTMLElement;
    var BRUSH_OBJECT: Brush | null = null;

    var IS_MOUSE_DOWN = false;


    var SAVE_CANVAS = false;
    var ERASE_BRUSH = false;    // if the current selected brush is used to draw or to erase

    /**
        'savedCanvas' determines if we're going to load a saved canvas from the previous session (we need to know this to update the related button in the menu).
    */
    export function init( savedCanvas: boolean )
        {
        SaveLoad.loadBrushesValues( BRUSHES );

        var saveCanvas = document.getElementById( 'saveCanvas' )!;
        var eraseBrush = document.getElementById( 'erase' )!;
        var clear = document.getElementById( 'clearCanvas' )!;
        var exportCanvas = document.getElementById( 'exportCanvas' )!;

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

        BRUSHES_CONTAINER = document.getElementById( 'BrushesContainer' )!;

            // start with the previously selected brush, or with the first brush (if fresh start)
        selectBrush( SaveLoad.getSelectedBrush() );

            // set the click listeners on the menu elements
        for (var a = 0 ; a < BRUSHES_CONTAINER.children.length ; a++)
            {
            let item = <HTMLElement> BRUSHES_CONTAINER.children[ a ];
            let position = a;   // capture the value
            item.onclick = function()
                {
                selectBrush( position );
                };
            }

        Paint.updateCurrentColor();

        document.body.onmousedown = startDraw;
        document.body.onmousemove = duringDraw;
        document.body.onmouseup = endDraw;
        document.body.onkeydown = keyboardShortcuts;
        }


    /**
     * Start drawing with the selected brush.
     */
    function startDraw( event: MouseEvent )
        {
        if ( event.button === Utilities.MouseButton.left )
            {
            IS_MOUSE_DOWN = true;
            event.preventDefault();

            return BRUSH_OBJECT!.startDraw( event );
            }
        }


    /**
     * Keep drawing while the mouse is being pressed.
     */
    function duringDraw( event: MouseEvent )
        {
        if ( IS_MOUSE_DOWN )
            {
            event.preventDefault();
            BRUSH_OBJECT!.duringDraw( event );
            }
        }


    /**
     * Finish the current draw path.
     */
    function endDraw( event: MouseEvent )
        {
        IS_MOUSE_DOWN = false;
        event.preventDefault();

        return BRUSH_OBJECT!.endDraw( event );
        }


    export function selectBrush( brushPosition: number )
        {
            // deal the previous brush (clear it, and save the values that were set for next time this brush is selected)
        if ( BRUSH_OBJECT )
            {
            var current = BRUSHES[ BRUSH_SELECTED ];

            current.previousSettings = BRUSH_OBJECT.getSettings();
            BRUSH_OBJECT.clear();

                // remove the selected styling
            BRUSHES_CONTAINER.children[ BRUSH_SELECTED ].classList.remove( 'selected' );
            }

        var next = BRUSHES[ brushPosition ];

        BRUSH_SELECTED = brushPosition;
        BRUSH_OBJECT = new next.brushClass( next.previousSettings );

        BRUSHES_CONTAINER.children[ brushPosition  ].classList.add( 'selected' );

        Paint.updateCurrentColor();
        }


    export function updateCurrentColor()
        {
        var colorContainer = document.getElementById( 'ColorPicker' )!;

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
        var opacity = BRUSH_OBJECT!.opacity_control.getValue();

            // means its a range (min/max value), so get the max value
        if ( opacity instanceof Array )
            {
            opacity = opacity[ 1 ];
            }

        var colorCss = Utilities.toCssColor( color.red, color.green, color.blue, opacity );

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
            BRUSHES[ BRUSH_SELECTED ].previousSettings = BRUSH_OBJECT.getSettings();
            }

        var values = [];

        for (var a = 0 ; a < BRUSHES.length ; a++)
            {
            values.push({
                    previousValues: BRUSHES[ a ].previousSettings
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


    /**
     * - `: Toggle erase mode.
     * - 1-5: Select a brush.
     */
    function keyboardShortcuts( event: KeyboardEvent )
        {
        var key = event.keyCode;

        switch( key )
            {
            case Utilities.KeyCode.graveAccent:
                eraseBrush();
                break;

            case Utilities.KeyCode.one:
                selectBrush( 0 );
                break;

            case Utilities.KeyCode.two:
                selectBrush( 1 );
                break;

            case Utilities.KeyCode.three:
                selectBrush( 2 );
                break;

            case Utilities.KeyCode.four:
                selectBrush( 3 );
                break;

            case Utilities.KeyCode.five:
                selectBrush( 4 );
                break;
            }
        }
    }
