import * as Utilities from "./utilities";
import * as Paint from "./paint";
import * as Color from "./color";

let BRUSHES_CONTAINER: HTMLElement;
let SAVE_CANVAS: HTMLElement;
let ERASE_BRUSH: HTMLElement;

export function init() {
    SAVE_CANVAS = document.getElementById("saveCanvas")!;
    ERASE_BRUSH = document.getElementById("erase")!;
    const clear = document.getElementById("clearCanvas")!;
    const exportCanvas = document.getElementById("exportCanvas")!;

    SAVE_CANVAS.onclick = Paint.saveCanvas;
    ERASE_BRUSH.onclick = Paint.eraseBrush;
    clear.onclick = Paint.clearCanvas;
    exportCanvas.onclick = Paint.exportCanvas;

    // :: Brushes menu :: //

    BRUSHES_CONTAINER = document.getElementById("BrushesContainer")!;

    // set the click listeners on the menu elements
    for (let a = 0; a < BRUSHES_CONTAINER.children.length; a++) {
        const item = <HTMLElement>BRUSHES_CONTAINER.children[a];
        const position = a; // capture the value
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
    const colorContainer = document.getElementById("ColorPicker")!;

    // get the elements to change the background color
    const sliderHandles = colorContainer.querySelectorAll(".ui-slider-handle");
    const sliderRanges = colorContainer.querySelectorAll(".ui-slider-range");

    // convert from nodelist to array
    const handlesArray = Array.prototype.slice.call(sliderHandles);
    const rangesArray = Array.prototype.slice.call(sliderRanges);

    // merge the 2 arrays
    const elements = handlesArray.concat(rangesArray);

    // get the color
    const color = Color.getValues();
    let opacity = Paint.getOpacityValue();

    // means its a range (min/max value), so get the max value
    if (opacity instanceof Array) {
        opacity = opacity[1];
    }

    const colorCss = Utilities.toCssColor(
        color.red,
        color.green,
        color.blue,
        opacity
    );

    // change the background color
    for (let a = 0; a < elements.length; a++) {
        elements[a].style.background = colorCss;
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
