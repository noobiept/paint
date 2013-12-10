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
var CTX;


window.onload = function()
{
CANVAS = document.querySelector( "#mainCanvas" );
CTX = CANVAS.getContext( '2d' );


    // so that the cursor stays the default (instead of the text selection image)
CANVAS.onselectstart = function() { return false; };


Paint.init();

        //HERE onMouseDown funciona independentemente de qual a tecla do rato k foi pressionada
    // se calhar era melhor distinguir entre left e right click, para ter funcionalidade diferente?..
document.body.onmousedown = Brush.startDraw;
document.body.onmousemove = Brush.duringDraw;
document.body.onmouseup = Brush.endDraw;


    // the canvas has its dimensions changed by css (flexbox), but it doesn't update the element width/height, and will affect when drawing (just remove these lines and try the program to see the problem)
    // so we just update it now
    //HERE should update on resize as well?..
CANVAS.width = getCanvasWidth();
CANVAS.height = getCanvasHeight();
};



function getCanvasWidth()
{
return parseInt( $( CANVAS ).innerWidth() );
}

function getCanvasHeight()
{
return parseInt( $( CANVAS ).innerHeight() );
}

