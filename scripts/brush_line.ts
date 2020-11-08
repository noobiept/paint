interface LineBrushArgs extends BrushArgs {
    opacity?: number;
    thickness?: number;
    shadowBlur?: number;
}

class LineBrush implements Brush {
    opacity_control: Control;
    thickness_control: Control;
    shadow_blur_control: Control;
    all_points: Point[];
    all_controls: Control[];

    constructor(args: LineBrushArgs) {
        if (typeof args.opacity == "undefined") {
            args.opacity = 1;
        }

        if (typeof args.thickness == "undefined") {
            args.thickness = 5;
        }

        if (typeof args.shadowBlur == "undefined") {
            args.shadowBlur = 0;
        }

        // add controls
        var container = <HTMLElement>document.querySelector("#brushControls1");

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
        this.thickness_control = new Control({
            id: "thickness",
            label: "Thickness:",
            minValue: 0.5,
            maxValue: 30,
            initValue: args.thickness,
            step: 0.5,
            container: container,
        });
        this.shadow_blur_control = new Control({
            id: "shadowBlur",
            label: "Shadow Blur:",
            minValue: 0,
            maxValue: 10,
            initValue: args.shadowBlur,
            step: 0.5,
            container: container,
        });

        // init stuff
        this.all_points = [];

        this.all_controls = [
            this.opacity_control,
            this.thickness_control,
            this.shadow_blur_control,
        ];
    }

    startDraw(x: number, y: number, ctx: CanvasRenderingContext2D) {
        this.all_points.push({
            x: x,
            y: y,
        });

        ctx.save();

        var color;
        var opacity = this.opacity_control.getUpperValue();

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

        var colorCss = Utilities.toCssColor(
            color.red,
            color.green,
            color.blue,
            opacity
        );

        ctx.beginPath();
        ctx.strokeStyle = colorCss;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = this.thickness_control.getUpperValue();
        ctx.shadowBlur = this.shadow_blur_control.getUpperValue();
        ctx.shadowColor = colorCss;
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

        var point1 = this.all_points[0];
        var point2 = this.all_points[1];

        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);

        for (var a = 1; a < this.all_points.length; a++) {
            var midPointX = Math.floor((point1.x + point2.x) / 2);
            var midPointY = Math.floor((point1.y + point2.y) / 2);

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
        var settings: Settings = {};

        for (var a = 0; a < this.all_controls.length; a++) {
            var control = this.all_controls[a];

            // this assumes the setting key is the same string as the control id
            settings[control.id] = control.getValue();
        }

        return settings;
    }

    clear() {
        for (var a = 0; a < this.all_controls.length; a++) {
            this.all_controls[a].clear();
        }
    }
}
