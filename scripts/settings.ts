import { Dialog } from "@drk4/utilities";
import * as Paint from "./paint";
import "@drk4/utilities/build/dialog.css";

let DIALOG: Dialog;

export function init() {
    const body = document.createElement("div");

    body.appendChild(createCanvasDimensions());
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

function createCanvasDimensions() {
    const container = document.createElement("div");
    const dimensions = document.createElement("div");
    const current = Paint.getCanvasDimensions();

    const header = createHeader("Canvas Dimensions");
    const width = createNumberInput("Width", current.width, 100, 10000);
    const height = createNumberInput("Height", current.height, 100, 10000);
    const apply = document.createElement("button");

    apply.textContent = "Apply";
    apply.className = "dialogButton";
    apply.onclick = () => {
        const widthValue = width.querySelector("input")?.value;
        const heightValue = height.querySelector("input")?.value;

        if (widthValue && heightValue) {
            Paint.setCanvasDimensions({
                width: parseInt(widthValue, 10),
                height: parseInt(heightValue, 10),
            });
        }
    };

    dimensions.appendChild(width);
    dimensions.appendChild(height);
    dimensions.appendChild(apply);
    container.appendChild(header);
    container.appendChild(dimensions);

    return container;
}

function createNumberInput(
    labelText: string,
    value: number,
    min: number,
    max: number
) {
    const container = document.createElement("div");
    const label = document.createElement("div");
    const input = document.createElement("input");

    container.className = "numberInput";
    label.textContent = labelText;
    input.type = "number";
    input.value = value.toString();
    input.min = min.toString();
    input.max = max.toString();

    container.appendChild(label);
    container.appendChild(input);

    return container;
}

function createHeader(text: string) {
    const container = document.createElement("div");
    const header = document.createElement("div");
    const ruler = document.createElement("hr");

    container.className = "headerContainer";
    header.textContent = text;

    container.appendChild(header);
    container.appendChild(ruler);

    return container;
}
