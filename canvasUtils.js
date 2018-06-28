"use strict";
var scrollerObj = new Scroller(function(left, top, zoom) {
    // apply coordinates/zooming
}, {
    zooming: true,
    locking: false,
    bouncing: false,
    animating: false,
    minZoom: 1,
    maxZoom: 10
});

var canvas, ctx, mousedown = false, mousemove = 0;

function prepareCanvas() {
    canvas = document.getElementById("canvas");
    canvas.onselectstart = function() { return false; }
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    canvas.style.width = "800px";
    canvas.style.height = "800px";
    ctx = new C2S(800,800);
    // ctx = canvas.getContext("2d");

    ctx.lineCap = 'round';

    scrollerObj.setDimensions(800, 800, 800, 800);	//I'm almost certain that I'm doing this the wrong way, but somehow it works flawlessly
    scrollerObj.setPosition($('canvas').position().left, $('canvas').position().top);

    canvas.addEventListener("mousedown", function(e) {
        scrollerObj.doTouchStart([{ pageX: e.pageX, pageY: e.pageY }], e.timeStamp);
        mousemove = 0;
        mousedown = true;
        redraw();
    }, false);

    canvas.addEventListener("mousemove", function(e) {
        mousemove += 1;
        if (!mousedown) { return; }
        scrollerObj.doTouchMove([{ pageX: e.pageX, pageY: e.pageY }], e.timeStamp);
        redraw();
    }, false);

    canvas.addEventListener("mouseup", function(e) {
        if (mousemove <= 1) { //ignore the first mouseMove as sometimes it's triggered together with mouseDown
            doClick(e);
        }
        if (!mousedown) { return; }
        scrollerObj.doTouchEnd(e.timeStamp);
        mousedown = false;
        redraw();
    }, false);

};

function resetZoom() {
    scrollerObj.zoomTo(1);
}

function getMouse(e) {
    var mouseX = e.pageX - $('canvas').position().left, mouseY = e.pageY - $('canvas').position().top;
    var data = scrollerObj.getValues();
    mouseX = (data.left + mouseX) * canvasScale / data.zoom, mouseY = (data.top + mouseY) * canvasScale / data.zoom;
    return { x: mouseX, y: mouseY };
}

$('canvas').mousewheel(function(e, delta, deltaX, deltaY) {
    if (selectedCircle) return;
    scrollerObj.doMouseZoom(-delta * 3, e.timeStamp, e.pageX, e.pageY);
    redraw();
    return false;
})

$(document).on("contextmenu", "canvas", function(e) {
    return false;
});

function createFinalImage() {
    dirtyRender = 0;
    redraw();
// Ancien code pour créer png
//	var e = document.createElement('a');
//    e.href = canvas.toDataURL();
//    e.download = 'gallifreyan.png';
//    document.body.appendChild(e);
//    e.click();
//    document.body.removeChild(e);
//    var e = document.createElement('a');
	//////
	
	//Code original que j'essaie de bidouiller 
	// Chart1 est l'objet de ce code
	//CanvastoSVG est dans le fichier TestCanvastosvg.js qui n'est pas rapellé ici mais dans l'index html
	// TargetSVG n'a pas l'air d'être dans aucun de ces deux fichiers
	//// *deja com* Create image of chart1
	////				var img = chart1.canvas.toDataURL("image/png");
	////				// Add link to download image
	////				document.getElementById('export').href = img;
	////				
	////				var targetSVG = document.getElementById('svg');
	////				CanvasToSVG.convert(chart1.canvas, targetSVG);
	////				document.getElementById('export').href = targetSVG.firstChild.imageData;
	////				var s = document.getElementById('2');
	////				document.getElementById('svgcode').value = "<!-- Copy the contents of this box into a text editor, then save the file with a .svg extension.-->\n\n\n" +  svgToString(targetSVG);
        //////*deja comm*				alert(svgToString(s.childNodes[1], 0));
	
	//test pour transformer en fichier svg
    //e.href = canvas.toDataURL("image/png");



					
	//var targetSVG = document.getElementById('svg');
	//CanvasToSVG.convert(canvas, targetSVG);
	document.getElementById('export').href = targetSVG.firstChild.imageData;
	//var s = document.getElementById('2');
	//document.getElementById('svgcode').value = "<!-- Copy the contents of this box into a text editor, then save the file with a .svg extension.-->\n\n\n" +  svgToString(targetSVG);
//					alert(svgToString(s.childNodes[1], 0));
    
	var svg = ctx.getSvg();
	//fin du test 
	
	
    dirtyRender = 1;
    redraw();
    return;
}
