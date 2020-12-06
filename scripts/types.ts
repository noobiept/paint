import Control from "./control";

export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface BubblePoint extends Point {
    radius: number;
    opacity: number;
}

export interface Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    distanceX: number;
    distanceY: number;
}

export interface Settings {
    [id: string]: number | number[];
}

export interface PreviousBrushSettings {
    brushClass: { new (args: BrushArgs): Brush };
    previousSettings: Settings;
}

export interface BrushArgs {}
export interface Brush {
    opacity_control: Control;
    all_controls: Control[];

    startDraw(x: number, y: number, ctx: CanvasRenderingContext2D): void;
    duringDraw(
        x: number,
        y: number,
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
    ): void;
    endDraw(
        drawCanvas: HTMLCanvasElement,
        drawCtx: CanvasRenderingContext2D,
        mainCanvas: HTMLCanvasElement,
        mainCtx: CanvasRenderingContext2D
    ): void;
    getSettings(): Settings;
    clear(): void;
}
