/*
Author: Zain Paya
NetID zpaya2
MP4 Particle System
*/

/*  CreateSpherePosition
    Creates and stores the initial position of the spheres
    @parem none
    @return none
*/
function CreateSpherePosition()
{
	var i;
	for(i = 0; i < SphereNum; i++)
	{	var pos = vec3.create();
		vec3.set(pos,(2*Math.random() -1) * 50, 2*Math.random() *20, (2*Math.random() -1) *50);
		SpherePos.push(pos);
	}
	
}


/*  setVelocity
    Initializes velocity
    @parem none
    @return none
*/
function setVelocity()
{
	var i;
	for(i = 0; i < SphereNum; i++)
	{
		var Vel = vec3.create();
		vec3.set(Vel,0.0,1.0,0.0);
		SphereVel.push(Vel);

	}
}

/*  UpdateVelocity
	updates the velocity
    @parem none
    @return none
*/
function UpdateVelocity()
{
	var i;
	for(i = 0; i < SphereNum; i++)
	{
		var update_y;
		if((SpherePos[i][1] + SphereVel[i][1]) <= -20){
			update_y = Friction*SphereVel[i][1];
			vec3.set(SphereVel[i], SphereVel[i][0], update_y, SphereVel[i][2]);
			continue;
		}
		else{
			update_y = SphereVel[i][1];
		}
		vec3.set(SphereVel[i], SphereVel[i][0], update_y + g, SphereVel[i][2]);
		
	}
	//console.log(SphereVel[9]);
}
/*  UpdatePosition
    Updates sphere position
    @parem none
    @return none
*/
function UpdatePosition()
{
	var i;
	for(i = 0; i < SphereNum; i++)
	{
		vec3.add(SpherePos[i],SphereVel[i],SpherePos[i]);
		
	}
}