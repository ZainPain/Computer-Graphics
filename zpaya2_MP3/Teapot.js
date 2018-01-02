/*	@Author : Zain Paya
	@NetID  :Zpaya2
	@ MP3A TeaPot
	@ main file for everything
*/


var gl;
var canvas;

var vertexPositionBuffer;

var days=0;

// Shaderprograms
var shaderProgram;
var shaderProgram1;
var shaderProgram2;
var shaderProgram3;
// Create a place to store sphere geometry
var teapotVertexPositionBuffer;

var teapotColorBuffer ;
var teapotColor = [];
//Create a place to store normals for shading
var teapotVertexNormalBuffer;

var teapotFaceBuffer;
// for the radio map
var Switch = 1;

// View parameters
var eyePt = vec3.fromValues(0.0,2.0,25.0);
var viewDir = vec3.fromValues(0.0,0.0,-1.0);
var up = vec3.fromValues(0.0,1.0,0.0);
var viewPt = vec3.fromValues(0.0,0.0,0.0);

// for rotations
var UDAngle=0.0, eyeQuatUD = quat.create(),RLAngle = 0.0, eyeQuatLR=quat.create();
var axisToRot = vec3.fromValues(1.0,0.0,0.0);
var axisToRot2 = vec3.fromValues(0.0,1.0,0.0);
var axisToRot3 = vec3.fromValues(0.0,0.0,1.0);

var rotAngle = 0;
var rotateSpeed = 0.01;
var teapotAngle = 0;
var teapotSpeed = 0.01;
var currentlyPressedKeys = [];
// Create the normal
var nMatrix = mat3.create();

// Create ModelView matrix
var mvMatrix = mat4.create();

//Create Projection matrix
var pMatrix = mat4.create();

var mvMatrixStack = [];
var Vteapot = [];
var Nteapot = [];
var Fteapot = [];
//var teapotColorBuffer = new array();
/* Cube textures */
var cubeTexture;
var skyboxBuffer;

//-------------------------------------------------------------------------
/**
* 	setupTeapotBuffer()
	sets up the Teapot buffer once OBJ file is parsed
* 	@param none
 	@Return none
*/
function setupTeapotBuffer() {

	/********************************************************/
	
	teapotVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer); 
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Vteapot), gl.STATIC_DRAW);
	teapotVertexPositionBuffer.itemSize = 3;
	teapotVertexPositionBuffer.numItems = Vteapot.length;

	// Specify normals to be able to do lighting calculations
	teapotVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Nteapot),
	gl.STATIC_DRAW);
	teapotVertexNormalBuffer.itemSize = 3;
	teapotVertexNormalBuffer.numItems =Nteapot.length;

	teapotFaceBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotFaceBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Fteapot), gl.STATIC_DRAW);
	teapotFaceBuffer.itemSize = 1;
	teapotFaceBuffer.numItems = Fteapot.length;
/*	console.log("vetex =", Vteapot);
	console.log("Faces =", Fteapot);
	console.log("Normal =", Nteapot);*/
	console.log("vetex =", Vteapot.length);
	console.log("Faces =", Fteapot.length);
	console.log("Normal =", Nteapot.length);
}


//-------------------------------------------------------------------------
/**
* 	Draws a sphere from the sphere buffer
	drawTeapot()
	@param None
	@return None
*/
function drawTeapot(){
	gl.polygonOffset(0,0);
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, teapotVertexPositionBuffer.itemSize,
	gl.FLOAT, false, 0, 0);
	  gl.bindBuffer(gl.ARRAY_BUFFER, teapotColorBuffer);
 	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            4, gl.FLOAT, false, 0, 0);
	// Bind normal buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,teapotVertexNormalBuffer.itemSize,
	gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,teapotFaceBuffer );
	gl.drawElements(gl.TRIANGLES, teapotFaceBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
}

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



/*
	setupBUffers()
	sets up both skybox and teapot buffer
	@parem None
	@return None
*/
function setupBuffers() {
	setupTeapotBuffer();
	setupSkyBox();
}

