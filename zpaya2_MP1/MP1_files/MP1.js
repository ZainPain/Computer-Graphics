
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;
var stripeBuffer;


// Create ModelView matrix
var mvMatrix = mat4.create();

//Create Projection matrix
var pMatrix = mat4.create();


// Create a place to store vertex colors
var vertexColorBuffer;
var stripecolorbuffer;

var mvMatrix = mat4.create();
var rotAngle = 0;
var lastTime = 0;
var deg = 0;
//----------------------------------------------------------------------------------

var mvMatrixStack = [];

function mvPushMatrix() {
    var copy = mat4.clone(mvMatrix);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}
//----------------------------------------------------------------------------------
function setMatrixUniforms() {
	/* SETTING UNIFORM MATRIX TRANSFORMS*/
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
}



function degToRad(degrees) {
	/* CONVERTING TO RAD FOR ROTATIONS*/
        return degrees * Math.PI / 180;
}


function createGLContext(canvas) {
	/* creates a canvas*/
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

function loadShaderFromDOM(id) {
	/* gets the document object module*/
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

function setupShaders() {
	/* Setting up the two shaders*/
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  
}

function setupBuffers() {
	/* creates vertex and fragment shader*/
  vertexPositionBuffer = gl.createBuffer(); /* creates new buffer*/
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer); /* allows the vertices to be binded to the buffer*/
	  
  /* this array will hold the vertices for the dark blue icon*/
  var triangleVertices = [
  	
  			/* top Bar*/
  			-0.90,  0.90,  0.0,
  			-0.90,  0.70,  0.0,
  			-0.70,  0.70,  0.0,

  			-0.90,  0.90,  0.0,
  			-0.90,  0.70,  0.0,
  			-0.25,  0.70,  0.0,

  			-0.90,  0.90,  0.0,
  			-0.25,  0.70,  0.0,
  			 0.90,  0.90,  0.0,

  			-0.25,  0.70,  0.0,
  			 0.25,  0.70,  0.0,
  			 0.90,  0.90,  0.0,

  			 0.25,  0.70,  0.0,
  			 0.70,  0.70,  0.0,
  			 0.90,  0.90,  0.0,

  			 0.70,  0.70,  0.0,
  			 0.90,  0.70,  0.0,
  			 0.90,  0.90,  0.0,

  		/* onto the left leg*/
  			-0.70,  0.70,  0.0,
  			-0.25,  0.70,  0.0,
  			-0.70, -0.25,  0.0,

  			-0.25,  0.70,  0.0, 
  			-0.70, -0.25,  0.0,
  			-0.25,  0.45,  0.0,

  			-0.25,  0.45,  0.0,
  			-0.25,  0.00,  0.0,
  			-0.70, -0.25,  0.0,

  			-0.25,  0.00,  0.0,
  			-0.70, -0.25,  0.0,
  			-0.25, -0.25,  0.0,

  			/* carving left side of the I*/
  			-0.25,  0.45,  0.0,
  			-0.10,  0.45,  0.0,
  			-0.25,  0.00,  0.0,

  			-0.10,  0.45,  0.0,
  			-0.25,  0.00,  0.0,
  			-0.10,  0.00,  0.0,

  			 0.25,  0.45,  0.0,
  			 0.10,  0.45,  0.0,
  			 0.25,  0.00,  0.0,

  			 0.10,  0.45,  0.0,
  			 0.25,  0.00,  0.0,
  			 0.10,  0.00,  0.0,

  			 /* Right Leg*/

  			 0.70,  0.70,  0.0,
  			 0.25,  0.70,  0.0,
  			 0.70, -0.25,  0.0,

  			 0.25,  0.70,  0.0, 
  			 0.70, -0.25,  0.0,
  			 0.25,  0.45,  0.0,

  			 0.25,  0.45,  0.0,
  			 0.25,  0.00,  0.0,
  			 0.70, -0.25,  0.0,

  			 0.25,  0.00,  0.0,
  			 0.70, -0.25,  0.0,
  			 0.25, -0.25,  0.0

  		  ];

   
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW); /* add vertex data into buffer*/
  vertexPositionBuffer.itemSize = 3;  /* groups the x,y,z coordinates together*/
  vertexPositionBuffer.numberOfItems = 54; /* tells the bufer how many vertices are stored there*/
  
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  var colors = [

  		/* Colors for the badge, all vertices are dark blue*/
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
       
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,

        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0,
        0.0, 0.0, 0.3, 1.0
    ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 54;  

  // creating buffer for testing purposes

  stripeBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, stripeBuffer);

  /* holds vertex position for the stripes*/
  var stripes = [
      	-0.70, -0.30, 0.0,
      	-0.57, -0.30, 0.0,
      	-0.70, -0.50, 0.0,
        -0.57, -0.30, 0.0,
      	-0.70, -0.50, 0.0,
      	-0.57, -0.60, 0.0,

		-0.44, -0.30, 0.0,
		-0.31, -0.30, 0.0,
		-0.44, -0.66, 0.0,
		-0.31, -0.30, 0.0,
		-0.44, -0.66, 0.0,
		-0.31, -0.76, 0.0,
		
		-0.18, -0.30, 0.0,
		-0.05, -0.30, 0.0,
		-0.18, -0.82, 0.0,
		-0.05, -0.30, 0.0,
		-0.18, -0.82, 0.0,
		-0.05, -0.92, 0.0,


		 0.21, -0.30, 0.0,
		 0.08, -0.30, 0.0,
		 0.21, -0.82, 0.0,
		 0.08, -0.30, 0.0,
		 0.21, -0.82, 0.0,
		 0.08, -0.92, 0.0,

		 0.47, -0.30, 0.0,
		 0.34, -0.30, 0.0,
		 0.47, -0.66, 0.0,
		 0.34, -0.30, 0.0,
		 0.47, -0.66, 0.0,
		 0.34, -0.76, 0.0,

		 0.73, -0.30, 0.0,
		 0.60, -0.30, 0.0,
		 0.73, -0.50, 0.0,
		 0.60, -0.30, 0.0,
		 0.73, -0.50, 0.0,
		 0.60, -0.60, 0.0

		  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stripes), gl.STATIC_DRAW);
  stripeBuffer.itemSize = 3; 
  stripeBuffer.numberOfItems = 36;

  stripecolorbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, stripecolorbuffer);

  var stripColor = [
  		/* buffer for the orange stripes*/
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,

   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,

	    1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,

   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,

   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,

   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0,
   		1.0, 0.5, 0.0, 1.0


   	];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stripColor), gl.STATIC_DRAW);
  stripecolorbuffer.itemSize = 4;
  stripecolorbuffer.numItems = 36;
}

