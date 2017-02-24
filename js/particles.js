//Set up canvas vars and colors
var canvas = document.querySelector("canvas");
canvas.width = document.body.offsetWidth;
canvas.height = document.body.scrollHeight;
var ctx = canvas.getContext("2d");
var background = "#FFFFFF";
var particleColor = "#3533FF";

//Define looping function that will repeat until website is closed
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    requestAnimationFrame(loop);
}

//Define particle object that will be moving on canvas
function Particle (initX, initY, initXVelocity, startVelY) {

    //Random start position unless specified
    this.x = initX || Math.random() * canvas.width;
    this.y = initY || Math.random() * canvas.height;

    //Velocity as a pair obj randome unless specified
    this.vel = {
        x: initXVelocity || Math.random()*2  - 1,
        y: startVelY || Math.random()*2 - 1
    };

    //Update function that will move particle as well as boundary check
    this.update = function(canvas) {
        if (this.x > canvas.width - 5 || this.x < 5) {
            this.vel.x = -this.vel.x;
            //this.x = 5;
        }
        if (this.y > canvas.height -5  || this.y < 5) {
            this.vel.y = -this.vel.y ;
            //this.y = 5;
        }
        this.x += this.vel.x;
        this.y += this.vel.y;
    };

    //Draw function for canvas to create circle
    this.draw = function(ctx, can) {
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.fillStyle = particleColor;
        ctx.arc((0.5 + this.x) | 0, (0.5 + this.y) | 0, 3, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    //Attraction function for getting particles to attract each other
    this.attract = function(particle2) {

        //If in  a certain threshold start moving towards each other
        if(this.x - particle2.x < 0){
            this.vel.x += .1;
            particle2.vel.x += -.1;
            if(this.y - particle2.y < 0){
                this.vel.y += .1;
                particle2.vel.y += -.1;
            }
            else{
                this.vel.y += -.1;
                particle2.vel.y += .1;
            }
        }
        else{
            this.vel.x += -.1;
            particle2.vel.x += .1;
            if(this.y - particle2.y < 0){
                this.vel.y += .1;
                particle2.vel.y += -.1;
            }
            else{
                this.vel.y += -.1;
                particle2.vel.y += .1;
            }
        }  
    }

    //Speedcheck so we don't go too fast, resets speed
    this.speedCheck = function() { 

        if(Math.abs(this.vel.x) > 5){
            this.vel.x = 0;
        }
        if(Math.abs(this.vel.y) > 5){
            this.vel.y = 0;
        }

    }
}

//Set up array of particles
var particles = [];
//Create each particle and add to array
for (var i = 0; i < canvas.width * canvas.height / (65*65); i++) {
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
}

//Global update to call update on each particle
var lastTime = Date.now();
function update() {
    var diff = Date.now() - lastTime;
    for (var frame = 0; frame * 60 < diff; frame++) {
        for (var i = 0; i < particles.length; i++) {
            particles[i].update(canvas);
            particles[i].speedCheck();
        }
    }
    lastTime = Date.now();
}



//Global draw function for canvas drawing
function draw() {

    //Set background colors
    ctx.globalAlpha=1;
    ctx.fillStyle = background;
    ctx.fillRect(0,0,canvas.width, canvas.height);

    //For each particle
    for (var i = 0; i < particles.length; i++) {
        //Get particle one
        var particle = particles[i];

        //For each sub particle
        for(var j = 0; j < particles.length; j++) {

            
            if(i != j){
                //Get particle 2
                var particle2 = particles[j];
                var xDist = Math.abs(particle.x - particle2.x);
                var yDist = Math.abs(particle.y - particle2.y);        
    
                //Relation for line drawing
                if(xDist < 100 && yDist < 100){
                    particle.draw(ctx, canvas);
                    particle2.draw(ctx, canvas);
                    ctx.beginPath();
                    ctx.globalAlpha = 1 - (Math.max(xDist, yDist)/100);
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    if(i % 3 == 0){
                        ctx.strokeStyle="red";
                    }
                    else if(i % 3 == 1){
                        ctx.strokeStyle="yellow";
                    }
                    else{
                        ctx.strokeStyle="black";
                    }
                    ctx.stroke();
                }

                //Handle attraction functionality
                if(xDist < 15 && yDist < 15){
                    particle.attract(particle2);
                    particle2.attract(particle);
                }
            }
            else{
                particle.draw(ctx, canvas);
            }
        }
        ctx.stroke();
    }
}

//Resize canvas on page resize
function resize() {
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.scrollHeight;
}

//Window listeners for resizing
window.addEventListener('orientationchange', resize, true);
window.addEventListener('resize', resize, true);

//Loop nonstop
loop();
