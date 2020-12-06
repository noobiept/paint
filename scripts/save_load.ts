import { saveObject, getObject } from "@drk4/utilities";
import * as Color from "./color";
import * as Paint from "./paint";
import { PreviousBrushSettings } from "./types";

export function save() {
    const mainCanvas = Paint.getMainCanvas();

    // save the RGB values that were set
    const rgb = Color.getValues();

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
    const rgb = getObject("rgb");

    if (rgb) {
        return rgb;
    } else {
        return null;
    }
}

export function loadBrushesValues(brushes: PreviousBrushSettings[]) {
    try {
        const brushesValues = getObject("brushes_values");

        if (!brushesValues) {
            return;
        }

        for (let a = 0; a < brushes.length; a++) {
            brushes[a].previousSettings = brushesValues[a].previousValues;
        }
    } catch {
        return;
    }
}

export function getSelectedBrush() {
    const selectedBrush = getObject("selected_brush");

    if (selectedBrush && Number.isInteger(selectedBrush)) {
        return selectedBrush;
    } else {
        return 0;
    }
}

export function loadCanvasImage(mainCtx: CanvasRenderingContext2D) {
    const canvasData = getObject("canvas");
    const canvasWidth = getObject("canvas_width");
    const canvasHeight = getObject("canvas_height");

    if (
        canvasData &&
        Number.isInteger(canvasWidth) &&
        Number.isInteger(canvasHeight)
    ) {
        Paint.setCanvasDimensions({
            width: canvasWidth,
            height: canvasHeight,
        });

        const img = new Image();

        img.src = canvasData;
        img.onload = function () {
            mainCtx.drawImage(img, 0, 0);
        };
    }
}
