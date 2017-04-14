interface LinePatternBrushArgs
    {
    opacity?: number;
    thickness?: number;
    patternAngle?: number;
    patternThickness?: number;
    }


class LinePatternBrush implements Brush
    {
    all_points: Point[];
    opacity_control: Control;
    thickness_control: Control;
    angle_control: Control;
    pattern_thickness_control: Control;
    all_controls: Control[];


    constructor( args: LinePatternBrushArgs )
        {
        var opacityId = 'opacity';
        var thicknessId = 'thickness';
        var patternAngleId = 'patternAngle';
        var patternThicknessId = 'patternThickness';

        if ( typeof args[ opacityId ] == 'undefined' )
            {
            args[ opacityId ] = 1;
            }

        if ( typeof args[ thicknessId ] == 'undefined' )
            {
            args[ thicknessId ] = 10;
            }

        if ( typeof args[ patternAngleId ] == 'undefined' )
            {
            args[ patternAngleId ] = 0;
            }

        if ( typeof args[ patternThicknessId ] == 'undefined' )
            {
            args[ patternThicknessId ] = 5;
            }

        this.all_points = [];

        var container1 = document.querySelector( '#brushControls1' );
        var container2 = document.querySelector( '#brushControls2' );

            // main line
        this.opacity_control = new Control({
                id: opacityId,
                name: 'Opacity:',
                minValue: 0,
                maxValue: 1,
                initValue: args[ opacityId ],
                step: 0.1,
                container: container1,
                onSlideFunction: function() { Paint.updateCurrentColor(); }
            });
        this.thickness_control = new Control({
                id: thicknessId,
                name: 'Thickness:',
                minValue: 0.5,
                maxValue: 30,
                initValue: args[ thicknessId ],
                step: 0.5,
                container: container1
            });

            // pattern
        this.angle_control = new Control({
                id: patternAngleId,
                name: 'Pattern Angle:',
                minValue: 0,
                maxValue: 135,
                initValue: args[ patternAngleId ],
                step: 45,
                container: container2
            });
        this.pattern_thickness_control = new Control({
                id: patternThicknessId,
                name: 'Pattern Thickness:',
                minValue: 0.5,
                maxValue: 10,
                initValue: args[ patternThicknessId ],
                step: 0.5,
                container: container2
            });

        this.all_controls = [ this.opacity_control, this.thickness_control, this.angle_control, this.pattern_thickness_control ];
        }


    getPattern()
        {
        var lineWidth = this.pattern_thickness_control.getValue();
        var angle = this.angle_control.getValue();
        var color;
        var opacity = this.opacity_control.getValue();

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

        var width = 15;
        var height = 15;

        var pattern = document.createElement( 'canvas' );

        pattern.width = width;
        pattern.height = height;

        var ctx = pattern.getContext( '2d' );

        ctx.beginPath();
        ctx.strokeStyle = colorCss;
        ctx.fillStyle = colorCss;
        ctx.lineWidth = lineWidth;

        var halfWidth = width / 2;
        var halfHeight = height / 2;

            // line centered
        if ( angle == 0 )
            {
            ctx.moveTo( 0, halfHeight );
            ctx.lineTo( width, halfHeight );
            ctx.stroke();
            }

            // diagonal
        else if ( angle == 45 )
            {
            ctx.moveTo( 0, 0 );
            ctx.lineTo( width, height );
            ctx.stroke();

            var opposite = lineWidth / 2;
            var angleRads = Math.PI / 4;

            var hypotenuse = opposite / Math.sin( angleRads );

            ctx.moveTo( 0, height - hypotenuse );
            ctx.lineTo( hypotenuse, height );
            ctx.lineTo( 0, height );

            ctx.moveTo( width - hypotenuse, 0 );
            ctx.lineTo( width, hypotenuse );
            ctx.lineTo( width, 0 );

            ctx.fill();
            }

            // line centered as well
        else if ( angle == 90 )
            {
            ctx.moveTo( halfWidth, 0 );
            ctx.lineTo( halfWidth, height );
            ctx.stroke();
            }

            // diagonal
        else if ( angle == 135 )
            {
            ctx.moveTo( 0, height );
            ctx.lineTo( width, 0 );
            ctx.stroke();

            var opposite = lineWidth / 2;
            var angleRads = Math.PI / 4;

            var hypotenuse = opposite / Math.sin( angleRads );

            ctx.moveTo( 0, 0 );
            ctx.lineTo( hypotenuse, 0 );
            ctx.lineTo( 0, hypotenuse );

            ctx.moveTo( width, height - hypotenuse );
            ctx.lineTo( width - hypotenuse, height );
            ctx.lineTo( width, height );

            ctx.fill();
            }


        return ctx.createPattern( pattern, 'repeat' );
        }


    startDraw( event: MouseEvent )
        {
        this.all_points.push({
                x: event.pageX,
                y: event.pageY
            });

        DRAW_CTX.save();

        DRAW_CTX.beginPath();
        DRAW_CTX.strokeStyle = this.getPattern();
        DRAW_CTX.lineCap = 'round';
        DRAW_CTX.lineJoin = 'round';
        DRAW_CTX.lineWidth = this.thickness_control.getValue();
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