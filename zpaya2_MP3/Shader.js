/*  @Author : Zain Paya
    @NetID  :Zpaya2
    @ MP3A TeaPot
    @ File for shader
*/



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
/*
	setupShaders()
	this function sets up, links and uses the vertex and fragment shaders
	@parem none
	@return none
*/
function setupShaders1() {
  vertexShader = loadShaderFromDOM("shader-vs");
  //link shader1
  fragmentShader = loadShaderFromDOM("shader-fs1");
  
  shaderProgram1 = gl.createProgram();
  gl.attachShader(shaderProgram1, vertexShader);
  gl.attachShader(shaderProgram1, fragmentShader);
  gl.linkProgram(shaderProgram1);

  if (!gl.getProgramParameter(shaderProgram1, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram1);
  shaderProgram1.vertexPositionAttribute = gl.getAttribLocation(shaderProgram1, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram1.vertexPositionAttribute);

/*  shaderProgram1.vertexColorAttribute = gl.getAttribLocation(shaderProgram1, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram1.vertexColorAttribute);*/
  shaderProgram1.mvMatrixUniform = gl.getUniformLocation(shaderProgram1, "uMVMatrix");
  shaderProgram1.pMatrixUniform = gl.getUniformLocation(shaderProgram1, "uPMatrix");
	shaderProgram1.uniformLightPositionLoc = gl.getUniformLocation(shaderProgram1, "uLightPosition"); 
	shaderProgram1.uniformAmbientLightColorLoc = gl.getUniformLocation(shaderProgram1, "uAmbientLightColor"); 
	shaderProgram1.uniformDiffuseLightColorLoc = gl.getUniformLocation(shaderProgram1, "uDiffuseLightColor");
	shaderProgram1.uniformSpecularLightColorLoc = gl.getUniformLocation(shaderProgram1, "uSpecularLightColor");
}
//setup for shader2
function setupShaders2() {
  vertexShader = loadShaderFromDOM("shader-vs");
  //link shader2
  fragmentShader = loadShaderFromDOM("shader-fs2");
  
  shaderProgram2 = gl.createProgram();
  gl.attachShader(shaderProgram2, vertexShader);
  gl.attachShader(shaderProgram2, fragmentShader);
  gl.linkProgram(shaderProgram2);

  if (!gl.getProgramParameter(shaderProgram2, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram2);
  shaderProgram2.vertexPositionAttribute = gl.getAttribLocation(shaderProgram2, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram2.vertexPositionAttribute);

  shaderProgram2.vertexColorAttribute = gl.getAttribLocation(shaderProgram2, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram2.vertexColorAttribute);
  shaderProgram2.mvMatrixUniform = gl.getUniformLocation(shaderProgram2, "uMVMatrix");
  shaderProgram2.pMatrixUniform = gl.getUniformLocation(shaderProgram2, "uPMatrix");
  shaderProgram2.uniformLightPositionLoc = gl.getUniformLocation(shaderProgram2, "uLightPosition"); 
  shaderProgram2.uniformAmbientLightColorLoc = gl.getUniformLocation(shaderProgram2, "uAmbientLightColor"); 
  shaderProgram2.uniformDiffuseLightColorLoc = gl.getUniformLocation(shaderProgram2, "uDiffuseLightColor");
  shaderProgram2.uniformSpecularLightColorLoc = gl.getUniformLocation(shaderProgram2, "uSpecularLightColor"); 

}
//setup for shader3
function setupShaders3() {
  vertexShader = loadShaderFromDOM("shader-vs");
  //link shader3
  fragmentShader = loadShaderFromDOM("shader-fs3");
  
  shaderProgram3 = gl.createProgram();
  gl.attachShader(shaderProgram3, vertexShader);
  gl.attachShader(shaderProgram3, fragmentShader);
  gl.linkProgram(shaderProgram3);

  if (!gl.getProgramParameter(shaderProgram3, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram3);
  shaderProgram3.vertexPositionAttribute = gl.getAttribLocation(shaderProgram3, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram3.vertexPositionAttribute);
/*
  shaderProgram3.vertexColorAttribute = gl.getAttribLocation(shaderProgram3, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram3.vertexColorAttribute);*/
  shaderProgram3.mvMatrixUniform = gl.getUniformLocation(shaderProgram3, "uMVMatrix");
  shaderProgram3.pMatrixUniform = gl.getUniformLocation(shaderProgram3, "uPMatrix");
  shaderProgram3.uniformLightPositionLoc = gl.getUniformLocation(shaderProgram3, "uLightPosition"); 
  shaderProgram3.uniformAmbientLightColorLoc = gl.getUniformLocation(shaderProgram3, "uAmbientLightColor"); 
  shaderProgram3.uniformDiffuseLightColorLoc = gl.getUniformLocation(shaderProgram3, "uDiffuseLightColor");
  shaderProgram3.uniformSpecularLightColorLoc = gl.getUniformLocation(shaderProgram3, "uSpecularLightColor");
}