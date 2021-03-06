import { getRandomFloat, getRandomInt } from "@drk4/utilities";
import * as Menu from "./menu";
import * as Paint from "./paint";
import * as Color from "./color";
import Control from "./control";
import { Brush, BrushArgs, BubblePoint, Settings } from "./types";
import { toCssColor } from "./utilities";

export interface BubblesBrushArgs extends BrushArgs {
    opacity?: number[];
    radius?: number[];
}

export default class BubblesBrush implements Brush {
    all_points: BubblePoint[];
    minimum_radius: number;
    maximum_radius: number;
    minimum_opacity: number;
    maximum_opacity: number;
    opacity_control: Control;
    radius_control: Control;
    all_controls: Control[];

    constructor(args: BubblesBrushArgs) {
        if (typeof args.opacity == "undefined") {
            args.opacity = [0.25, 1];
        }

        if (typeof args.radius == "undefined") {
            args.radius = [5, 10];
        }

        this.all_points = [];
        this.minimum_radius = args.radius[0];
        this.maximum_radius = args.radius[1];
        this.minimum_opacity = args.opacity[0];
        this.maximum_opacity = args.opacity[1];

        // add the controls
        const container = <HTMLElement>(
            document.querySelector("#BrushControls1")
        );

        this.opacity_control = new Control({
            id: "opacity",
            label: "Opacity:",
            minValue: 0,
            maxValue: 1,
            initValue: args.opacity,
            step: 0.1,
            container: container,
            onSlideFunction: function () {
                Menu.updateCurrentColor();
            },
        });
        this.radius_control = new Control({
            id: "radius",
            label: "Radius:",
            minValue: 1,
            maxValue: 20,
            initValue: args.radius,
            step: 0.5,
            container: container,
        });

        this.all_controls = [this.opacity_control, this.radius_control];
    }

    startDraw(x: number, y: number, ctx: CanvasRenderingContext2D) {
        this.all_points.push({
            x: x,
            y: y,
            radius: getRandomInt(this.minimum_radius, this.maximum_radius),
            opacity: getRandomFloat(this.minimum_opacity, this.maximum_opacity),
        });

        // before making changes to the styling, call context.save(), to save the previous state (we'll restore at the end)
        ctx.save();

        let color;

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

        ctx.beginPath();
        ctx.fillStyle = toCssColor(color.red, color.green, color.blue);

        this.minimum_opacity = this.opacity_control.getLowerValue();
        this.maximum_opacity = this.opacity_control.getUpperValue();

        this.minimum_radius = this.radius_control.getLowerValue();
        this.maximum_radius = this.radius_control.getUpperValue();
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
            radius: getRandomInt(this.minimum_radius, this.maximum_radius),
            opacity: getRandomFloat(this.minimum_opacity, this.maximum_opacity),
        });

        // draw the line
        for (let a = 0; a < this.all_points.length; a++) {
            const circle = this.all_points[a];

            ctx.beginPath();
            ctx.globalAlpha = circle.opacity;
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
            ctx.fill();
        }
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
