/*
Author: Zain Paya
NetID zpaya2
MP4 Particle System
*/
//-------------------------------------------------------------------------
/**
* Populates buffers with data for spheres
*/
function setupSphereBuffers() {

	var sphereSoup=[];
	var sphereNormals=[];
	var numT=sphereFromSubdivision(6,sphereSoup,sphereNormals);
	console.log("Generated ", numT, " triangles");
	sphereVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer); 
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereSoup), gl.STATIC_DRAW);
	sphereVertexPositionBuffer.itemSize = 3;
	sphereVertexPositionBuffer.numItems = numT*3;
	console.log(sphereSoup.length/9);

	// Specify normals to be able to do lighting calculations
	sphereVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals),
	gl.STATIC_DRAW);
	sphereVertexNormalBuffer.itemSize = 3;
	sphereVertexNormalBuffer.numItems = numT*3;

	console.log("Normals ", sphereNormals.length/3);
}

//-------------------------------------------------------------------------
/**
* Draws a sphere from the sphere buffer
*/
function drawSphere(){
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize,
	gl.FLOAT, false, 0, 0);

	// Bind normal buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,
	sphereVertexNormalBuffer.itemSize,
	gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, sphereVertexPositionBuffer.numItems); 
}

