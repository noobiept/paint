import { saveObject, getObject } from "@drk4/utilities";
import * as Color from "./color";
import * as Paint from "./paint";
import { PreviousBrushSettings } from "./types";

export function save() {
    let mainCanvas = Paint.getMainCanvas();

    // save the RGB values that were set
    var rgb = Color.getValues();

    saveObject("rgb", rgb);

    // save the control values of the brushes
    saveObject("brushes_values", Paint.getBrushesValues());

    // save which brush is currently selected
    saveObject("selected_brush", Paint.getSelectedBrush());

    if (Paint.savingCanvas()) {
        saveObject("saved_canvas", true);

        // save the canvas
        saveObject("canvas", mainCanvas.toDataURL("image/png"));
        saveObject("canvas_width", mainCanvas.width);
        saveObject("canvas_height", mainCanvas.height);
    } else {
        saveObject("saved_canvas", false);
    }
}

export function getRgb() {
    var rgb = getObject("rgb");

    if (rgb) {
        return rgb;
    } else {
        return null;
    }
}

export function loadBrushesValues(brushes: PreviousBrushSettings[]) {
    try {
        var brushesValues = getObject("brushes_values");
    } catch (error) {
        return;
    }

    if (!brushesValues) {
        return;
    }

    for (var a = 0; a < brushes.length; a++) {
        brushes[a].previousSettings = brushesValues[a].previousValues;
    }
}

export function getSelectedBrush() {
    var selectedBrush = getObject("selected_brush");

    if (selectedBrush && $.isNumeric(selectedBrush)) {
        return selectedBrush;
    } else {
        return 0;
    }
}

export function loadCanvasImage(
    drawCanvas: HTMLCanvasElement,
    mainCanvas: HTMLCanvasElement,
    mainCtx: CanvasRenderingContext2D
) {
    var canvasData = getObject("canvas");
    var canvasWidth = getObject("canvas_width");
    var canvasHeight = getObject("canvas_height");

    if (canvasData && $.isNumeric(canvasWidth) && $.isNumeric(canvasHeight)) {
        var currentWidth = mainCanvas.width;
        var currentHeight = mainCanvas.height;

        // see if we need to increase the size of the canvas (to avoid loosing part of the image)
        if (currentWidth < canvasWidth) {
            mainCanvas.width = drawCanvas.width = canvasWidth;
        }

        if (currentHeight < canvasHeight) {
            mainCanvas.height = drawCanvas.height = canvasHeight;
        }

        var img = new Image();

        img.src = canvasData;
        img.onload = function () {
            mainCtx.drawImage(img, 0, 0);
        };
    }
}