function draw() { 
  /* draws and rotates the badge*/
/*  var transformVec = vec3.create();
  vec3.set(transformVec, 10.0, 10.0, 1);*/
  
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
  mat4.identity(mvMatrix);

  /* rotates the badge from all three axes*/
  mat4.rotateX(mvMatrix, mvMatrix, degToRad(rotAngle));
  mat4.rotateY(mvMatrix, mvMatrix, degToRad(rotAngle));  
  mat4.rotateZ(mvMatrix, mvMatrix, degToRad(rotAngle));
  

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);

    // Testing
  gl.bindBuffer(gl.ARRAY_BUFFER, stripeBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         stripeBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, stripecolorbuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            stripecolorbuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  // Testing concluded
/*  mat4.identity(stripeBuffer);
  mat4.rotateX(stripeBuffer, stripeBuffer, degToRad(rotAngle)); */   
  gl.drawArrays(gl.TRIANGLES, 0, stripeBuffer.numberOfItems);
}

function animate() {
	/* animates, performs non affine transformation */
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;    
        /*rotAngle used for rotation*/
        rotAngle= (rotAngle+1.0) % 360;
    }
    lastTime = timeNow;
    deg += 0.1;
    	/* Make the stipes dance using trig functions*/
      var stripes = [
      	-0.70, -0.30, 0.0,
      	-0.57, -0.30, 0.0,
      	-0.70, -0.50+Math.cos(deg) * .2, 0.0,
        -0.57, -0.30, 0.0,
      	-0.70, -0.50+Math.cos(deg) * .2, 0.0,
      	-0.57, -0.60+Math.sin(deg) * .3, 0.0,

		-0.44, -0.30, 0.0,
		-0.31, -0.30, 0.0,
		-0.44, -0.66+Math.sin(deg) * .3, 0.0,
		-0.31, -0.30, 0.0,
		-0.44, -0.66+Math.sin(deg) * .3, 0.0,
		-0.31, -0.76+Math.cos(deg) * .3, 0.0,
		
		-0.18, -0.30, 0.0,
		-0.05, -0.30, 0.0,
		-0.18, -0.82+Math.cos(deg) * .5, 0.0,
		-0.05, -0.30, 0.0,
		-0.18, -0.82+Math.cos(deg) * .5, 0.0,
		-0.05, -0.92+Math.sin(deg) * .5, 0.0,


		 0.21, -0.30, 0.0,
		 0.08, -0.30, 0.0,
		 0.21, -0.82+Math.cos(deg) * .5, 0.0,
		 0.08, -0.30, 0.0,
		 0.21, -0.82+Math.cos(deg) * .5, 0.0,
		 0.08, -0.92+Math.sin(deg) * .5, 0.0,

		 0.47, -0.30, 0.0,
		 0.34, -0.30, 0.0,
		 0.47, -0.66+Math.sin(deg) * .3, 0.0,
		 0.34, -0.30, 0.0,
		 0.47, -0.66+Math.sin(deg) * .3, 0.0,
		 0.34, -0.76+Math.cos(deg) * .3, 0.0,

		 0.73, -0.30, 0.0,
		 0.60, -0.30, 0.0,
		 0.73, -0.50+Math.cos(deg) * .2, 0.0,
		 0.60, -0.30, 0.0,
		 0.73, -0.50+Math.cos(deg) * .2, 0.0,
		 0.60, -0.60+Math.sin(deg) * .3, 0.0

		  ];
		  gl.bindBuffer(gl.ARRAY_BUFFER,stripeBuffer);
		  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stripes), gl.DYNAMIC_DRAW); 	
		  stripeBuffer.itemSize = 3;
  		  stripeBuffer.numberOfItems = 36;

}

function startup() {
	/*  starts webgl function*/
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders(); 
  setupBuffers();
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}

function tick() {
	/* draw and animate*/
    requestAnimFrame(tick);
    draw();
    animate();
}

