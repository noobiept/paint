import { getRandomInt, getRandomFloat } from "@drk4/utilities";
import * as Menu from "./menu";
import * as Paint from "./paint";
import * as Color from "./color";
import Control from "./control";
import { BrushArgs, Brush, Settings } from "./types";
import { toCssColor } from "./utilities";

export interface SprayBrushArgs extends BrushArgs {
    opacity?: number[];
    radius?: number;
    totalPoints?: number;
    pointsLength?: number;
}

export default class SprayBrush implements Brush {
    currentX: number;
    currentY: number;
    interval_f?: number;
    minimum_opacity: number;
    maximum_opacity: number;
    radius: number;
    total_points: number;
    opacity_control: Control;
    radius_control: Control;
    total_points_control: Control;
    points_length_control: Control;
    all_controls: Control[];

    constructor(args: SprayBrushArgs) {
        if (typeof args.opacity == "undefined") {
            args.opacity = [0.25, 1];
        }

        if (typeof args.radius == "undefined") {
            args.radius = 50;
        }

        if (typeof args.totalPoints == "undefined") {
            args.totalPoints = 50;
        }

        if (typeof args.pointsLength == "undefined") {
            args.pointsLength = 1;
        }

        // declaring the properties that will be used later on (the values will change from these, for example from the controls in the menu
        this.currentX = 0;
        this.currentY = 0;
        this.minimum_opacity = args.opacity[0];
        this.maximum_opacity = args.opacity[1];
        this.radius = args.radius;
        this.total_points = args.totalPoints;

        // init. controls

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
        this.radius_control = new Control({
            id: "radius",
            label: "Radius:",
            minValue: 10,
            maxValue: 100,
            initValue: args.radius,
            step: 1,
            container: container1,
        });
        this.total_points_control = new Control({
            id: "totalPoints",
            label: "Total Points:",
            minValue: 10,
            maxValue: 100,
            initValue: args.totalPoints,
            step: 1,
            container: container2,
        });
        this.points_length_control = new Control({
            id: "pointsLength",
            label: "Points Length:",
            minValue: 1,
            maxValue: 5,
            initValue: args.pointsLength,
            step: 1,
            container: container2,
        });

        this.all_controls = [
            this.opacity_control,
            this.radius_control,
            this.total_points_control,
            this.points_length_control,
        ];
    }

    startDraw(x: number, y: number, ctx: CanvasRenderingContext2D) {
        this.currentX = x;
        this.currentY = y;

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

        this.minimum_opacity = this.opacity_control.getLowerValue();
        this.maximum_opacity = this.opacity_control.getUpperValue();

        this.radius = this.radius_control.getUpperValue();
        this.total_points = this.total_points_control.getUpperValue();
        const points_length = this.points_length_control.getUpperValue();

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.fillStyle = toCssColor(color.red, color.green, color.blue);

        // keep adding points, until the mouse button stops being pressed
        this.interval_f = window.setInterval(() => {
            for (let a = 0; a < this.total_points; a++) {
                const angle = getRandomFloat(0, 2 * Math.PI);
                const distance = getRandomInt(0, this.radius);

                ctx.globalAlpha = getRandomFloat(
                    this.minimum_opacity,
                    this.maximum_opacity
                );
                ctx.fillRect(
                    this.currentX + distance * Math.cos(angle),
                    this.currentY + distance * Math.sin(angle),
                    points_length,
                    points_length
                );
            }
        }, 50);
    }

    duringDraw(
        x: number,
        y: number,
        _canvas: HTMLCanvasElement,
        _ctx: CanvasRenderingContext2D
    ) {
        this.currentX = x;
        this.currentY = y;
    }

    endDraw(
        drawCanvas: HTMLCanvasElement,
        drawCtx: CanvasRenderingContext2D,
        _mainCanvas: HTMLCanvasElement,
        mainCtx: CanvasRenderingContext2D
    ) {
        window.clearInterval(this.interval_f);

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
