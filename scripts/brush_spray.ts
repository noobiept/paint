interface SprayBrushArgs extends BrushArgs
    {
    opacity: number[];
    radius: number;
    totalPoints: number;
    pointsLength: number;
    }


class SprayBrush implements Brush
    {
    currentX: number;
    currentY: number;
    interval_f: number | null;
    minimum_opacity: number;
    maximum_opacity: number;
    radius: number;
    points_length: number;
    total_points: number;
    opacity_control: Control;
    radius_control: Control;
    total_points_control: Control;
    points_length_control: Control;
    all_controls: Control[];


    constructor( args: SprayBrushArgs )
        {
        if ( typeof args.opacity == 'undefined' )
            {
            args.opacity = [0.25, 1];
            }

        if ( typeof args.radius == 'undefined' )
            {
            args.radius = 50;
            }

        if ( typeof args.totalPoints == 'undefined' )
            {
            args.totalPoints = 50;
            }

        if ( typeof args.pointsLength == 'undefined' )
            {
            args.pointsLength = 1;
            }

            // declaring the properties that will be used later on (the values will change from these, for example from the controls in the menu
        this.currentX = 0;
        this.currentY = 0;
        this.interval_f = null;
        this.minimum_opacity = args.opacity[ 0 ];
        this.maximum_opacity = args.opacity[ 1 ];
        this.radius = args.radius;
        this.total_points = args.totalPoints;

            // init. controls

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
        this.radius_control = new Control({
                id: 'radius',
                label: 'Radius:',
                minValue: 10,
                maxValue: 100,
                initValue: args.radius,
                step: 1,
                container: container1
            });
        this.total_points_control = new Control({
                id: 'totalPoints',
                label: 'Total Points:',
                minValue: 10,
                maxValue: 100,
                initValue: args.totalPoints,
                step: 1,
                container: container2
            });
        this.points_length_control = new Control({
                id: 'pointsLength',
                label: 'Points Length:',
                minValue: 1,
                maxValue: 5,
                initValue: args.pointsLength,
                step: 1,
                container: container2
            });

        this.all_controls = [ this.opacity_control, this.radius_control, this.total_points_control, this.points_length_control ];
        }


    startDraw( event: MouseEvent )
        {
        var this_ = this;

        this.currentX = event.pageX;
        this.currentY = event.pageY;

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

        this.minimum_opacity = this.opacity_control.getLowerValue();
        this.maximum_opacity = this.opacity_control.getUpperValue();

        this.radius = this.radius_control.getUpperValue();
        this.total_points = this.total_points_control.getUpperValue();
        this.points_length = this.points_length_control.getUpperValue();

        DRAW_CTX.beginPath();
        DRAW_CTX.lineCap = 'round';
        DRAW_CTX.lineJoin = 'round';
        DRAW_CTX.fillStyle = Utilities.toCssColor( color.red, color.green, color.blue );

            // keep adding points, until the mouse button stops being pressed
        this.interval_f = window.setInterval( function()
            {
            for (var a = 0 ; a < this_.total_points ; a++)
                {
                var angle = Utilities.getRandomFloat( 0, 2 * Math.PI );
                var distance = Utilities.getRandomInt( 0, this_.radius );

                DRAW_CTX.globalAlpha = Utilities.getRandomFloat( this_.minimum_opacity, this_.maximum_opacity );
                DRAW_CTX.fillRect(
                    this_.currentX + distance * Math.cos( angle ),
                    this_.currentY + distance * Math.sin( angle ),
                    this_.points_length,
                    this_.points_length
                    );
                }

            }, 50 );
        }


    duringDraw( event: MouseEvent )
        {
        this.currentX = event.pageX;
        this.currentY = event.pageY;
        }


    endDraw( event: MouseEvent )
        {
        window.clearInterval( this.interval_f );

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
        }


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