(function(window)
{
var Color = {
        red: null,
        green: null,
        blue: null
    };

Color.getValues = function()
{
return {
        red: Color.red.getValue(),
        green: Color.green.getValue(),
        blue: Color.blue.getValue()
    };
};


Color.init = function()
{
var container = document.querySelector( '#ColorPicker' );

Color.red = new Control({
        name: 'Red',
        minValue: 0,
        maxValue: 255,
        initValue: 0,
        step: 1,
        container: container,
        cssClass: 'red',
        onSlideFunction: function() { Paint.updateCurrentColor(); }
    });

Color.green = new Control({
        name: 'Green',
        minValue: 0,
        maxValue: 255,
        initValue: 0,
        step: 1,
        container: container,
        cssClass: 'green',
        onSlideFunction: function() { Paint.updateCurrentColor(); }
    });

Color.blue = new Control({
        name: 'Blue',
        minValue: 0,
        maxValue: 255,
        initValue: 0,
        step: 1,
        container: container,
        cssClass: 'blue',
        onSlideFunction: function() { Paint.updateCurrentColor(); }
    });
};



window.Color = Color;

}(window));