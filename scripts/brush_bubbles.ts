interface BubblesBrushArgs
    {
    opacity: number[];
    radius: number[];
    }


class BubblesBrush implements Brush
    {
    all_points: Point[];
    minimum_radius: number;
    maximum_radius: number;
    minimum_opacity: number;
    maximum_opacity: number;
    opacity_control: Control;
    radius_control: Control;
    all_controls: Control[];


    constructor( args: BubblesBrushArgs )
        {
        var opacityId = 'opacity';
        var radiusId = 'radius';

        if ( typeof args[ opacityId ] == 'undefined' )
            {
            args[ opacityId ] = [ 0.25, 1 ];
            }

        if ( typeof args[ radiusId ] == 'undefined' )
            {
            args[ radiusId ] = [ 5, 10 ];
            }


        this.all_points = [];
        this.minimum_radius = args[ radiusId ][ 0 ];
        this.maximum_radius = args[ radiusId ][ 1 ];
        this.minimum_opacity = args[ opacityId ][ 0 ];
        this.maximum_opacity = args[ opacityId ][ 1 ];

            // add the controls
        var container = document.querySelector( '#brushControls1' );

        this.opacity_control = new Control({
                id: opacityId,
                name: 'Opacity:',
                minValue: 0,
                maxValue: 1,
                initValue: args[ opacityId ],
                step: 0.1,
                container: container,
                onSlideFunction: function() { Paint.updateCurrentColor() }
            });
        this.radius_control = new Control({
                id: radiusId,
                name: 'Radius:',
                minValue: 1,
                maxValue: 20,
                initValue: args[ radiusId ],
                step: 0.5,
                container: container
            });

        this.all_controls = [ this.opacity_control, this.radius_control ];
        }


    startDraw( event: MouseEvent )
        {
        this.all_points.push({
                x : event.pageX,
                y : event.pageY,
                radius  : Utilities.getRandomInt( this.minimum_radius, this.maximum_radius ),
                opacity : Utilities.getRandomFloat( this.minimum_opacity, this.maximum_opacity )
            });

            // before making changes to the styling, call context.save(), to save the previous state (we'll restore at the end)
        DRAW_CTX.save();

        var color;

            // when we're erasing, we draw unto the draw canvas with a white color, and later what was drawn is removed/erased from the main canvas
        if ( Paint.isEraseBrush() )
            {
            color = {
                    red: 255,
                    green: 255,
                    blue: 255
                };
            }

            // otherwise just get the color from the color picker in the menu
        else
            {
            color = Color.getValues();
            }

        DRAW_CTX.beginPath();
        DRAW_CTX.fillStyle = Utilities.toCssColor( color.red, color.green, color.blue );

        this.minimum_opacity = this.opacity_control.getLowerValue();
        this.maximum_opacity = this.opacity_control.getUpperValue();

        this.minimum_radius = this.radius_control.getLowerValue();
        this.maximum_radius = this.radius_control.getUpperValue();
        }


    duringDraw( event: MouseEvent )
        {
        DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

        this.all_points.push({
                x : event.pageX,
                y : event.pageY,
                radius  : Utilities.getRandomInt( this.minimum_radius, this.maximum_radius ),
                opacity : Utilities.getRandomFloat( this.minimum_opacity, this.maximum_opacity )
            });

            // draw the line
        for (var a = 0 ; a < this.all_points.length ; a++)
            {
            var circle = this.all_points[ a ];

            DRAW_CTX.beginPath();
            DRAW_CTX.globalAlpha = circle.opacity;
            DRAW_CTX.arc( circle.x, circle.y, circle.radius, 0, Math.PI * 2 );
            DRAW_CTX.fill();
            }
        }


    endDraw( event: MouseEvent )
        {
            // draw what is in the draw canvas into the main one
        MAIN_CTX.save();

        if ( Paint.isEraseBrush() )
            {
            MAIN_CTX.globalCompositeOperation = 'destination-out';
            }

        MAIN_CTX.drawImage( DRAW_CANVAS, 0, 0 );
        MAIN_CTX.restore();

        DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

            // we're done with drawing, so restore the previous styling
        DRAW_CTX.restore();

        this.all_points.length = 0;
        }


    getSettings()
        {
        var settings = {};

        for (var a = 0 ; a < this.all_controls.length ; a++)
            {
            var control = this.all_controls[ a ];

            settings[ control.id ] = control.getValue();
            }

        return settings;
        }


    clear()
        {
        for (var a = 0 ; a < this.all_controls.length ; a++)
            {
            this.all_controls[ a ].clear();
            }
        }
    }
