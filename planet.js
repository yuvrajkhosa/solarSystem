class Planet{
    constructor(mass ,distFromSun, initAccelX, initAccelY, diam, timeForAccel){
        this.mass = mass;
        this.diam = diam;
        this.timeForAccel = timeForAccel;
        this.initAccel = createVector(initAccelX, initAccelY);
        this.pos = createVector(width / 2, height / 2 - distFromSun);
        this.accel = createVector(0,0);
        this.vel = createVector(0,0);
        this.colour = [random(255), random(255), random(255)];
    }

}