/*  @Author : Zain Paya
    @NetID  :Zpaya2
    @ MP3A TeaPot
    @ THIS FILE HAS ALL FUNCTIONS RELATED TO SKYBOX
*/

/*
  setupCubeMap()
  this function creates th 6 faces of the cube with the correct images
  @parem none
  @return none
*/
function setupCubeMap() {
  cubeTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
  gl.texImage2D(gl.TEXTURE_CUBE_MAP, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  loadCubeMapFace(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X, cubeTexture, "posx.jpg");  
  loadCubeMapFace(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, cubeTexture, "negx.jpg"); 
  loadCubeMapFace(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, cubeTexture, "posy.jpg");  
  loadCubeMapFace(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, cubeTexture, "negy.jpg");  
  loadCubeMapFace(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, cubeTexture, "posz.jpg");  
  loadCubeMapFace(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, cubeTexture, "negz.jpg");

}

/*
  loadCubeMapeFace
  this function actually merges the texture with the cube face
  @parem gl, target, texture, url
  @return none
*/
function loadCubeMapFace(gl, target, texture, url){
  var image = new Image();
  image.onload = function()
  {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texImage2D(target,0,gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }
  image.src = url;

}

/*
  setupSkyBox()
  this function sets up the sky box and creates the buffers for it as well
  @parem none
  @return none
*/
function setupSkyBox(){
     var skyboxCoords = [
  //front
  -20.0,  20.0, -20.0,
  -20.0, -20.0, -20.0,
   20.0, -20.0, -20.0,
   20.0, -20.0, -20.0,
   20.0,  20.0, -20.0,
  -20.0,  20.0, -20.0,
  //left
  -20.0, -20.0,  20.0,
  -20.0, -20.0, -20.0,
  -20.0,  20.0, -20.0,
  -20.0,  20.0, -20.0,
  -20.0,  20.0,  20.0,
  -20.0, -20.0,  20.0,
  //right
   20.0, -20.0, -20.0,
   20.0, -20.0,  20.0,
   20.0,  20.0,  20.0,
   20.0,  20.0,  20.0,
   20.0,  20.0, -20.0,
   20.0, -20.0, -20.0,
   //back
  -20.0, -20.0,  20.0,
  -20.0,  20.0,  20.0,
   20.0,  20.0,  20.0,
   20.0,  20.0,  20.0,
   20.0, -20.0,  20.0,
  -20.0, -20.0,  20.0,
  //top
  -20.0,  20.0, -20.0,
   20.0,  20.0, -20.0,
   20.0,  20.0,  20.0,
   20.0,  20.0,  20.0,
  -20.0,  20.0,  20.0,
  -20.0,  20.0, -20.0,
  //bottom
  -20.0, -20.0, -20.0,
  -20.0, -20.0,  20.0,
   20.0, -20.0, -20.0,
   20.0, -20.0, -20.0,
  -20.0, -20.0,  20.0,
   20.0, -20.0,  20.0
  ];

  skyboxBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyboxCoords), gl.STATIC_DRAW);
  skyboxBuffer.itemSize = 3;
  skyboxBuffer.numItems = 36;
}

/*
  drawSkyBox()
  this function draws the skybox onto the canvas
  @parem none
  @return none

*/
function drawSkyBox(){
      gl.bindBuffer(gl.ARRAY_BUFFER, skyboxBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, skyboxBuffer.itemSize, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, skyboxBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, skyboxBuffer.itemSize, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, skyboxBuffer.numItems);
}
