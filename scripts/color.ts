interface ColorArgs
    {
    red: number;
    green: number;
    blue: number;
    }


namespace Color
    {
    var RED: Control;
    var GREEN: Control;
    var BLUE: Control;


    export function init( initialValues?: ColorArgs )
        {
        if ( typeof initialValues == 'undefined' || initialValues == null )
            {
            initialValues = {
                    red: 0,
                    green: 0,
                    blue: 0
                };
            }

        var container = <HTMLElement> document.querySelector( '#ColorPicker' );

        RED = new Control({
                name: 'Red',
                minValue: 0,
                maxValue: 255,
                initValue: initialValues.red,
                step: 1,
                container: container,
                cssClass: 'red',
                onSlideFunction: function() { Paint.updateCurrentColor(); }
            });

        GREEN = new Control({
                name: 'Green',
                minValue: 0,
                maxValue: 255,
                initValue: initialValues.green,
                step: 1,
                container: container,
                cssClass: 'green',
                onSlideFunction: function() { Paint.updateCurrentColor(); }
            });

        BLUE = new Control({
                name: 'Blue',
                minValue: 0,
                maxValue: 255,
                initValue: initialValues.blue,
                step: 1,
                container: container,
                cssClass: 'blue',
                onSlideFunction: function() { Paint.updateCurrentColor(); }
            });
        }


    export function getValues()
        {
        return {
                red: RED.getUpperValue(),
                green: GREEN.getUpperValue(),
                blue: BLUE.getUpperValue()
            };
        }
    }
