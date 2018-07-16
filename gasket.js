//This application is a basic exercise from the Edward Angel textbook
//This application will use the functions provided by the MV.js, initShaders.js, and webgl-utils.js provided by the Edward Angel textbook


var canvas;
var gl;

var numTimesToSubdivide = 3;
var points = [];//line7
var colors = [];

var modelMatrix;
var modelMatrixLoc;
var theta = 0.0;

//end of global variables

window.onload = function init(){

//initializes webgl
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl){
		alert("WebGL isn't available");
	}

//declares the outline of the sierpinski triangle
	var vertices = [ 
		vec3(0.0, 0.0, -1.0),
		vec3(0.0, 0.9428, 0.3333),
		vec3(-0.8165, -0.4714, 0.3333),
		vec3(0.8165, -0.4714, 0.3333)
		];

//makes a call to the recursive method that will initialize the colors and vectors for the triangle
	divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], numTimesToSubdivide);

//sets the viewport and the backgournd color for the gl-canvas panel
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.7725, 0.75686, 0.7529, 1.0);

//enables the depth buffer
	gl.enable(gl.DEPTH_TEST);

//the following several lines of code bind the variables to the locations of the shaders 
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");

//finally makes a call to the rendering function which will call requestanimframe function to essentially act as the main loop
	render();
}

//BEGINS THE SUB FUNCTIONS
//
//



//the terminal case for the recursive method that defines the vector and color data for the render info
function triangle(a, b, c, color){
	var baseColors = [
		vec3(0.10196, 0.16078, 0.18824),
		vec3(0.96863, 0.80784, 0.24314),
		vec3(0.69020, 0.03529, 0.03529),
		vec3(0.7725,  0.75686, 0.7529)
		];

	colors.push(baseColors[color]);
	points.push(a);
	colors.push(baseColors[color]);
	points.push(b);
	colors.push(baseColors[color]);
	points.push(c);
}
//calls the base case of the recursive method to draw the triangle
//each call to the triangle function will draw one side of the small triangular pyramid sections
function tetra(a, b, c, d){
	triangle(a, c, b, 0);
	triangle(a, c, d, 1);
	triangle(a, b, d, 2);
	triangle(b, c, d, 3);
}
//The recursive method to be called in the main method to divide the triangular pyramid object to be rendered into as many subdivisions as will be passed into the count variable
function divideTetra(a, b, c, d, count){
	if(count == 0){
		tetra(a, b, c, d);
	}
	else{
		var ab = mix(a, b, 0.5);
		var ac = mix(a, c, 0.5);
		var ad = mix(a, d, 0.5);
		var bc = mix(b, c, 0.5);
		var bd = mix(b, d, 0.5);
		var cd = mix(c, d, 0.5);
		count--;
		divideTetra( a, ab, ac, ad, count);
		divideTetra(ab,  b, bc, bd, count);
		divideTetra(ac, bc,  c, cd, count);
		divideTetra(ad, bd, cd,  d, count);
	}
}


//This is the render function
//The model matrix is calculated here and is prepped for the vertex shader here
function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	theta = theta + 0.005;
    	modelMatrix = [ Math.cos(theta), 	-Math.sin(theta), 	0.0, 0.0,
		     	  Math.sin(theta),	Math.cos(theta), 	0.0, 0.0,
		     	  0.0,	     		0.0, 			1.0, 0.0,
		     	  0.0,	     		0.0, 			0.0, 1.0,
		    	];

    	gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));

//the function to draw the object
	gl.drawArrays(gl.TRIANGLES, 0, points.length);

//this function  call will essentially act as the main render loop
	window.requestAnimFrame(render);
}