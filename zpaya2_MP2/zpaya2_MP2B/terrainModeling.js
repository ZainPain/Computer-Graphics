/*
AUTHOR: ZAIN PAYA
NETID : ZPAYA2
CS418 MP2.1
implemented the diamondsquare algorithm
functions -> DiamondSquare
		  -> DiamondSquareHelper
changed a bit of the terrainFromIteration
*/


//-------------------------------------------------------------------------
function terrainFromIteration(n, minX,maxX,minY,maxY, vertexArray, faceArray,normalArray)
{
    altitude = DiamondSquare(n,0,0,.9);
    //make terrian vertices form iteration
    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
    for(var i=0;i<=n;i++)
       for(var j=0;j<=n;j++)
       {
       	/*pushing terrain data into the vertex array*/
           vertexArray.push(minX+deltaX*j);
           vertexArray.push(minY+deltaY*i);
           vertexArray.push(altitude[i][j]);
           
           normalArray.push(0);
           normalArray.push(0);
           normalArray.push(0);
       }

    //make terrian faces from iteration
    var numT=0;
    for(var i=0;i<n;i++)
       for(var j=0;j<n;j++)
       {
           var vid = i*(n+1) + j;
           faceArray.push(vid);
           faceArray.push(vid+1);
           faceArray.push(vid+n+1);
           
           faceArray.push(vid+1);
           faceArray.push(vid+1+n+1);
           faceArray.push(vid+n+1);
           numT+=2 ;
       }
    
    //sets the terrian height to a sign wave
    //sinTerrian(vertexArray,n);


    //sets the normals of the new terrian
    normalArray = setNorms(faceArray, vertexArray, normalArray);

    return numT;
}

//-------------------------------------------------------------------------
//sets the terrian height to a sign wave
function sinTerrian(vArray, size)
{
    x=0;
    for(i=0; i<=size; i++)
    {
        for(j=0; j<=size*3; j+=3)
        {
            //to index the 1d array of vertices we most treat it as a 2d array
            //i*(size+1)*3+j+2
            //
            //j+2
            //the +2 is to get us to the z compent of the vertice
            //the j is the x direction on the terrian. it goes up by 3 each loop
            // because there are 3 compents in one vertex
            //
            //i*(size+1)*3
            //the * 3 is because there are 3 compents in one vertex
            //(size+1) this lets us skip over all the x compents in a row
            //i is the y direction on the terian
            //
            //now we can access any part of the terrian
            x+=0.01;
            vArray[i*(size+1)*3+j+2]=Math.sin(x);
        }
    }
}

//-------------------------------------------------------------------------
//sets the normals of the new terrian
function setNorms(faceArray, vertexArray, normalArray)
{
    for(var i=0; i<faceArray.length;i+=3)
    {
        //find the face normal
        var x_comp = vec3.fromValues(vertexArray[faceArray[i]*3],vertexArray[faceArray[i]*3+1],vertexArray[faceArray[i]*3+2]);
  
        var y_comp = vec3.fromValues(vertexArray[faceArray[i+1]*3],vertexArray[faceArray[i+1]*3+1],vertexArray[faceArray[i+1]*3+2]);
        
        var z_comp = vec3.fromValues(vertexArray[faceArray[i+2]*3],vertexArray[faceArray[i+2]*3+1],vertexArray[faceArray[i+2]*3+2]);
        
        var vect31=vec3.create(), vect21=vec3.create();
        vec3.sub(vect21,y_comp,x_comp);
        vec3.sub(vect31,z_comp,x_comp)
        var v=vec3.create();
        vec3.cross(v,vect21,vect31);
        
        //add the face normal to all the faces vertices
        normalArray[faceArray[i]*3  ]+=v[0];
        normalArray[faceArray[i]*3+1]+=v[1];
        normalArray[faceArray[i]*3+2]+=v[2];

        normalArray[faceArray[i+1]*3]+=v[0];
        normalArray[faceArray[i+1]*3+1]+=v[1];
        normalArray[faceArray[i+1]*3+2]+=v[2];

        normalArray[faceArray[i+2]*3]+=v[0];
        normalArray[faceArray[i+2]*3+1]+=v[1];
        normalArray[faceArray[i+2]*3+2]+=v[2];

    }
    
    //normalize each vertex normal
    for(var i=0; i<normalArray.length;i+=3)
    {
        var v = vec3.fromValues(normalArray[i],normalArray[i+1],normalArray[i+2]); 
        vec3.normalize(v,v);
        
        normalArray[i  ]=v[0];
        normalArray[i+1]=v[1];
        normalArray[i+2]=v[2];
    }
    
    //return the vertex normal
    return normalArray;
}

