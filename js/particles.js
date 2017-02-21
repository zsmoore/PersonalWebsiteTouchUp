var canvas = document.querySelector("canvas");
canvas.width = document.body.offsetWidth;
canvas.height = document.body.scrollHeight;
var ctx = canvas.getContext("2d");
var background = "#FFFFFF";
var particleColor = "#3533FF";

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  draw();
  requestAnimationFrame(loop);
}

function Particle (initX, initY, initXVelocity, startVelY) {
  this.x = initX || Math.random() * canvas.width;
  this.y = initY || Math.random() * canvas.height;
  this.vel = {
    x: initXVelocity || Math.random() * 2 - 1,
    y: startVelY || Math.random() * 2 - 1
  };
  this.update = function(canvas) {
    if (this.x > canvas.width - 5 || this.x < 5) {
      this.vel.x = -this.vel.x;
    }
    if (this.y > canvas.height -5  || this.y < 5) {
      this.vel.y = -this.vel.y;
    }
    this.x += this.vel.x;
    this.y += this.vel.y;
  };
  this.draw = function(ctx, can) {
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.fillStyle = particleColor;
    ctx.arc((0.5 + this.x) | 0, (0.5 + this.y) | 0, 3, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}

var particles = [];
for (var i = 0; i < canvas.width * canvas.height / (70*70); i++) {
  particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
}

var lastTime = Date.now();
function update() {
  var diff = Date.now() - lastTime;
  for (var frame = 0; frame * 60 < diff; frame++) {
    for (var i = 0; i < particles.length; i++) {
      particles[i].update(canvas);
    }
  }
  lastTime = Date.now();
}

function draw() {
  ctx.globalAlpha=1;
  ctx.fillStyle = background;
  ctx.fillRect(0,0,canvas.width, canvas.height);
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    /*Relation Functionality*/
    for(var j = 0; j < particles.length; j++) {
        var particle2 = particles[j];
        var xDist = Math.abs(particle.x - particle2.x);
        var yDist = Math.abs(particle.y - particle2.y);
        if(i != j && xDist < 100 && yDist < 100){
            particle.draw(ctx, canvas);
            particle2.draw(ctx, canvas);
            ctx.beginPath();
            ctx.globalAlpha = 1 - (Math.max(xDist, yDist)/100);
            ctx.moveTo(particle.x, particle.y);
//            ctx.lineTo(particle.x/2 + Math.max(xDist, yDist)/2, particle.y + Math.max(xDist, yDist)/2);
//            ctx.lineTo(particle2.x/2, particle2.y/2);
//            ctx.lineTo(particle2.x/2 + Math.max(xDist, yDist)/2, particle2.y/2 + Math.max(xDist, yDist)/2);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.strokeStyle="red";
            ctx.stroke();
        }
    }
    /* Done edits */
    particle.draw(ctx, canvas);
    ctx.beginPath();
    ctx.stroke();
  }
}

function resize() {
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.scrollHeight;
}
window.addEventListener('orientationchange', resize, true);
window.addEventListener('resize', resize, true);

loop();
