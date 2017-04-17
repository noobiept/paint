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


interface BrushArgs {}
interface Brush
    {
    opacity_control: Control;
    all_controls: Control[];

    startDraw( event: MouseEvent ): void;
    duringDraw( event: MouseEvent ): void;
    endDraw( event: MouseEvent ): void;
    getSettings(): Settings;
    clear(): void;
    }


window.onload = function()
{
Color.init( SaveLoad.getRgb() );

var savedCanvas = Utilities.getObject( 'saved_canvas' );

if ( savedCanvas !== true )
    {
    savedCanvas = false;
    }

Paint.init( savedCanvas );
};


window.onunload = function()
{
SaveLoad.save();
};