/*
	draw()
	draws both skybox and teapot onto canvas
	@parem NOne
	@return none
*/
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

	/////////////////

	  // Set up light parameters
    var Ia = vec3.fromValues(0.3,0.3,0.4);
    var Id = vec3.fromValues(0.6,0.6,0.6);
    var Is = vec3.fromValues(0.9,0.9,0.9);
    
    var lightPosEye4 = vec4.fromValues(0.0,2.0,25.0);
    lightPosEye4 = vec4.transformMat4(lightPosEye4,lightPosEye4,mvMatrix);
    //console.log(vec4.str(lightPosEye4))
    var lightPosEye = vec3.fromValues(lightPosEye4[0],lightPosEye4[1],lightPosEye4[2]);
    
    // Set up material parameters    
    var ka = vec3.fromValues(1.0,0.7,0.0);
    var kd = vec3.fromValues(0.6,0.6,0.0);
    var ks = vec3.fromValues(0.0,1.0,1.0);
	/////////////////
	
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
	//move to Earth position 
/*	shaderProgram = shaderProgram2;
  	gl.useProgram(shaderProgram2);*/
  	    if(Switch){
  	shaderProgram = shaderProgram3;
  	gl.useProgram(shaderProgram);
  	}else{  	
  	shaderProgram = shaderProgram2;
  	gl.useProgram(shaderProgram);
  	}
  	///
    if(document.getElementById("Reflection").checked){
      uploadLightsToShader([0,2,20],[1.0,1.0,1.0],[2.0,2.0,0.0],[0.0,0.0,0.0]);
      Switch = 1;
    }

    if(document.getElementById("Shaded").checked){
      uploadLightsToShader([0,3,3],[0.0,0.5,0.7],[0.2,0.2,0.0],[1.0,1.0,1.0]);
      Switch = 0;
    }

  	///
	mvPushMatrix();
    //uploadLightsToShader(lightPosEye,Ia,Id,Is);
    //uploadMaterialToShader(ka,kd,ks);
	gl.enableVertexAttribArray(shaderProgram.aVertexTextureCoords);
	//Draw Earth 
	vec3.set(transformVec,1.0,1.0,1.0);
	//mat4.rotate(mvMatrix, mvMatrix, rotateSpeed, vec3.fromValues(0, 1, 0));
	mat4.rotateY(mvMatrix, mvMatrix, degToRad(rotAngle)); 
	mat4.scale(mvMatrix, mvMatrix,transformVec); 
	////

	////
	setMatrixUniforms();

          uploadLightsToShader([0,3,3],[0.0,0.5,0.7],[0.2,0.2,0.0],[1.0,1.0,1.0]);

	drawTeapot();
	mvPopMatrix();

	shaderProgram = shaderProgram1;
  	gl.useProgram(shaderProgram1);
	/* DRAWING SKYBOX */
  	mvPushMatrix();

  	vec3.set(transformVec,2.0,2.0,2.0);
	mat4.scale(mvMatrix, mvMatrix,transformVec);
  	setMatrixUniforms();
  	drawSkyBox();
  	mvPopMatrix();
}

/*
	getTeapot()
	html executes this function first, this function calls helper function to set up the vertex, face, and normal buffers
	@parem none
	@return none
*/
function getTeapot()
{
  readTextFile("teapot_0.obj", fileparser);
  startup();


}

/*	startup()
	executed right after getTeaput, sets everything up 
	@parem none
	@return none
*/
function startup() {

	canvas = document.getElementById("myGLCanvas");
	gl = createGLContext(canvas);
	setupShaders1();
    setupShaders2();
    setupShaders3();
	setupCubeMap();
	setupBuffers();
	gl.clearColor(0.0, 1.0, 3.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	tick();
}
/*	tick()
	updates canvas every frame
	@parem none
	@return none
*/
function tick() {
	requestAnimFrame(tick);
	handleKeys() 
	draw();
}

