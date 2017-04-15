interface NeighborPointsBrushArgs extends BrushArgs
    {
    opacity: number[];
    thickness: number[];
    shadowBlur: number;
    distance: number;
    }


class NeighborPointsBrush implements Brush
    {
    all_points: Point[]
    additional_lines: Line[];
    secondaryLinesStyle: string;
    secondaryLinesWidth: number;
    opacity_control: Control;
    thickness_control: Control;
    shadow_blur_control: Control;
    distance_control: Control;
    all_controls: Control[];


    constructor( args: NeighborPointsBrushArgs )
        {
        if ( typeof args.opacity == 'undefined' )
            {
            args.opacity = [ 0.25, 1 ];
            }

        if ( typeof args.thickness == 'undefined' )
            {
            args.thickness = [ 1.5, 5 ];
            }

        if ( typeof args.shadowBlur == 'undefined' )
            {
            args.shadowBlur = 0;
            }

        if ( typeof args.distance == 'undefined' )
            {
            args.distance = 30;
            }

            // init stuff
        this.all_points = [];   // the main line
        this.additional_lines = [];  // the lines between the close points of the main line

            // add the controls
        var container1 = <HTMLElement> document.querySelector( '#brushControls1' );
        var container2 = <HTMLElement> document.querySelector( '#brushControls2' );

        this.opacity_control = new Control({
                id: 'opacity',
                label: 'Opacity:',
                minValue: 0,
                maxValue: 1,
                initValue: args.opacity,
                step: 0.05,
                container: container1,
                onSlideFunction: function() { Paint.updateCurrentColor(); }
            });
        this.thickness_control = new Control({
                id: 'thickness',
                label: 'Thickness:',
                minValue: 0.5,
                maxValue: 30,
                initValue: args.thickness,
                step: 0.5,
                container: container1
            });
        this.shadow_blur_control = new Control({
                id: 'shadowBlur',
                label: 'Shadow Blur:',
                minValue: 0,
                maxValue: 10,
                initValue: args.shadowBlur,
                step: 0.5,
                container: container1
            });
        this.distance_control = new Control({
                id: 'distance',
                label: 'Distance:',
                minValue: 10,
                maxValue: 100,
                initValue: args.distance,
                step: 1,
                container: container2
            });

        this.all_controls = [ this.opacity_control, this.thickness_control, this.shadow_blur_control, this.distance_control ];
        }


    startDraw( event: MouseEvent )
        {
        this.all_points.push({
                x: event.pageX,
                y: event.pageY
            });

        DRAW_CTX.save();

        var color;

            // the secondary lines will have different styling (less pronounced)
        var mainLineOpacity = this.opacity_control.getUpperValue();
        var secondaryLinesOpacity = this.opacity_control.getLowerValue();

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

        var mainColorCss = Utilities.toCssColor( color.red, color.green, color.blue, mainLineOpacity );

        this.secondaryLinesStyle = Utilities.toCssColor( color.red, color.green, color.blue, secondaryLinesOpacity );
        this.secondaryLinesWidth = this.thickness_control.getLowerValue();

        DRAW_CTX.beginPath();
        DRAW_CTX.strokeStyle = mainColorCss;
        DRAW_CTX.lineCap = 'round';
        DRAW_CTX.lineJoin = 'round';
        DRAW_CTX.lineWidth = this.thickness_control.getUpperValue();
        DRAW_CTX.shadowBlur = this.shadow_blur_control.getUpperValue();
        DRAW_CTX.shadowColor = mainColorCss;
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

            DRAW_CTX.quadraticCurveTo( point1.x, point1.y, midPointX, midPointY);

            point1 = this.all_points[ a ];
            point2 = this.all_points[ a + 1 ];
            }

        DRAW_CTX.stroke();


        var lastPoint = this.all_points[ this.all_points.length - 1 ];

            // find lines/points close to the last one (which was just added)
        for (a = 0 ; a < this.all_points.length ; a++)
            {
            var point = this.all_points[ a ];

                // construct a triangle, to check the distance between points (the current one, with others previously saved)
            var adjacent = point.x - lastPoint.x;
            var opposite = point.y - lastPoint.y;

                // the distance would be the square root of this. we don't do that as an optimization
            var distance = adjacent * adjacent + opposite * opposite;
            var distanceLimit = this.distance_control.getUpperValue();

            if ( distance < distanceLimit * distanceLimit )
                {
                this.additional_lines.push({
                        x1: lastPoint.x,
                        y1: lastPoint.y,
                        x2: point.x,
                        y2: point.y,
                        distanceX: adjacent,
                        distanceY: opposite
                    });
                }
            }


            // save the main styling
        DRAW_CTX.save();

        DRAW_CTX.strokeStyle = this.secondaryLinesStyle;
        DRAW_CTX.lineWidth = this.secondaryLinesWidth;

            // draw all the additional lines
        for (a = 0 ; a < this.additional_lines.length ; a++)
            {
            var line = this.additional_lines[ a ];

            DRAW_CTX.moveTo( line.x1 + line.distanceX * 0.2, line.y1 + line.distanceY * 0.2 );
            DRAW_CTX.lineTo( line.x2 - line.distanceX * 0.2, line.y2 - line.distanceY * 0.2 );
            }

        DRAW_CTX.stroke();
        DRAW_CTX.restore();
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
        this.additional_lines.length = 0;
        };


    getSettings()
        {
        var settings: Settings = {};

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