interface ControlArgs
    {
    id: string;
    name: string;
    minValue: number;
    maxValue: number;
    initValue: number | number[];
    step?: number;
    container: HTMLElement;
    onSlideFunction: () => void;
    cssClass: string;
    }


class Control
    {
    id: string;
    value: number | number[];
    mainContainer: HTMLElement;
    thicknessContainer: HTMLElement;


    /*
        If initValue is an array, means its a range slider (has a minimum and maximum value, otherwise is a single value slider

        The return of .getValue() also depends on the type of slider, if its a single value slider it returns a number, otherwise an array with the min/max values
    */
    constructor( args: ControlArgs )
        {
        var _this = this;

        if ( typeof args.step == 'undefined' )
            {
            args.step = 1;
            }

            // find number of digits past the decimal point
        var stepStr = args.step.toString();
        var digits = 0;
        var pointIndex = stepStr.indexOf( '.' );

            // found the decimal point, so its not a whole number
        if ( pointIndex >= 0 )
            {
            digits = stepStr.length - pointIndex - 1;
            }

        this.id = args.id;
        this.value = args.initValue;


        var container = args.container;

        var controlContainer = document.createElement( 'div' );
        var controlText = document.createElement( 'span' );
        var controlValue = document.createElement( 'span' );
        var controlSlider = document.createElement( 'div' );

        $( controlText ).text( args.name );

        $( controlContainer ).addClass( 'Control' );

        if ( args.cssClass )
            {
            $( controlContainer ).addClass( args.cssClass );
            }

        controlContainer.appendChild( controlText );
        controlContainer.appendChild( controlValue );
        controlContainer.appendChild( controlSlider );

        container.appendChild( controlContainer );

        this.mainContainer = container;
        this.thicknessContainer = controlContainer;

        var sliderOptions = {
            min   : args.minValue,
            max   : args.maxValue,
            step  : args.step
            };

            // functions used to set the text with the values
        var rangeSliderText = function( min: number, max: number )
            {
            $( controlValue ).text( min.toFixed( digits ) + ', ' + max.toFixed( digits ) );
            };

        var singleSliderText = function( value: number )
            {
            $( controlValue ).text( value.toFixed( digits ) );
            };


            // means its a range slider
        if ( args.initValue instanceof Array )
            {
            sliderOptions.range = true;
            sliderOptions.values = args.initValue;
            sliderOptions.slide = function( event, ui )
                {
                var min = ui.values[ 0 ];
                var max = ui.values[ 1 ];

                rangeSliderText( min, max );

                _this.value = [ min, max ];

                if ( args.onSlideFunction )
                    {
                    args.onSlideFunction( event, ui );
                    }
                };

            rangeSliderText( args.initValue[ 0 ], args.initValue[ 1 ] );
            }

            // single value slider
        else
            {
            sliderOptions.range = 'min';
            sliderOptions.value = args.initValue;
            sliderOptions.slide = function( event, ui )
                {
                singleSliderText( ui.value );

                _this.value = ui.value;

                if ( args.onSlideFunction )
                    {
                    args.onSlideFunction( event, ui );
                    }
                };

            singleSliderText( args.initValue );
            }


        $( controlSlider ).slider( sliderOptions );
        }


    getValue()
        {
        return this.value;
        }


    clear()
        {
        this.mainContainer.removeChild( this.thicknessContainer );
        }
    }
