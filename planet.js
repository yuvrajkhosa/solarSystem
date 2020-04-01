class Planet{
    constructor(mass ,distFromSun, initAccelX, initAccelY, diam, timeForAccel, posX, posY){
        this.mass = mass;
        this.diam = diam;
        this.timeForAccel = timeForAccel;
        this.initAccel = createVector(initAccelX, initAccelY);
        this.pos = !posX ? createVector(width / 2, height / 2 - distFromSun) : createVector(posX, posY);//If no posX and posY given, do radius from sun mode
        this.accel = createVector(0,0);
        this.vel = createVector(0,0);
        this.colour = [random(100,255), random(100, 255), random(100, 255)];
    }
}