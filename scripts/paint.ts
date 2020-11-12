import * as SaveLoad from "./save_load";
import * as Menu from "./menu";
import * as Utilities from "./utilities";
import { Brush, PreviousBrushSettings } from "./types";
import BubblesBrush from "./brush_bubbles";
import LineBrush from "./brush_line";
import LinePatternBrush from "./brush_line_pattern";
import NeighborPointsBrush from "./brush_neighbor_points";
import SprayBrush from "./brush_spray";

// main canvas, will contain the drawing with all the shapes
var MAIN_CANVAS: HTMLCanvasElement;
var MAIN_CTX: CanvasRenderingContext2D;

// draw canvas, used to show the line being drawn only
var DRAW_CANVAS: HTMLCanvasElement;
var DRAW_CTX: CanvasRenderingContext2D;

var BRUSHES: PreviousBrushSettings[] = [
    {
        brushClass: LineBrush,
        previousSettings: {},
    },
    {
        brushClass: NeighborPointsBrush,
        previousSettings: {},
    },
    {
        brushClass: BubblesBrush,
        previousSettings: {},
    },
    {
        brushClass: LinePatternBrush,
        previousSettings: {},
    },
    {
        brushClass: SprayBrush,
        previousSettings: {},
    },
];

var BRUSH_SELECTED = 0;
var BRUSH_OBJECT: Brush | null = null;
var IS_MOUSE_DOWN = false;

var SAVE_CANVAS = false;
var ERASE_BRUSH = false; // if the current selected brush is used to draw or to erase

/**
        'savedCanvas' determines if we're going to load a saved canvas from the previous session (we need to know this to update the related button in the menu).
    */
export function init(savedCanvas: boolean) {
    initCanvas(savedCanvas);
    SaveLoad.loadBrushesValues(BRUSHES);

    if (savedCanvas === true) {
        // the default is being off, so by calling the .saveCanvas() function we turn in to on
        saveCanvas();
    }

    // start with the previously selected brush, or with the first brush (if fresh start)
    selectBrush(SaveLoad.getSelectedBrush());
    Menu.updateCurrentColor();

    document.body.onmousedown = startDraw;
    document.body.onmousemove = duringDraw;
    document.body.onmouseup = endDraw;
    document.body.onkeydown = keyboardShortcuts;
}

/**
 * Initialize the canvas elements and it their dimensions to match the available window dimension.
 */
function initCanvas(savedCanvas: boolean) {
    MAIN_CANVAS = <HTMLCanvasElement>document.querySelector("#mainCanvas");
    MAIN_CTX = MAIN_CANVAS.getContext("2d")!;

    DRAW_CANVAS = <HTMLCanvasElement>document.querySelector("#drawCanvas");
    DRAW_CTX = DRAW_CANVAS.getContext("2d")!;

    // so that the cursor stays the default (instead of the text selection image)
    MAIN_CANVAS.onselectstart = function () {
        return false;
    };

    // set the dimensions of the canvas, to fill the available space in the window
    const menu = document.getElementById("Menu")!;

    const menuHeight = menu.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const canvasWidth = windowWidth;
    const canvasHeight = windowHeight - menuHeight;

    MAIN_CANVAS.width = canvasWidth;
    MAIN_CANVAS.height = canvasHeight;

    DRAW_CANVAS.width = canvasWidth;
    DRAW_CANVAS.height = canvasHeight;

    if (savedCanvas) {
        SaveLoad.loadCanvasImage(DRAW_CANVAS, MAIN_CANVAS, MAIN_CTX);
    }
}

/**
 * Start drawing with the selected brush.
 */
function startDraw(event: MouseEvent) {
    if (event.button === Utilities.MouseButton.left) {
        IS_MOUSE_DOWN = true;
        event.preventDefault();

        return BRUSH_OBJECT!.startDraw(event.pageX, event.pageY, DRAW_CTX);
    }
}

