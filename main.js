/*global $, Paint*/
/*jslint vars: true, white: true*/

"use strict";


/*
    Libraries required:
    
        jquery          - 2.0
        jqueryui        - 1.10
            slider
            start theme
            
        createjs
            easeljs     - 0.7
 */
 
 /*
    to doo:
    
        - turn into an application by itself (not in the home of the website, but like the games, separate app)
        - add brushes and stuff
  */

var CANVAS;
var STAGE;

window.onload = function()
{
CANVAS = document.querySelector( "#mainCanvas" );

CANVAS.width = 800;
CANVAS.height = 400;

    // so that the cursor stays the default (instead of the text selection image)
CANVAS.onselectstart = function() { return false; };


STAGE = new createjs.Stage( CANVAS );

Paint.init();

        //HERE onMouseDown funciona independentemente de qual a tecla do rato k foi pressionada
    // se calhar era melhor distinguir entre left e right click, para ter funcionalidade diferente?..
STAGE.on( 'stagemousedown', Paint.mouseDownEvents );
STAGE.on( 'stagemouseup', Paint.mouseUpEvents );

createjs.Ticker.on( 'tick', Paint.tick );
};




