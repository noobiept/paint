interface LineBrushArgs
    {
    opacity: number;
    thickness: number;
    shadowBlur: number;
    }


class LineBrush implements Brush
    {
    opacity_control: Control;
    thickness_control: Control;
    shadow_blur_control: Control;
    all_points: Point[];
    all_controls: Control[];


    constructor( args: LineBrushArgs )
        {
        if ( typeof args.opacity == 'undefined' )
            {
            args.opacity = 1;
            }

        if ( typeof args.thickness == 'undefined' )
            {
            args.thickness = 5;
            }

        if ( typeof args.shadowBlur == 'undefined' )
            {
            args.shadowBlur = 0;
            }


            // add controls
        var container = <HTMLElement> document.querySelector( '#brushControls1' );

        this.opacity_control = new Control({
                id: 'opacity',
                name: 'Opacity:',
                minValue: 0,
                maxValue: 1,
                initValue: args.opacity,
                step: 0.1,
                container: container,
                onSlideFunction: function() { Paint.updateCurrentColor(); }
            });
        this.thickness_control = new Control({
                id: 'thickness',
                name: 'Thickness:',
                minValue: 0.5,
                maxValue: 30,
                initValue: args.thickness,
                step: 0.5,
                container: container
            });
        this.shadow_blur_control = new Control({
                id: 'shadowBlur',
                name: 'Shadow Blur:',
                minValue: 0,
                maxValue: 10,
                initValue: args.shadowBlur,
                step: 0.5,
                container: container
            });

                // init stuff
        this.all_points = [];

        this.all_controls = [ this.opacity_control, this.thickness_control, this.shadow_blur_control ];
        }


    startDraw( event: MouseEvent )
        {
        this.all_points.push({
                x: event.pageX,
                y: event.pageY
            });

        DRAW_CTX.save();

        var color;
        var opacity = this.opacity_control.getUpperValue();

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

        var colorCss = Utilities.toCssColor( color.red, color.green, color.blue, opacity );

        DRAW_CTX.beginPath();
        DRAW_CTX.strokeStyle = colorCss;
        DRAW_CTX.lineCap = 'round';
        DRAW_CTX.lineJoin = 'round';
        DRAW_CTX.lineWidth = this.thickness_control.getUpperValue();
        DRAW_CTX.shadowBlur = this.shadow_blur_control.getUpperValue();
        DRAW_CTX.shadowColor = colorCss;
        }


    duringDraw( event: MouseEvent )
        {
        DRAW_CTX.clearRect( 0, 0, DRAW_CANVAS.width, DRAW_CANVAS.height );

        this.all_points.push({
                x: event.pageX,
                y: event.pageY
            });

            // draw the line

        var point1 = this.all_points[ 0 ];
        var point2 = this.all_points[ 1 ];


        DRAW_CTX.beginPath();
        DRAW_CTX.moveTo( point1.x, point1.y );

        for (var a = 1 ; a < this.all_points.length ; a++)
            {
            var midPointX = Math.floor( (point1.x + point2.x) / 2 );
            var midPointY = Math.floor( (point1.y + point2.y) / 2 );

            DRAW_CTX.quadraticCurveTo( point1.x, point1.y, midPointX, midPointY );

            point1 = this.all_points[ a ];
            point2 = this.all_points[ a + 1 ];
            }

        DRAW_CTX.stroke();
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
        };


    getSettings()
        {
        var settings: Settings = {};

        for (var a = 0 ; a < this.all_controls.length ; a++)
            {
            var control = this.all_controls[ a ];

                // this assumes the setting key is the same string as the control id
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