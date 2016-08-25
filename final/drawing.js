// function to draw a major-minor grid of co-ordinates
// requires a canvas context on which to draw
// requires a value for the major and minor tick locations
// can take optional boolean which will print labels if true
function draw_grid(ctx, colour, minor, major) {
  colour = colour || "#00FF00";
  ctx.save();
  ctx.strokeStyle = colour;
  ctx.fillStyle = colour;
  minor = minor || 10;
  major = minor * 5;
  for(var x = 0; x < ctx.canvas.width; x += minor) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
    ctx.lineWidth = (x % major == 0) ? 0.5 : 0.25;
    ctx.stroke();
    if(x % major == 0 ) {ctx.fillText(x, x, 10);}
  }
  for(var y = 0; y < ctx.canvas.height; y += minor) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width, y);
    ctx.lineWidth = (y % major == 0) ? 0.5 : 0.25;
    ctx.stroke();
    if(y % major == 0 ) {ctx.fillText(y, 0, y + 10);}
  }
  ctx.restore();
}

// function to draw a pacman at a given position
// specify (x, y) co-ordinates, radius (symetrical radians from horizontal),
// also specify maximum mouth angle and the level of mouth openness (0 - 1)
function draw_pacman(ctx, radius, angle, max_angle, guide) {
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#FFFF00";
  ctx.lineWidth = 0.5;
  max_angle = max_angle || 0.2 * Math.PI;
  angle %= max_angle;
  ctx.beginPath();
  ctx.arc(0, 0, radius, angle, 2 * Math.PI - angle);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  if(guide) {
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#FFFFFF";
    // ctx.beginPath();
    // ctx.arc(0, 0, radius, 2 * Math.PI - angle, angle);
    ctx.moveTo(0, 0);
    ctx.lineTo(radius, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.2, 2 * Math.PI - angle, angle);
    ctx.stroke();
    ctx.strokeStyle = "#666666";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, 2 * Math.PI - max_angle, max_angle);
    ctx.lineTo(0, 0);
    ctx.stroke();
  }
  ctx.restore();
}

function draw_ghost(ctx, radius, feet, guide) {
  var head_radius = radius * 0.8;
  var foot_radius = head_radius / feet;
  ctx.save();
  ctx.strokeStyle = "#FFFFFF";
  ctx.beginPath();
  for(foot = 0; foot < feet; foot++) {
    ctx.arc((2 * foot_radius * (feet - foot)) - head_radius - foot_radius, radius - foot_radius, foot_radius, 0, Math.PI);
  }
  ctx.lineTo(-head_radius, radius - foot_radius);
  ctx.arc(0, head_radius - radius, head_radius, Math.PI, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = "#000000";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-head_radius / 2, head_radius - radius, head_radius / 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(head_radius / 3, head_radius - radius, head_radius / 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  if(guide) {
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-radius * 1.3, radius - foot_radius);
    ctx.lineTo(radius * 1.3, radius - foot_radius);
    ctx.moveTo(-radius * 1.3, head_radius - radius);
    ctx.lineTo(radius * 1.3, head_radius - radius);
    ctx.stroke();
  }
  ctx.restore();
}

function draw_ship(ctx, angle, radius, dx, curve_angle, thruster, guide) {
  var angle1 = Math.PI - angle;
  var angle2 = Math.PI + angle;
  ctx.save();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1.5;
  ctx.fillStyle = "#000000";

  if(thruster) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(
      Math.cos(angle1) * radius/2,
      Math.sin(angle1) * radius/2
    )
    ctx.quadraticCurveTo((-1 + dx) * radius, 0,
      Math.cos(angle2) * radius/2,
      Math.sin(angle2) * radius/2
    );
    ctx.strokeStyle = "#FFFF00";
    ctx.lineWidth = 5;
    ctx.fillStyle = "#FF0000";
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.quadraticCurveTo(
    Math.cos(curve_angle) * radius,
    Math.sin(curve_angle) * radius,
    Math.cos(angle1) * radius,
    Math.sin(angle1) * radius
  );
  ctx.quadraticCurveTo(dx * radius, 0,
    Math.cos(angle2) * radius,
    Math.sin(angle2) * radius
  );
  ctx.quadraticCurveTo(
    Math.cos(-curve_angle) * radius,
    Math.sin(-curve_angle) * radius,
    radius,
    0
  );
  ctx.fill();
  ctx.stroke();
  if(guide) {
    ctx.lineWidth = 0.5;
    ctx.fillStyle = "#FFFFFF"
    ctx.beginPath();
    ctx.arc(dx * radius, 0, radius/50, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      Math.cos(-curve_angle) * radius,
      Math.sin(-curve_angle) * radius,
      radius/50, 0, 2 * Math.PI
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      Math.cos(curve_angle) * radius,
      Math.sin(curve_angle) * radius,
      radius/50, 0, 2 * Math.PI
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.moveTo(Math.cos(angle1) * radius, Math.sin(angle1) * radius);
    ctx.lineTo(0, 0);
    ctx.lineTo(Math.cos(angle2) * radius, Math.sin(angle2) * radius);
    ctx.moveTo(0, 0);
    ctx.lineTo(- radius, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.2, angle1, angle2);
    ctx.stroke();
  }
  ctx.restore();
}

function draw_asteroid(ctx, radius, shape, noise, guide) {
  ctx.save();
  ctx.beginPath();
  for(var i = 0; i < shape.length; i++) {
    ctx.rotate(2 * Math.PI / shape.length);
    ctx.lineTo(radius + radius * noise * shape[i], 0);
  }
  ctx.closePath();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1.5;
  ctx.fillStyle = "#000000";
  if(guide) {
    ctx.fill();
  }
  ctx.stroke();
  if(guide) {
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 0.2;
    ctx.arc(0, 0, radius + radius * noise, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius - radius * noise, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();
}

function draw_projectile(ctx, radius, lifetime, guide) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  for(var i = 0; i < 5; i++) {
    ctx.rotate(2 * Math.PI / 5);
    ctx.quadraticCurveTo(radius * 0.4, radius * 0.15, radius, 0);
  }
  var c = 1 - Math.pow(1 - lifetime, 4);
  ctx.fillStyle = "rgb(" + (5 + 95 * c) + "%, " + (5 + 95 * c) + "%, " + (5 + 95 * c) + "%)";
  ctx.fill();
  if(guide) {
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 0.25;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.stroke();
  }
  ctx.restore();
}

function draw_line(ctx, obj1, obj2) {
  ctx.save();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(obj1.x, obj1.y);
  ctx.lineTo(obj2.x, obj2.y);
  ctx.stroke();
  ctx.restore();
}

function centre_text(ctx, text, y, pt) {
  ctx.save();
  ctx.font = (pt || 18) + "pt Arial";
  ctx.fillStyle = "#FFFFFF";
  var x = (ctx.canvas.width - ctx.measureText(text).width) / 2;
  ctx.fillText(text, x, y);
  ctx.restore();
}
