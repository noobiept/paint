import * as Menu from "./menu";
import * as Paint from "./paint";
import * as Color from "./color";
import * as Utilities from "./utilities";
import Control from "./control";
import { BrushArgs, Brush, Point, Line, Settings } from "./types";

export interface NeighborPointsBrushArgs extends BrushArgs {
    opacity?: number[];
    thickness?: number[];
    shadowBlur?: number;
    distance?: number;
}

export default class NeighborPointsBrush implements Brush {
    all_points: Point[];
    additional_lines: Line[];
    secondaryLinesStyle?: string;
    secondaryLinesWidth?: number;
    opacity_control: Control;
    thickness_control: Control;
    shadow_blur_control: Control;
    distance_control: Control;
    all_controls: Control[];

    constructor(args: NeighborPointsBrushArgs) {
        if (typeof args.opacity == "undefined") {
            args.opacity = [0.25, 1];
        }

        if (typeof args.thickness == "undefined") {
            args.thickness = [1.5, 5];
        }

        if (typeof args.shadowBlur == "undefined") {
            args.shadowBlur = 0;
        }

        if (typeof args.distance == "undefined") {
            args.distance = 30;
        }

        // init stuff
        this.all_points = []; // the main line
        this.additional_lines = []; // the lines between the close points of the main line

        // add the controls
        const container1 = <HTMLElement>(
            document.querySelector("#BrushControls1")
        );
        const container2 = <HTMLElement>(
            document.querySelector("#BrushControls2")
        );

        this.opacity_control = new Control({
            id: "opacity",
            label: "Opacity:",
            minValue: 0,
            maxValue: 1,
            initValue: args.opacity,
            step: 0.05,
            container: container1,
            onSlideFunction: function () {
                Menu.updateCurrentColor();
            },
        });
        this.thickness_control = new Control({
            id: "thickness",
            label: "Thickness:",
            minValue: 0.5,
            maxValue: 30,
            initValue: args.thickness,
            step: 0.5,
            container: container1,
        });
        this.shadow_blur_control = new Control({
            id: "shadowBlur",
            label: "Shadow Blur:",
            minValue: 0,
            maxValue: 10,
            initValue: args.shadowBlur,
            step: 0.5,
            container: container1,
        });
        this.distance_control = new Control({
            id: "distance",
            label: "Distance:",
            minValue: 10,
            maxValue: 100,
            initValue: args.distance,
            step: 1,
            container: container2,
        });

        this.all_controls = [
            this.opacity_control,
            this.thickness_control,
            this.shadow_blur_control,
            this.distance_control,
        ];
    }

    startDraw(x: number, y: number, ctx: CanvasRenderingContext2D) {
        this.all_points.push({
            x: x,
            y: y,
        });

        ctx.save();

        let color;

        // the secondary lines will have different styling (less pronounced)
        const mainLineOpacity = this.opacity_control.getUpperValue();
        const secondaryLinesOpacity = this.opacity_control.getLowerValue();

        // when we're erasing, we draw unto the draw canvas with a white color, and later what was drawn is removed/erased from the main canvas
        if (Paint.isEraseBrush()) {
            color = {
                red: 255,
                green: 255,
                blue: 255,
            };
        }

        // otherwise just get the color from the color picker in the menu
        else {
            color = Color.getValues();
        }

        const mainColorCss = Utilities.toCssColor(
            color.red,
            color.green,
            color.blue,
            mainLineOpacity
        );

        this.secondaryLinesStyle = Utilities.toCssColor(
            color.red,
            color.green,
            color.blue,
            secondaryLinesOpacity
        );
        this.secondaryLinesWidth = this.thickness_control.getLowerValue();

        ctx.beginPath();
        ctx.strokeStyle = mainColorCss;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = this.thickness_control.getUpperValue();
        ctx.shadowBlur = this.shadow_blur_control.getUpperValue();
        ctx.shadowColor = mainColorCss;
    }

    duringDraw(
        x: number,
        y: number,
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
    ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.all_points.push({
            x: x,
            y: y,
        });

        // draw the line
        let point1 = this.all_points[0];
        let point2 = this.all_points[1];

        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);

        for (let a = 1; a < this.all_points.length; a++) {
            const midPointX = Math.floor((point1.x + point2.x) / 2);
            const midPointY = Math.floor((point1.y + point2.y) / 2);

            ctx.quadraticCurveTo(point1.x, point1.y, midPointX, midPointY);

            point1 = this.all_points[a];
            point2 = this.all_points[a + 1];
        }

        ctx.stroke();

        const lastPoint = this.all_points[this.all_points.length - 1];

        // find lines/points close to the last one (which was just added)
        for (let a = 0; a < this.all_points.length; a++) {
            const point = this.all_points[a];

            // construct a triangle, to check the distance between points (the current one, with others previously saved)
            const adjacent = point.x - lastPoint.x;
            const opposite = point.y - lastPoint.y;

            // the distance would be the square root of this. we don't do that as an optimization
            const distance = adjacent * adjacent + opposite * opposite;
            const distanceLimit = this.distance_control.getUpperValue();

            if (distance < distanceLimit * distanceLimit) {
                this.additional_lines.push({
                    x1: lastPoint.x,
                    y1: lastPoint.y,
                    x2: point.x,
                    y2: point.y,
                    distanceX: adjacent,
                    distanceY: opposite,
                });
            }
        }

        // save the main styling
        ctx.save();

        ctx.strokeStyle = this.secondaryLinesStyle ?? "#000";
        ctx.lineWidth = this.secondaryLinesWidth ?? 1;

        // draw all the additional lines
        for (let a = 0; a < this.additional_lines.length; a++) {
            const line = this.additional_lines[a];

            ctx.moveTo(
                line.x1 + line.distanceX * 0.2,
                line.y1 + line.distanceY * 0.2
            );
            ctx.lineTo(
                line.x2 - line.distanceX * 0.2,
                line.y2 - line.distanceY * 0.2
            );
        }

        ctx.stroke();
        ctx.restore();
    }

    endDraw(
        drawCanvas: HTMLCanvasElement,
        drawCtx: CanvasRenderingContext2D,
        _mainCanvas: HTMLCanvasElement,
        mainCtx: CanvasRenderingContext2D
    ) {
        // draw what is in the draw canvas into the main one
        mainCtx.save();

        if (Paint.isEraseBrush()) {
            mainCtx.globalCompositeOperation = "destination-out";
        }

        mainCtx.drawImage(drawCanvas, 0, 0);
        mainCtx.restore();

        drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

        // we're done with drawing, so restore the previous styling
        drawCtx.restore();

        this.all_points.length = 0;
        this.additional_lines.length = 0;
    }

    getSettings() {
        const settings: Settings = {};

        for (let a = 0; a < this.all_controls.length; a++) {
            const control = this.all_controls[a];

            settings[control.id] = control.getValue();
        }

        return settings;
    }

    clear() {
        for (let a = 0; a < this.all_controls.length; a++) {
            this.all_controls[a].clear();
        }
    }
}
