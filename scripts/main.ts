interface Point
    {
    x: number;
    y: number;
    }


interface BubblePoint extends Point
    {
    radius: number;
    opacity: number;
    }


interface Line
    {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    distanceX: number;
    distanceY: number;
    }


interface Settings
    {
    [id: string]: number | number[];
    }


interface PreviousBrushSettings
    {
    brushClass: { new( args: BrushArgs ): Brush };
    previousSettings: Settings;
    }


interface BrushArgs {}
interface Brush
    {
    opacity_control: Control;
    all_controls: Control[];

    startDraw( x: number, y: number, ctx: CanvasRenderingContext2D ): void;
    duringDraw( x: number, y: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D ): void;
    endDraw( drawCanvas: HTMLCanvasElement, drawCtx: CanvasRenderingContext2D, mainCanvas: HTMLCanvasElement, mainCtx: CanvasRenderingContext2D ): void;
    getSettings(): Settings;
    clear(): void;
    }


window.onload = function()
{
var savedCanvas = Utilities.getObject( 'saved_canvas' );

if ( savedCanvas !== true )
    {
    savedCanvas = false;
    }

Color.init( SaveLoad.getRgb() );
Menu.init();
Paint.init( savedCanvas );
};


window.onunload = function()
{
SaveLoad.save();
};