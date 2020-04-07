//let diam, pos, vel, accel, prevAccel, mouseVec, mouseForce, ballAccel, sunPos, counter, gravityForce, planetGravityForce;
let planets = [];
let stars = [];
let removed = false;
const PLANET_DISTANCE_CONSTRAINTS = [2, 25];
const STAR_DISTANCE_CONSTRAINTS = [7, 20];
const FPS = 60;
let counter = 0;
let isStarted = false;
let initialPlanets = 0;
let backgroundOpacity = 20; 
let root = document.documentElement;

function setup() {
    frameRate(FPS);
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 10; i++) {
        planets.push(new Planet(random(2), 0, random(-0.15, 0.15), random(-0.015, 0.015), random(3, 15), random(1, 4), random(width), random(height)));
    }
    stars.push(new Star(width / 2, height / 2, 30, 60));
    updateMassSlider();
    updatePlanetsSlider();
    toggleDark();
}

function draw() {
    background(backgroundOpacity);
    fill(0);
    for (let i = 0; i < stars.length; i++) {
        fill(255, 255, 0);
        ellipse(stars[i].pos.x, stars[i].pos.y, stars[i].diam);
    }
    for (let i = 0; i < planets.length; i++) { //Go through each planet
        if (counter > planets[i].timeForAccel * FPS && isStarted) { //If time has passed the planets' time argument
            //accel.add(mouseForce.setMag(0.1));
            for (let j = 0; j < stars.length; j++) {
                gravityForce = stars[j].pos.copy().sub(planets[i].pos); //Start applying gravity. Get vector pointing from current planet to sun
                let d = gravityForce.mag(); //Calculating gravity so farther away, weaker. https://www.youtube.com/watch?v=fML1KpvvQTc
                d = constrain(d, STAR_DISTANCE_CONSTRAINTS[0], STAR_DISTANCE_CONSTRAINTS[1]); //Constrain because pixels can have very large and small magnifications to them
                gravityForce.normalize();
                let strength = (planets[i].mass * stars[j].mass) / (d * d);
                gravityForce.mult(strength);
                planets[i].accel.add(gravityForce);
                if (dist(planets[i].pos.x, planets[i].pos.y, stars[j].pos.x, stars[j].pos.y) < stars[j].diam / 2 + planets[i].diam / 2) { //If the planets collide with the sun, remove it. Radius + Radius
                    planets.splice(planets.indexOf(planets[i]), 1);
                    removed = true;
                    --i;
                    document.getElementById("planetsAmount").innerHTML = `Planets Count ${planets.length}`;
                }
            }
            /*Add that vector to the planet's acceleration and set the magnitute to something smaller. So it's not a giant vector going from planet to sun*/
            if (!removed && isStarted) {
                for (j in planets) { //Cycle through the other planets to create a force of gravity between the planets.
                    if (i == j) { //If same planet, continue
                        continue;
                    }
                    if (dist(planets[i].pos.x, planets[i].pos.y, planets[j].pos.x, planets[j].pos.y) < planets[i].diam / 2 + planets[j].diam / 2) {
                        if (planets[j].diam < planets[i].diam) {
                            planets[i].diam += planets[j].diam * 0.2;
                            planets[i].vel.add(planets[j].vel.mult(0.7)); //Add the velocity of the destroyed planet to the impact planet
                            planets.splice(planets.indexOf(planets[j]), 1); //Remove smaller planet
                            removed = true;
                            document.getElementById("planetsAmount").innerHTML = `Planets Count ${planets.length}`;
                            console.log("Removed");
                            --i;
                            
                            break;
                        }
                    }
                    planetGravityForce = planets[i].pos.copy().sub(planets[j].pos); //Get vector from curent planet to other planet
                    let dPlanets = planetGravityForce.mag();
                    dPlanets = constrain(dPlanets, PLANET_DISTANCE_CONSTRAINTS[0], PLANET_DISTANCE_CONSTRAINTS[1]);
                    planetGravityForce.normalize();
                    let strengthPlanets = (planets[i].mass * planets[j].mass) / (dPlanets * dPlanets);
                    planetGravityForce.mult(strengthPlanets);
                    planets[j].accel.add(planetGravityForce); //Set the magnitude of that force to the other planet's gravityStrength argument, then add it to net force of current planet
                }
            }
        } else {
            if (isStarted) {
                planets[i].accel.add(planets[i].initAccel);
            }
        }
        if (!removed) {
            planets[i].vel.add(planets[i].accel); //Add the net acceleration to the velocity of the current planet
            planets[i].pos.add(planets[i].vel); //Add that velocity to the position
            fill(planets[i].colour);
            ellipse(planets[i].pos.x, planets[i].pos.y, planets[i].diam); //Draw planet at current position
            planets[i].accel.mult(0); //Set net acceleration force to 0
        }
        removed = false;
    }
    counter++;
}

function start() { //Start simulation
    if (!isStarted) {
        isStarted = true;
        counter = 0;
        initialPlanets = planets.length;
    }
}

function restart() { //Remove all planets add the default planets
    isStarted = false;
    planets = [];
    updatePlanetsSlider();
}
document.getElementById("massSlider").addEventListener('input', updateMassSlider, false); //On update, run updateMassSlider();
document.getElementById("planetsSlider").addEventListener('input', updatePlanetsSlider, false); //On update, run updatePlanetsSlider();

function updatePlanetsSlider() {
    if (isStarted) { //If simulation is started, do not allow to move slider
        document.getElementById("planetsSlider").value = initialPlanets;
        return;
    }
    document.getElementById("planetsAmount").innerHTML = `Planets Count: ${document.getElementById("planetsSlider").value}`; //Update Text
    let planetsToAdd = document.getElementById("planetsSlider").value - planets.length; //Get difference between current planets and added planets 
    if (planetsToAdd > 0) { //Have to loop because the update doesn't trigger the event listener every single increment or decrement
        for (let i = 0; i < planetsToAdd; i++) { //If planets to add difference is positive, add these many new planets
            planets.push(new Planet(random(2), 0, random(-0.15, 0.15), random(-0.015, 0.015), random(3, 15), random(1, 4), random(width), random(height)));
        }
    } else if (planetsToAdd < 0) { //If planets removed, go to the position where "added planets" are, and remove to end
        planets.splice(planets.length - 1 - Math.abs(planetsToAdd), Math.abs(planetsToAdd)); //
    }
}

function updateMassSlider() {
    document.getElementById("starMass").innerHTML = `Star Mass: ${document.getElementById("massSlider").value}`;
    for (let i = 0; i < stars.length; i++) {
        stars[i].mass = document.getElementById("massSlider").value;
    }
}

function toggleDark(){
    if(backgroundOpacity == 220){//Check if background is already bright. This tells us which mode we're in
        backgroundOpacity = 10;//Dark Mode
        root.style.setProperty('--invertPercent', '100%');
        root.style.setProperty('--textColor', '#FFFFFF');
        root.style.setProperty('--sliderColor', '#70ffbf');
        root.style.setProperty('--sliderThumbColor', '#f870ff');
    }
    else{
        backgroundOpacity = 220;
        root.style.setProperty('--invertPercent', '0%');
        root.style.setProperty('--textColor', '#000000');
        root.style.setProperty('--sliderColor', '#98b8ec');
        root.style.setProperty('--sliderThumbColor', '#ce9cff');
    }
}
