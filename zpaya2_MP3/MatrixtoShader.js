/*  @Author : Zain Paya
    @NetID  :Zpaya2
    @ MP3A TeaPot
    @ THIS FILE HAS ALL THE UPLOADING MATRIX TO SHADER FUNCTIONS
*/
//-------------------------------------------------------------------------
/**
* Sends Modelview matrix to shader
*/
function uploadModelViewMatrixToShader() {
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

//-------------------------------------------------------------------------
/**
* Sends projection matrix to shader
*/
function uploadProjectionMatrixToShader() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform,
	false, pMatrix);
}

//-------------------------------------------------------------------------
/**
* Generates and sends the normal matrix to the shader
*/
function uploadNormalMatrixToShader() {
	nMatrix = mvMatrix
	mat4.transpose(nMatrix,nMatrix);
	mat4.invert(nMatrix,nMatrix);
	gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);
}

//----------------------------------------------------------------------------------
/**
* Sends projection/modelview matrices to shader
*/
function setMatrixUniforms() {
	uploadModelViewMatrixToShader();
	uploadNormalMatrixToShader();
	uploadProjectionMatrixToShader();
}

function uploadLightsToShader(loc,a,d,s) {
	gl.useProgram(shaderProgram);
	gl.uniform3fv(shaderProgram.uniformLightPositionLoc, loc);
	gl.uniform3fv(shaderProgram.uniformAmbientLightColorLoc, a);
	gl.uniform3fv(shaderProgram.uniformDiffuseLightColorLoc, d);
	gl.uniform3fv(shaderProgram.uniformSpecularLightColorLoc, s);
}

//-------------------------------------------------------------------------
function uploadMaterialToShader(a,d,s) {
  gl.uniform3fv(shaderProgram.uniformAmbientMatColorLoc, a);
  gl.uniform3fv(shaderProgram.uniformDiffuseMatColorLoc, d);
  gl.uniform3fv(shaderProgram.uniformSpecularMatColorLoc, s);
}

