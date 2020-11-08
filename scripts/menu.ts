namespace Menu {
    var BRUSHES_CONTAINER: HTMLElement;
    var SAVE_CANVAS: HTMLElement;
    var ERASE_BRUSH: HTMLElement;

    export function init() {
        SAVE_CANVAS = document.getElementById("saveCanvas")!;
        ERASE_BRUSH = document.getElementById("erase")!;
        var clear = document.getElementById("clearCanvas")!;
        var exportCanvas = document.getElementById("exportCanvas")!;

        SAVE_CANVAS.onclick = Paint.saveCanvas;
        ERASE_BRUSH.onclick = Paint.eraseBrush;
        clear.onclick = Paint.clearCanvas;
        exportCanvas.onclick = Paint.exportCanvas;

        // :: Brushes menu :: //

        BRUSHES_CONTAINER = document.getElementById("BrushesContainer")!;

        // set the click listeners on the menu elements
        for (var a = 0; a < BRUSHES_CONTAINER.children.length; a++) {
            let item = <HTMLElement>BRUSHES_CONTAINER.children[a];
            let position = a; // capture the value
            item.onclick = function () {
                Paint.selectBrush(position);
            };
        }
    }

    /**
     * Remove the selection styling from a brush entry on the menu.
     */
    export function unselectBrush(position: number) {
        BRUSHES_CONTAINER.children[position].classList.remove("selected");
    }

    /**
     * Add the selection styling to a brush entry on the menu.
     */
    export function selectBrush(position: number) {
        BRUSHES_CONTAINER.children[position].classList.add("selected");
    }

    export function updateCurrentColor() {
        var colorContainer = document.getElementById("ColorPicker")!;

        // get the elements to change the background color
        var sliderHandles = colorContainer.querySelectorAll(
            ".ui-slider-handle"
        );
        var sliderRanges = colorContainer.querySelectorAll(".ui-slider-range");

        // convert from nodelist to array
        var handlesArray = Array.prototype.slice.call(sliderHandles);
        var rangesArray = Array.prototype.slice.call(sliderRanges);

        // merge the 2 arrays
        var elements = handlesArray.concat(rangesArray);

        // get the color
        var color = Color.getValues();
        var opacity = Paint.getOpacityValue();

        // means its a range (min/max value), so get the max value
        if (opacity instanceof Array) {
            opacity = opacity[1];
        }

        var colorCss = Utilities.toCssColor(
            color.red,
            color.green,
            color.blue,
            opacity
        );

        // change the background color
        for (var a = 0; a < elements.length; a++) {
            $(elements[a]).css("background", colorCss);
        }
    }

    export function setSaveCanvasState(state: boolean) {
        if (state === true) {
            SAVE_CANVAS.classList.remove("off");
            SAVE_CANVAS.classList.add("on");
        } else {
            SAVE_CANVAS.classList.remove("on");
            SAVE_CANVAS.classList.add("off");
        }
    }

    export function setEraseBrushState(state: boolean) {
        if (state === true) {
            ERASE_BRUSH.classList.remove("off");
            ERASE_BRUSH.classList.add("on");
        } else {
            ERASE_BRUSH.classList.remove("on");
            ERASE_BRUSH.classList.add("off");
        }
    }
}
