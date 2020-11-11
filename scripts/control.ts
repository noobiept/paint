export interface ControlArgs {
    id: string;
    minValue: number;
    maxValue: number;
    initValue: number | number[];
    container: HTMLElement;

    label?: string; // if not provided, then the 'id' is used
    onSlideFunction?: (event: Event, ui: JQueryUI.SliderUIParams) => void;
    cssClass?: string;
    step?: number;
}

export default class Control {
    id: string;
    lowerValue: number;
    upperValue: number;
    mainContainer: HTMLElement;
    thicknessContainer: HTMLElement;
    isRangeControl: boolean;

    /**
     * If 'initValue' is an array, means its a range slider (has a lower and upper value, otherwise its a single value slider.
     */
    constructor(args: ControlArgs) {
        var _this = this;

        if (typeof args.step == "undefined") {
            args.step = 1;
        }

        if (typeof args.label === "undefined") {
            args.label = args.id;
        }

        // find number of digits past the decimal point
        var stepStr = args.step.toString();
        var digits = 0;
        var pointIndex = stepStr.indexOf(".");

        // found the decimal point, so its not a whole number
        if (pointIndex >= 0) {
            digits = stepStr.length - pointIndex - 1;
        }

        this.id = args.id;

        var container = args.container;
        var controlContainer = document.createElement("div");
        var controlText = document.createElement("span");
        var controlValue = document.createElement("span");
        var controlSlider = document.createElement("div");

        $(controlText).text(args.label);
        $(controlContainer).addClass("Control");

        if (args.cssClass) {
            $(controlContainer).addClass(args.cssClass);
        }

        controlContainer.appendChild(controlText);
        controlContainer.appendChild(controlValue);
        controlContainer.appendChild(controlSlider);

        container.appendChild(controlContainer);

        this.mainContainer = container;
        this.thicknessContainer = controlContainer;

        var sliderOptions: JQueryUI.SliderOptions = {
            min: args.minValue,
            max: args.maxValue,
            step: args.step,
        };

        // functions used to set the text with the values
        var rangeSliderText = function (min: number, max: number) {
            $(controlValue).text(
                min.toFixed(digits) + ", " + max.toFixed(digits)
            );
        };

        var singleSliderText = function (value: number) {
            $(controlValue).text(value.toFixed(digits));
        };

        // means its a range slider
        if (args.initValue instanceof Array) {
            this.isRangeControl = true;
            this.lowerValue = args.initValue[0];
            this.upperValue = args.initValue[1];

            sliderOptions.range = true;
            sliderOptions.values = args.initValue;
            sliderOptions.slide = function (event, ui) {
                var min = ui.values![0];
                var max = ui.values![1];

                rangeSliderText(min, max);

                _this.lowerValue = min;
                _this.upperValue = max;

                if (args.onSlideFunction) {
                    args.onSlideFunction(event, ui);
                }
            };

            rangeSliderText(args.initValue[0], args.initValue[1]);
        }

        // single value slider
        else {
            this.isRangeControl = false;
            this.upperValue = this.lowerValue = args.initValue;

            sliderOptions.range = "min";
            sliderOptions.value = args.initValue;
            sliderOptions.slide = function (event, ui) {
                singleSliderText(ui.value!);

                _this.upperValue = _this.lowerValue = ui.value!;

                if (args.onSlideFunction) {
                    args.onSlideFunction(event, ui);
                }
            };

            singleSliderText(args.initValue);
        }

        $(controlSlider).slider(sliderOptions);
    }

    /**
     * On single value controls, the upper and lower value is the same.
     */
    getUpperValue() {
        return this.upperValue;
    }

    /**
     * On single value controls, the upper and lower value is the same.
     */
    getLowerValue() {
        return this.lowerValue;
    }

    /**
     * The return value depends on the type of slider, if its a single value slider it returns a number, otherwise an array with the lower/upper values.
     */
    getValue() {
        if (this.isRangeControl) {
            return [this.lowerValue, this.upperValue];
        }

        return this.upperValue;
    }

    clear() {
        this.mainContainer.removeChild(this.thicknessContainer);
    }
}
