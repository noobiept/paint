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
    
        - save to localStorage the options (what color was set, what brush was selected, and the controls values )

        - pattern, draw a full canvas (same width/height as main canvas), to be able to have all the angles

        - undo/redo, have separate canvas, where you draw to there instead of the main one, so that when you want to undo, you simply clear one of those canvas (so we'll have a limit to how many undos we can do)
  */

    // main canvas, will contain the drawing with all the shapes
var MAIN_CANVAS;
var MAIN_CTX;

    // draw canvas, used to show the line being drawn only
var DRAW_CANVAS;
var DRAW_CTX;




window.onload = function()
{
MAIN_CANVAS = document.querySelector( "#mainCanvas" );
MAIN_CTX = MAIN_CANVAS.getContext( '2d' );


DRAW_CANVAS = document.querySelector( '#drawCanvas' );
DRAW_CTX = DRAW_CANVAS.getContext( '2d' );


    // so that the cursor stays the default (instead of the text selection image)
MAIN_CANVAS.onselectstart = function() { return false; };


Color.init();
Paint.init();

        //HERE onMouseDown funciona independentemente de qual a tecla do rato k foi pressionada
    // se calhar era melhor distinguir entre left e right click, para ter funcionalidade diferente?..
document.body.onmousedown = Paint.startDraw;
document.body.onmousemove = Paint.duringDraw;
document.body.onmouseup = Paint.endDraw;

    // set the dimensions of the canvas, to fill the available space in the window
var menuHeight = $( '#Menu' ).outerHeight();
var windowWidth = $( window ).outerWidth();
var windowHeight = $( window ).outerHeight();

var canvasWidth = windowWidth;
var canvasHeight = windowHeight - menuHeight;

MAIN_CANVAS.width = canvasWidth;
MAIN_CANVAS.height = canvasHeight;

DRAW_CANVAS.width = canvasWidth;
DRAW_CANVAS.height = canvasHeight;
};




function getRandomInt( min, max )
{
return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRandomFloat( min, max )
{
return Math.random() * (max - min) + min;
}


function toCssColor( red, green, blue, alpha )
{
if ( typeof alpha == 'undefined' )
    {
    alpha = 1;
    }

return 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';
}
