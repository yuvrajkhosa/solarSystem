//let diam, pos, vel, accel, prevAccel, mouseVec, mouseForce, ballAccel, sunPos, counter, gravityForce, planetGravityForce;
let planets = [];
const SUN_MASS = 50;
const SUN_DIAM = 30;
let removed = false;
const DISTANCE_CONSTRAINTS = [5, 25];
const FPS = 60;
function setup() {
  frameRate(FPS);
  createCanvas(windowWidth, windowHeight);
  for(let i = 0; i < 10; i++){
    planets.push(new Planet(random(2), 35 + i * 60, random(-0.05, 0.05), random(-0.01, 0.01), random(1, 20), random(1,4)))//Making some random planets
  }
  for(let i = 0; i < 10; i++){
    planets.push(new Planet(random(2), -35 - i * 60, random(-0.05, 0.05), random(-0.01, 0.01), random(1, 20), random(1,4)))//Making random planets below star
  }
  


  sunPos = createVector(width / 2, height / 2);
  
}

function draw() {
  background(220);
  fill(0);
  text(planets.length, 10, 20);
  
  fill(255,255, 0);
  ellipse(sunPos.x, sunPos.y, SUN_DIAM);//Draw the sun

  for(let i = 0; i < planets.length; i++){//Go through each planet
    if(dist(planets[i].pos.x, planets[i].pos.y, sunPos.x, sunPos.y) < SUN_DIAM / 2 + planets[i].diam / 2){//If the planets collide with the sun, remove it. Radius + Radius
      planets.splice(planets.indexOf(planets[i]), 1);
      removed = true;
      --i;
    }
    if(!removed){
      if(frameCount > planets[i].timeForAccel * FPS){//If time has passed the planets' time argument
        //accel.add(mouseForce.setMag(0.1));
        gravityForce = sunPos.copy().sub(planets[i].pos);//Start applying gravity. Get vector pointing from current planet to sun
        let d = gravityForce.mag();//Calculating gravity so farther away, weaker. https://www.youtube.com/watch?v=fML1KpvvQTc
        d = constrain(d, DISTANCE_CONSTRAINTS[0], DISTANCE_CONSTRAINTS[1]);//Constrain because pixels can have very large and small magnifications to them
        gravityForce.normalize();
        let strength = (planets[i].mass * SUN_MASS) / (d * d);
        gravityForce.mult(strength);
        planets[i].accel.add(gravityForce);



        /*Add that vector to the planet's acceleration and set the magnitute to something smaller. So it's not a giant vector going from planet to sun*/
        
        for(j in planets){//Cycle through the other planets to create a force of gravity between the planets.
          if(i == j){//If same planet, continue
            continue;
          }
          if(dist(planets[i].pos.x, planets[i].pos.y, planets[j].pos.x, planets[j].pos.y) < planets[i].diam / 2 + planets[j].diam / 2){
            if(planets[j].diam < planets[i].diam){
              planets[i].diam += planets[j].diam * 0.2;
              planets[i].vel.add(planets[j].vel);//Add the velocity of the destroyed planet to the impact planet
              planets.splice(planets.indexOf(planets[j]), 1);//Remove smaller planet
              removed = true;
              break;
            }
          }
          planetGravityForce = planets[i].pos.copy().sub(planets[j].pos);//Get vector from curent planet to other planet
          let dPlanets = planetGravityForce.mag();
          dPlanets = constrain(d, DISTANCE_CONSTRAINTS[0], DISTANCE_CONSTRAINTS[1]);
          planetGravityForce.normalize();
          let strengthPlanets = (planets[i].mass * planets[j].mass) / (dPlanets * dPlanets);
          planetGravityForce.mult(strengthPlanets);
          planets[j].accel.add(planetGravityForce);//Set the magnitude of that force to the other planet's gravityStrength argument, then add it to net force of current planet
        }
      }
      else{
        planets[i].accel.add(planets[i].initAccel);//If time hasn't passed, we're in creation stage. Let planet's have intital acceeleration to the right at their initAccel arguements
      }
    }
    if(!removed){
      planets[i].vel.add(planets[i].accel);//Add the net acceleration to the velocity of the current planet
      planets[i].pos.add(planets[i].vel);//Add that velocity to the position
      fill(planets[i].colour);
      ellipse(planets[i].pos.x, planets[i].pos.y, planets[i].diam);//Draw planet at current position
      planets[i].accel.mult(0);//Set net acceleration force to 0
    }
    else{
      i++;
    }
    removed = false;
    
  }
  // This made bouncing ball
  // if(pos.x > width - diam / 2){
  //   pos.x = width - diam / 2;
  //   vel.mult(0);
  //   ballAccel.x *= -1;
    
  // }
  // else if(pos.x < diam / 2){
  //   pos.x = diam /2;
  //   vel.mult(0);
  //   ballAccel.x *= -1;
  // }
  // if(pos.y < diam / 2){
  //   pos.y = diam / 2;
  //   vel.mult(0);
  //   ballAccel.y *= -1;
  // }
  // else if(pos.y > height - diam / 2){
  //   pos.y = height - diam / 2;
  //   vel.mult(0);
  //   ballAccel.y *= -1;
  // }
 
  
  // //prevAccel = accel.copy();
   

  // accel.mult(0);
  
}