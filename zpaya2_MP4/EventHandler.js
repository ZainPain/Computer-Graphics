/*
Author: Zain Paya
NetID zpaya2
MP4 Particle System
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
    this function creates new spheres or removes all spherse
    @parem none
    @return none

*/
function handleKeys() {
        if (currentlyPressedKeys[32]) {  
            //  Creates new spheres
            SphereNum++;
            var addSpherePos = vec3.create();
            vec3.set(addSpherePos,(2*Math.random() -1) * 50, 2*Math.random() *20, (2*Math.random() -1) *50);
            SpherePos.push(addSpherePos);
            var addVel = vec3.create();
            vec3.set(addVel,0.0,1.0,0.0);
            SphereVel.push(addVel);
            
        } 
        // addes new spherse
        if (currentlyPressedKeys[66]) {
            SphereNum = 0;
            SpherePos = [];
            SphereVel = [];
       
       }
}