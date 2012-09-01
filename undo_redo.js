/*global */
/*jslint vars: true, white: true*/

"use strict";


/*
    Works for each stroke
 */

(function(window)
{
var UNDO_LIST = [];

var REDO_LIST = [];


function UndoRedo()
{

}



UndoRedo.addStroke = function( shapeObject )
{
UNDO_LIST.push({

    what : 'addStroke',
    shapeObject: shapeObject
    });
    
UndoRedo.cleanRedo();
};





UndoRedo.stuff = function( whichOne )
{
var element;

if (whichOne == "undo")
    {
    if (UNDO_LIST.length === 0)
        {
            //HERE por o butao sem ser possivel clicar
        return;
        }
    
        // get the last element
    element = UNDO_LIST.pop();
    
        // move it to the redo list (add at the end)
    REDO_LIST.push( element );
    }
    
    // redo
else
    {
    if (REDO_LIST.length === 0)
        {
        //HERE same
        return;
        }
        
    element = REDO_LIST.pop();
    
    UNDO_LIST.push( element );
    }

    
    
if (element.what == 'addStroke')    
    {
        // we remove the stroke
    if (whichOne == 'undo')
        {
        Paint.removeShape( element.shapeObject );
        }
    
        // we add it back again
    else
        {
        var shape = element.shapeObject;
        
        Paint.addShape( shape );
        }
    }
    
    
};



/*
    on a new change, clean the redo, so that it doesn't create conflicts (start a new undo 'path')
 */

UndoRedo.cleanRedo = function()
{
REDO_LIST.length = 0;
};


UndoRedo.cleanUndo = function()
{
UNDO_LIST.length = 0;
};

/*
    Clears the undo and redo
 */

UndoRedo.clear = function()
{
UndoRedo.cleanUndo();
UndoRedo.cleanRedo();
};
 

window.UndoRedo = UndoRedo;

}(window));