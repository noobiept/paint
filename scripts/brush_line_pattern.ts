import * as Menu from "./menu";
import * as Paint from "./paint";
import * as Color from "./color";
import * as Utilities from "./utilities";
import Control from "./control";
import { Brush, BrushArgs, Point, Settings } from "./types";

export interface LinePatternBrushArgs extends BrushArgs {
    opacity?: number;
    thickness?: number;
    patternAngle?: number;
    patternThickness?: number;
}

export default class LinePatternBrush implements Brush {
    all_points: Point[];
    opacity_control: Control;
    thickness_control: Control;
    angle_control: Control;
    pattern_thickness_control: Control;
    all_controls: Control[];

    constructor(args: LinePatternBrushArgs) {
        if (typeof args.opacity == "undefined") {
            args.opacity = 1;
        }

        if (typeof args.thickness == "undefined") {
            args.thickness = 10;
        }

        if (typeof args.patternAngle == "undefined") {
            args.patternAngle = 0;
        }

        if (typeof args.patternThickness == "undefined") {
            args.patternThickness = 5;
        }

        this.all_points = [];

        const container1 = <HTMLElement>(
            document.querySelector("#BrushControls1")
        );
        const container2 = <HTMLElement>(
            document.querySelector("#BrushControls2")
        );

        // main line
        this.opacity_control = new Control({
            id: "opacity",
            label: "Opacity:",
            minValue: 0,
            maxValue: 1,
            initValue: args.opacity,
            step: 0.1,
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

        // pattern
        this.angle_control = new Control({
            id: "patternAngle",
            label: "Pattern Angle:",
            minValue: 0,
            maxValue: 135,
            initValue: args.patternAngle,
            step: 45,
            container: container2,
        });
        this.pattern_thickness_control = new Control({
            id: "patternThickness",
            label: "Pattern Thickness:",
            minValue: 0.5,
            maxValue: 10,
            initValue: args.patternThickness,
            step: 0.5,
            container: container2,
        });

        this.all_controls = [
            this.opacity_control,
            this.thickness_control,
            this.angle_control,
            this.pattern_thickness_control,
        ];
    }

    getPattern() {
        const lineWidth = this.pattern_thickness_control.getUpperValue();
        const angle = this.angle_control.getValue();
        let color;
        const opacity = this.opacity_control.getUpperValue();

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

        const colorCss = Utilities.toCssColor(
            color.red,
            color.green,
            color.blue,
            opacity
        );

        const width = 15;
        const height = 15;

        const pattern = document.createElement("canvas");

        pattern.width = width;
        pattern.height = height;

        const ctx = pattern.getContext("2d")!;

        ctx.beginPath();
        ctx.strokeStyle = colorCss;
        ctx.fillStyle = colorCss;
        ctx.lineWidth = lineWidth;

        const halfWidth = width / 2;
        const halfHeight = height / 2;

        // line centered
        if (angle == 0) {
            ctx.moveTo(0, halfHeight);
            ctx.lineTo(width, halfHeight);
            ctx.stroke();
        }

        // diagonal
        else if (angle == 45) {
            ctx.moveTo(0, 0);
            ctx.lineTo(width, height);
            ctx.stroke();

            const opposite = lineWidth / 2;
            const angleRads = Math.PI / 4;

            const hypotenuse = opposite / Math.sin(angleRads);

            ctx.moveTo(0, height - hypotenuse);
            ctx.lineTo(hypotenuse, height);
            ctx.lineTo(0, height);

            ctx.moveTo(width - hypotenuse, 0);
            ctx.lineTo(width, hypotenuse);
            ctx.lineTo(width, 0);

            ctx.fill();
        }

        // line centered as well
        else if (angle == 90) {
            ctx.moveTo(halfWidth, 0);
            ctx.lineTo(halfWidth, height);
            ctx.stroke();
        }

        // diagonal
        else if (angle == 135) {
            ctx.moveTo(0, height);
            ctx.lineTo(width, 0);
            ctx.stroke();

            const opposite = lineWidth / 2;
            const angleRads = Math.PI / 4;

            const hypotenuse = opposite / Math.sin(angleRads);

            ctx.moveTo(0, 0);
            ctx.lineTo(hypotenuse, 0);
            ctx.lineTo(0, hypotenuse);

            ctx.moveTo(width, height - hypotenuse);
            ctx.lineTo(width - hypotenuse, height);
            ctx.lineTo(width, height);

            ctx.fill();
        }

        return ctx.createPattern(pattern, "repeat")!;
    }

    startDraw(x: number, y: number, ctx: CanvasRenderingContext2D) {
        this.all_points.push({
            x: x,
            y: y,
        });

        ctx.save();

        ctx.beginPath();
        ctx.strokeStyle = this.getPattern();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = this.thickness_control.getUpperValue();
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