/**
 * Keep drawing while the mouse is being pressed.
 */
function duringDraw(event: MouseEvent) {
    if (IS_MOUSE_DOWN) {
        event.preventDefault();
        BRUSH_OBJECT!.duringDraw(
            event.pageX,
            event.pageY,
            DRAW_CANVAS,
            DRAW_CTX
        );
    }
}

/**
 * Finish the current draw path.
 */
function endDraw(event: MouseEvent) {
    IS_MOUSE_DOWN = false;
    event.preventDefault();

    return BRUSH_OBJECT!.endDraw(DRAW_CANVAS, DRAW_CTX, MAIN_CANVAS, MAIN_CTX);
}

export function selectBrush(brushPosition: number) {
    // deal the previous brush (clear it, and save the values that were set for next time this brush is selected)
    if (BRUSH_OBJECT) {
        var current = BRUSHES[BRUSH_SELECTED];

        current.previousSettings = BRUSH_OBJECT.getSettings();
        BRUSH_OBJECT.clear();

        // remove the selected styling
        Menu.unselectBrush(BRUSH_SELECTED);
    }

    var next = BRUSHES[brushPosition];

    BRUSH_SELECTED = brushPosition;
    BRUSH_OBJECT = new next.brushClass(next.previousSettings);

    Menu.selectBrush(brushPosition);
    Menu.updateCurrentColor();
}

export function getBrushesValues() {
    // update the .previousValues of the current selected brush (since we only update when switching between brushes)
    if (BRUSH_OBJECT) {
        BRUSHES[BRUSH_SELECTED].previousSettings = BRUSH_OBJECT.getSettings();
    }

    var values = [];

    for (var a = 0; a < BRUSHES.length; a++) {
        values.push({
            previousValues: BRUSHES[a].previousSettings,
        });
    }

    return values;
}

export function getSelectedBrush() {
    return BRUSH_SELECTED;
}

/*
 * Clears all elements from the canvas
 */
export function clearCanvas() {
    MAIN_CTX.clearRect(0, 0, MAIN_CANVAS.width, MAIN_CANVAS.height);
}

/*
 * Opens a new tab with the image (so that you can just right-click on the image and save it to the computer)
 */
export function exportCanvas() {
    const image = MAIN_CANVAS.toDataURL("image/png").replace(
        "image/png",
        "image/octet-stream"
    );
    const link = document.createElement("a");
    link.href = image;
    link.download = "canvas.png";
    link.click();
}

/**
 * Toggle the save canvas control state.
 */
export function saveCanvas() {
    SAVE_CANVAS = !SAVE_CANVAS;

    Menu.setSaveCanvasState(SAVE_CANVAS);
}

/**
 * Toggle the erase brush control state.
 */
export function eraseBrush() {
    ERASE_BRUSH = !ERASE_BRUSH;

    Menu.setEraseBrushState(ERASE_BRUSH);
}

export function savingCanvas() {
    return SAVE_CANVAS;
}

export function isEraseBrush() {
    return ERASE_BRUSH;
}

/**
 * - `: Toggle the erase mode.
 * - 1-5: Select the brush on that position.
 */
function keyboardShortcuts(event: KeyboardEvent) {
    var key = event.keyCode;

    switch (key) {
        case Utilities.KeyCode.graveAccent:
            eraseBrush();
            break;

        case Utilities.KeyCode.one:
            selectBrush(0);
            break;

        case Utilities.KeyCode.two:
            selectBrush(1);
            break;

        case Utilities.KeyCode.three:
            selectBrush(2);
            break;

        case Utilities.KeyCode.four:
            selectBrush(3);
            break;

        case Utilities.KeyCode.five:
            selectBrush(4);
            break;
    }
}

/**
 * Get the main canvas html element (for saving purposes).
 */
export function getMainCanvas() {
    return MAIN_CANVAS;
}

export function getOpacityValue() {
    return BRUSH_OBJECT!.opacity_control.getValue();
}
