import { Dialog } from "@drk4/utilities";
import * as Paint from "./paint";
import "@drk4/utilities/build/dialog.css";

let DIALOG: Dialog;

export function init() {
    const body = document.createElement("div");
    body.appendChild(createClearCanvas());
    body.appendChild(createExportCanvas());

    DIALOG = new Dialog({
        title: "Settings",
        body,
        onClose: () => {
            Paint.enableEvents();
        },
    });
}

export function open() {
    Paint.disableEvents();
    DIALOG.open();
}

function createClearCanvas() {
    const clear = document.createElement("div");
    clear.className = "button";
    clear.textContent = "Clear Canvas";

    clear.onclick = Paint.clearCanvas;

    return clear;
}

function createExportCanvas() {
    const exportCanvas = document.createElement("div");
    exportCanvas.className = "button";
    exportCanvas.textContent = "Export Canvas";

    exportCanvas.onclick = Paint.exportCanvas;

    return exportCanvas;
}
