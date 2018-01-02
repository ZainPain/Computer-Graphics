/*
Author: Zain Paya
NetID zpaya2
MP4 Particle System
*/
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;

var days=0;
var Sphere_create = 0;

// Create a place to store sphere geometry
var sphereVertexPositionBuffer;

//Create a place to store normals for shading
var sphereVertexNormalBuffer;

var cubeTexture;

// View parameters
var eyePt = vec3.fromValues(0.0,0.0,150.0);
var viewDir = vec3.fromValues(0.0,0.0,-1.0);
var up = vec3.fromValues(0.0,1.0,0.0);
var viewPt = vec3.fromValues(0.0,0.0,0.0);

// Create the normal
var nMatrix = mat3.create();

// Create ModelView matrix
var mvMatrix = mat4.create();

//Create Projection matrix
var pMatrix = mat4.create();

var mvMatrixStack = [];
var SpherePos = [];
var SphereVel = [];
var SphereNum = 10;
var g = -.1;
var timeNow;
var currentlyPressedKeys = [];
var Friction = (-9/10);

//----------------------------------------------------------------------------------
/**
* Pushes matrix onto modelview matrix stack
*/
function mvPushMatrix() {
	var copy = mat4.clone(mvMatrix);
	mvMatrixStack.push(copy);
}


//----------------------------------------------------------------------------------
/**
* Pops matrix off of modelview matrix stack
*/
function mvPopMatrix() {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}

//----------------------------------------------------------------------------------
/**
* Translates degrees to radians
* @param {Number} degrees Degree input to function
* @return {Number} The radians that correspond to the degree input
*/
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

//----------------------------------------------------------------------------------
/**
* Creates a context for WebGL
* @param {element} canvas WebGL canvas
* @return {Object} WebGL context
*/
function createGLContext(canvas) {
	var names = ["webgl", "experimental-webgl"];
	var context = null;
	for (var i=0; i < names.length; i++) {
		try {
			context = canvas.getContext(names[i]);
		} catch(e) {}
			if (context) {
				break;
			}
		}
		if (context) {
			context.viewportWidth = canvas.width;
			context.viewportHeight = canvas.height;
		} else {
			alert("Failed to create WebGL context!");
		}
	return context;
}

//----------------------------------------------------------------------------------
/**
* Loads Shaders
* @param {string} id ID string for shader to load. Either vertex shader/fragment shader
*/
function loadShaderFromDOM(id) {
	var shaderScript = document.getElementById(id);
	
	// If we don't find an element with the specified id
	// we do an early exit
	if (!shaderScript) {
		return null;
	}
	
	// Loop through the children for the found DOM element and
	// build up the shader source code as a string
	var shaderSource = "";
	var currentChild = shaderScript.firstChild;
	while (currentChild) {
		if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
			shaderSource += currentChild.textContent;
		}
		currentChild = currentChild.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}


function setupBuffers() {
	setupSphereBuffers();
}

function draw() {
	var transformVec = vec3.create();

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// We'll use perspective
	mat4.perspective(pMatrix,degToRad(45), gl.viewportWidth / gl.viewportHeight, 0.1, 200.0);

	// We want to look down -z, so create a lookat point in that direction 
	vec3.add(viewPt, eyePt, viewDir);
	// Then generate the lookat matrix and initialize the MV matrix to that view
	mat4.lookAt(mvMatrix,eyePt,viewPt,up); 

	//move to Earth position 
	//mvPushMatrix();
	//Draw Earth 
	//vec3.set(transformVec,)
	 // Set up light parameters
    var Ia = vec3.fromValues(0.0,0.3,1.0);
    var Id = vec3.fromValues(1.0,1.0,1.0);
    var Is = vec3.fromValues(1.0,1.0,1.0);
    
    var lightPosEye4 = vec4.fromValues(0.0,0.0,50.0,1.0);
    lightPosEye4 = vec4.transformMat4(lightPosEye4,lightPosEye4,mvMatrix);
    //console.log(vec4.str(lightPosEye4))
    var lightPosEye = vec3.fromValues(lightPosEye4[0],lightPosEye4[1],lightPosEye4[2]);
    
    //draw Sun
	for(var i = 0;i <SphereNum; i++ )
	{	    // Set up material parameters    
		ka = vec3.fromValues(0.5,0.3,.9);
		kd = vec3.fromValues(0.2,0.5,7.0);
		ks = vec3.fromValues(1.0,1.0,1.0);
		mvPushMatrix();
		//vec3.set(transformVec, SpherePos[i][0] + SphereVel[i][0], SpherePos[i][1] + SphereVel[i][1], SpherePos[i][2] + SphereVel[i][2]);
		vec3.set(transformVec, SpherePos[i][0],SpherePos[i][1],SpherePos[i][2]);
		mat4.translate(mvMatrix,mvMatrix,transformVec);
		vec3.set(transformVec,2.0,2.0,2.0);
		mat4.scale(mvMatrix, mvMatrix,transformVec); 
		uploadLightsToShader(lightPosEye,Ia,Id,Is);
		uploadMaterialToShader(ka,kd,ks);
		setMatrixUniforms();
		drawSphere();
		mvPopMatrix();
	}
}

function animate() {
	UpdateVelocity();
	UpdatePosition();
	

}


function startup() {
	canvas = document.getElementById("myGLCanvas");
	gl = createGLContext(canvas);
	CreateSpherePosition();
	setVelocity();
	setupShaders();
	//setupCubeMap();
	setupBuffers();
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	tick();
}

function tick() {
	requestAnimFrame(tick);
	animate();
	handleKeys();
	draw();

	
}
