/**
 * Gets a file from the server for processing on the client side.
 *
 * @param  file A string that is the name of the file to get
 * @param  callbackFunction The name of function (NOT a string) that will receive a string holding the file
 *         contents.
 *
 */


function readTextFile(file, callbackFunction)
{
    console.log("reading "+ file);
    var rawFile = new XMLHttpRequest();
    var allText = [];
    rawFile.open("GET", file, true);
    
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                 callbackFunction(rawFile.responseText);
                 console.log("Got text file!");
                 
            }
        }
    }
    rawFile.send(null);
}

function fileparser(text)
{
  var DATA = text.split('\n');
  //console.log(DATA);
  var line;
 // console.log("lines =",DATA.length);
    var vcount = 0;
    var fcount = 0;
    teapotColorBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotColorBuffer);

  for(line = 0; line < DATA.length;line++)
  {

    var curLine = DATA[line].split(' ');


    if(curLine[0] == 'v' )
    {
      vcount++;
      Vteapot.push(Number(curLine[1]));
      Vteapot.push(Number(curLine[2]));
      Vteapot.push(Number(curLine[3]));
      Nteapot.push(0);
      Nteapot.push(0);
      Nteapot.push(0);
      teapotColor.push(0.0);
      teapotColor.push(.5);
      teapotColor.push(0.7);
      teapotColor.push(1.0);

    }


    if(curLine[0] == 'f')
    {
      fcount++;
      Fteapot.push(curLine[2] - 1);
      Fteapot.push(curLine[3] - 1);
      Fteapot.push(curLine[4] - 1);
    }
  }
  // console.log("vertices =", Vteapot.length);
  // console.log("Faces = ", Fteapot.length);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotColor), gl.STATIC_DRAW);
/*  teapotColorBuffer.itemSize = 4;
  teapotColor.numberOfItems = vcount;*/

  Nteapot = setNorms(Fteapot,Vteapot,Nteapot);
  setupTeapotBuffer();

/*  console.log("normals =", Nteapot);
  console.log("normals =", Nteapot.length);*/
}