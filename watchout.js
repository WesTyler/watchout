var canvasData = {
  height: 500,
  width: 500,
  currentScore: 0,
  highScore: 0
}

d3.select('body').append('svg')
  .attr('height', canvasData.height + 'px')
  .attr('width', canvasData.width + 'px')
  .append('rect')
  .attr('height', '100%')
  .attr('width', '100%')
  .attr('fill', 'blue');

var enemyData = [];
for(var i=0; i<10; i++) {
  enemyData.push({
    x : 30 + 440*Math.random(),
    y : 30 + 440*Math.random(),
    r : 20
  });
}

function shurikenPoints(n, r, R) {
  var outputArray = [];
  var cx = 20;
  var cy = 20;

  for (var i=0; i<n; i++) {
    outputArray.push(cx + r*Math.cos(Math.PI/2 + Math.PI*2/n*i));
    outputArray.push(cy + r*Math.sin(Math.PI/2 + Math.PI*2/n*i));
    outputArray.push(cx + R*Math.cos(Math.PI/2 + Math.PI*2/n*i));
    outputArray.push(cy + R*Math.sin(Math.PI/2 + Math.PI*2/n*i));
  }

  return outputArray.join(" ");
}

d3.select('svg').selectAll('.shuriken').data(enemyData)
  .enter()
  .append('g')
  .attr('class', 'enemy')
  .append('polygon')
  .attr('points', shurikenPoints(5, 6, 18))

d3.selectAll('g').append('circle')
  .attr('cx', 20)
  .attr('cy', 20)
  .attr('r', 3)
  .attr('fill', 'blue')

d3.selectAll('g')
  .attr('transform', function(d){
    return 'translate('+d.x+', '+d.y+')'
  })

function moveEnemies() {
  d3.selectAll('.enemy')
    .transition().duration(900)
    .attr('transform', function(d){
      d.x = 30 + 440*Math.random();
      d.y = 30 + 440*Math.random();
      return 'translate('+d.x+', '+d.y+')'
    });
}
setInterval(moveEnemies, 1000);


var playerData = {
  x : 30 + 440*Math.random(),
  y : 30 + 440*Math.random(),
  r : 15
};

var player = d3.select('svg').selectAll('player').data([playerData])
  .enter()
  .append('circle')
  .attr('class', 'player')
  .attr('cx', function(d) {return d.x})
  .attr('cy', function(d) {return d.y})
  .attr('r', function(d) {return d.r})
  .attr('fill', 'green');

var drag = d3.behavior.drag()
  .origin(function(d) {return d;})
  .on("drag", dragmove);

function dragmove(d) {
  d3.select(this)
    .attr("cx", d.x = Math.max(d.r, Math.min(canvasData.width - d.r, d3.event.x)))
    .attr("cy", d.y = Math.max(d.r, Math.min(canvasData.height - d.r, d3.event.y)));

}

player.call(drag);

function findCollisions() {
  //check if there is an enemy within a collision radius of the current position (d.x, d.y)
  var foundCollision = false;
  enemyData.forEach(function(enemy) {
    var dx = enemy.x - playerData.x;
    var dy = enemy.y - playerData.y;
    var dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < enemy.r + playerData.r) {
      canvasData.currentScore = 0;
      foundCollision = true;
    }
  });

  if(!foundCollision) {
    canvasData.currentScore += 1;
    canvasData.highScore = Math.max(canvasData.currentScore, canvasData.highScore);
  }

  d3.select(".scoreboard").selectAll("div span")
    .data([canvasData.highScore, canvasData.currentScore])
    .text(function(d) {return d})
}
//setInterval(findCollisions, 100);

