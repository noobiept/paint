/*global $, Paint*/
/*jslint vars: true, white: true*/

"use strict";

window.onload = function()
{
var canvas = document.createElement("canvas");

canvas.id = 'mainCanvas';
canvas.width = 800;
canvas.height = 400;

var container = document.body;

container.appendChild( canvas );

var controls = $.ajax({ url:'paint_controls.html', success: function(data)
    {
    var a = $( data );
    
    container.appendChild( a.get(0) );
    
    Paint( canvas, container );
    }});
};

