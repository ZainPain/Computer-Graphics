/*  @Author : Zain Paya
    @NetID  :Zpaya2
    @ MP3A TeaPot
    @ FIle for Calculating Normals
*/

/*
    setNorms
    this function calculates normals and stores into array given face array and vertex array
    @parem faceArray - array of face data
    @parem vertexArray - array of vertex data
    @parem normalArray - empty array which gets fill with normal vectors
    @return normalArray
*/
function setNorms(faceArray, vertexArray, normalArray)
{

/*    console.log(faceArray);
    console.log(vertexArray); */
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
        if(i + 2 > normalArray.length)
          break;  
        normalArray[i  ]=v[0];
        normalArray[i+1]=v[1];
        normalArray[i+2]=v[2];
    }
    
    //return the vertex normal
    return normalArray;
}