//-------------------------------------------------------------------------
function generateLinesFromIndexedTriangles(faceArray,lineArray)
{
    numTris=faceArray.length/3;
    for(var f=0;f<numTris;f++)
    {
        var fid=f*3;
        lineArray.push(faceArray[fid]);
        lineArray.push(faceArray[fid+1]);
        
        lineArray.push(faceArray[fid+1]);
        lineArray.push(faceArray[fid+2]);
        
        lineArray.push(faceArray[fid+2]);
        lineArray.push(faceArray[fid]);
    }
}


//-------------------------------------------------------------------------


/* 	DiamondSquare
	
	parameters are the minimum x, minimum y, size of grid, and the scalefactor or aka the random value that they want
	I create a new array, initialize the four corner points and then call helper function here*/
function DiamondSquare(n, minX, minY, Scale_Factor){
    
    /* creating new array*/
    var altitude = new Array(n+1);
    for(var i = 0; i <= n; i++){
      altitude[i] = new Array(n+1);
    }
    for (var i = 0; i <= n; i++){
      for (var j = 0; j <= n; j++){
        altitude[i][j] = 0;
      }
    }
   
    /* initializing corners*/
    altitude[0][0] = 0;
    altitude[n][0] = 0;
    altitude[0][n] = 0;
    altitude[n][n] = 0;
    
    /*calling helper function*/
    DiamondSquareHelper(altitude, n+1, 0, n+1, 0, n+1, Scale_Factor, n);
    return altitude;
}

/* DiamonSquareHelper
	This function goes through the diamond and square steps of the algorithm and then recursively calles with a scale factor
	 and and the grid factor being reduced by 2 eachtime*/
function DiamondSquareHelper(altitude, size, minX, maxX, minY, maxY, Scale_Factor, grid){
    
	/* BASE CASE*/
    if (grid <= 1) return;
    /*DIAMOND STEP*/
    for (var i = minX + grid; i < maxX; i += grid){
        for (var j = minY + grid; j < maxY; j+= grid){
            var avg = (altitude[i-grid][j-grid] + altitude[i][j-grid] + altitude[i-grid][j] + altitude[i][j])/4;
            altitude[i-grid/2][j-grid/2] = avg + .89 * Scale_Factor;
        }
    }
    /*SQUARE STEP*/
    for (var i = minX + 2*grid; i < maxX; i += grid){
        for (var j = minY + 2*grid; j < maxY; j += grid){
            
              
            var pos1 = altitude[i][(j-grid)];
            var pos2 = altitude[(i-grid/2)][(j-grid/2)]; 
            var pos3 = altitude[(i-grid)][(j-grid)];
            var pos4 = altitude[(i-grid)][j];
            var pos5 = altitude[i][j];
            
            altitude[(i-grid)][(j-grid/2)] = ( pos2 + pos3 + pos4 + altitude[(i-3*grid/2)][(j-grid/2)])/4 + .9 * Scale_Factor;
            
            altitude[i-grid/2][j-grid] = ( pos1 + pos2 + pos3 - pos5 + altitude[(i-grid/2)][(j-3*grid/2)])/4 + .7 * Scale_Factor;
        }
    }
    /*recursive call*/
    DiamondSquareHelper(altitude, size, minX, maxX, minY, maxY, Scale_Factor/2, grid/2);
}


