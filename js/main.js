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

        - save to localStorage the options (what color was set, what brush was selected, ... )
            - also save for the additional controls of each brush

        - add brushes and stuff
            - each brush have its own controls (like the shadow for the line, the distance for the neighbour points...)

        - line
            - thickness
            - shadow

        neighbor points
            - distance

        bubbles
            - minimum radius
            - maximum radius
            - minimum opacity
            - maximum opacity
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


Paint.init();

        //HERE onMouseDown funciona independentemente de qual a tecla do rato k foi pressionada
    // se calhar era melhor distinguir entre left e right click, para ter funcionalidade diferente?..
document.body.onmousedown = Brush.startDraw;
document.body.onmousemove = Brush.duringDraw;
document.body.onmouseup = Brush.endDraw;


    // the canvas has its dimensions changed by css (flexbox), but it doesn't update the element width/height, and will affect when drawing (just remove these lines and try the program to see the problem)
    // so we just update it now
    //HERE should update on resize as well?..
MAIN_CANVAS.width = getCanvasWidth();
MAIN_CANVAS.height = getCanvasHeight();

DRAW_CANVAS.width = MAIN_CANVAS.width;
DRAW_CANVAS.height = MAIN_CANVAS.height;
};



function getCanvasWidth()
{
return parseInt( $( MAIN_CANVAS ).innerWidth() );
}

function getCanvasHeight()
{
return parseInt( $( MAIN_CANVAS ).innerHeight() );
}


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