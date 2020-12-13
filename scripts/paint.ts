import { MouseButton } from "@drk4/utilities";

import * as SaveLoad from "./save_load";
import * as Menu from "./menu";
import { Brush, PreviousBrushSettings, Size } from "./types";
import BubblesBrush from "./brush_bubbles";
import LineBrush from "./brush_line";
import LinePatternBrush from "./brush_line_pattern";
import NeighborPointsBrush from "./brush_neighbor_points";
import SprayBrush from "./brush_spray";
import { CANVAS_INFO } from "./defaults";

// main canvas, will contain the drawing with all the shapes
let MAIN_CANVAS: HTMLCanvasElement;
let MAIN_CTX: CanvasRenderingContext2D;

// draw canvas, used to show the line being drawn only
let DRAW_CANVAS: HTMLCanvasElement;
let DRAW_CTX: CanvasRenderingContext2D;

const BRUSHES: PreviousBrushSettings[] = [
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

let BRUSH_SELECTED = 0;
let BRUSH_OBJECT: Brush | null = null;
let IS_MOUSE_DOWN = false;

let SAVE_CANVAS = false;
let ERASE_BRUSH = false; // if the current selected brush is used to draw or to erase

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

    enableEvents();
}

export function enableEvents() {
    if (DRAW_CANVAS) {
        DRAW_CANVAS.onmousedown = startDraw;
        DRAW_CANVAS.onmousemove = duringDraw;
        DRAW_CANVAS.onmouseup = endDraw;
        DRAW_CANVAS.onmouseleave = endDraw;
        DRAW_CANVAS.onmouseenter = onMouseEnter;
        DRAW_CANVAS.onkeydown = keyboardShortcuts;
    }
}

export function disableEvents() {
    if (DRAW_CANVAS) {
        DRAW_CANVAS.onmousedown = null;
        DRAW_CANVAS.onmousemove = null;
        DRAW_CANVAS.onmouseup = null;
        DRAW_CANVAS.onkeydown = null;
    }
}

/**
 * Initialize the canvas elements and it their dimensions to match the available window dimension.
 */
function initCanvas(savedCanvas: boolean) {
    MAIN_CANVAS = <HTMLCanvasElement>document.querySelector("#MainCanvas");
    MAIN_CTX = MAIN_CANVAS.getContext("2d")!;

    DRAW_CANVAS = <HTMLCanvasElement>document.querySelector("#DrawCanvas");
    DRAW_CTX = DRAW_CANVAS.getContext("2d")!;

    // so that the cursor stays the default (instead of the text selection image)
    MAIN_CANVAS.onselectstart = function () {
        return false;
    };

    if (savedCanvas) {
        SaveLoad.loadCanvasImage(MAIN_CTX);
    } else {
        setCanvasDimensions(CANVAS_INFO);
    }
}

export function getCanvasDimensions() {
    return {
        width: MAIN_CANVAS.width,
        height: MAIN_CANVAS.height,
    };
}

export function setCanvasDimensions({ width, height }: Size) {
    MAIN_CANVAS.width = width;
    MAIN_CANVAS.height = height;

    DRAW_CANVAS.width = width;
    DRAW_CANVAS.height = height;
}

/**
 * Start drawing with the selected brush.
 */
function startDraw(event: MouseEvent) {
    if (event.button === MouseButton.left) {
        IS_MOUSE_DOWN = true;
        event.preventDefault();

        return BRUSH_OBJECT!.startDraw(event.offsetX, event.offsetY, DRAW_CTX);
    }
}

/**
 * Check if the left button of the mouse is being pressed, and if so start a new draw action.
 */
function onMouseEnter(event: MouseEvent) {
    // left click is being pressed
    if (event.buttons === 1) {
        startDraw(event);
    }
}

/**
 * Keep drawing while the mouse is being pressed.
 */
function duringDraw(event: MouseEvent) {
    if (IS_MOUSE_DOWN) {
        event.preventDefault();
        BRUSH_OBJECT!.duringDraw(
            event.offsetX,
            event.offsetY,
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
        const current = BRUSHES[BRUSH_SELECTED];

        current.previousSettings = BRUSH_OBJECT.getSettings();
        BRUSH_OBJECT.clear();

        // remove the selected styling
        Menu.unselectBrush(BRUSH_SELECTED);
    }

    const next = BRUSHES[brushPosition];

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

    const values = [];

    for (let a = 0; a < BRUSHES.length; a++) {
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
    const key = event.key;

    switch (key) {
        case "`":
            eraseBrush();
            break;

        case "1":
            selectBrush(0);
            break;

        case "2":
            selectBrush(1);
            break;

        case "3":
            selectBrush(2);
            break;

        case "4":
            selectBrush(3);
            break;

        case "5":
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
