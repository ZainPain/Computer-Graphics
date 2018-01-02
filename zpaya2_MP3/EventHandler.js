/*  @Author : Zain Paya
    @NetID  :Zpaya2
    @ MP3A TeaPot
    @File for Event Handling
*/

/*  handleKeyDown(event)
    RTDC
    @parem Event
    @return none
*/
function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
}

/*  handleKeyUp(event)
    RTDC
    @parem Event
    @return none
*/
function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
}

/*
    handleKeys()
    this function takes user input and rotates eyepoint of teapot
    @parem none
    @return none

*/
function handleKeys() {
        if (currentlyPressedKeys[65]) {  //  A
          rotAngle+= 2 %360;
            
        } 
        else if (currentlyPressedKeys[68]) {  // D
           
            rotAngle-= 2 %360;
            

        } 
        if(currentlyPressedKeys[87]) {
            vec3.rotateY(eyePt, eyePt, vec3.fromValues(0, 0, 0), -rotateSpeed);
            vec3.subtract(viewDir, vec3.fromValues(0, 0, 0), eyePt);
            vec3.normalize(viewDir, viewDir);
            mat4.lookAt(mvMatrix, eyePt, viewDir, up);
            flag = 1;
        }
         else if(currentlyPressedKeys[83]) {
            vec3.rotateY(eyePt, eyePt, vec3.fromValues(0, 0, 0), rotateSpeed);
            vec3.subtract(viewDir, vec3.fromValues(0, 0, 0), eyePt);
            vec3.normalize(viewDir, viewDir);
            mat4.lookAt(mvMatrix, eyePt, viewDir, up);
            flag = 0;
        }
}