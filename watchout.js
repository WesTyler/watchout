var canvasData = {
  height: 650,
  width: 650,
  currentScore: 0,
  highScore: 0,
  collectCount: 1,
  n: 15,
  playerR: 15
}

var randEnemyX = function() {return (canvasData.width-40)*Math.random()}
var randEnemyY = function() {return (canvasData.height-40)*Math.random()}

d3.select('.gameboard').append('svg')
  .attr('height', canvasData.height + 'px')
  .attr('width', canvasData.width + 'px')
  .append('rect')
  .attr('height', '100%')
  .attr('width', '100%')
  .attr('fill', 'grey');

var enemyData = [];
for(var i=0; i<canvasData.n; i++) {
  enemyData.push({
    x : randEnemyX(),
    y : randEnemyY(),
    r : 20,
    ang : 360*Math.random()
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
  .attr('r', 20)
  .append('polygon')
  .attr('points', shurikenPoints(6, 6, 18))

d3.selectAll('g').append('circle')
  .attr('cx', 20)
  .attr('cy', 20)
  .attr('r', 3)
  .attr('fill', 'grey')

d3.selectAll('g').append('circle')
  .attr('cx', 20)
  .attr('cy', 20)
  .attr('r', 18)
  .attr('stroke', 'black')
  .attr('fill-opacity', 0)

d3.selectAll('g')
  .attr('transform', function(d){
    return 'translate('+d.x+', '+d.y+')'
  })

function moveEnemies() {
  d3.selectAll('.enemy')
    .transition().duration(1000)
    .attr('transform', function(d){
      d.x = randEnemyX();
      d.y = randEnemyY();
      return 'translate('+d.x+', '+d.y+')'
    });
}
setInterval(moveEnemies, 1000);


var playerData = {
  x : canvasData.playerR + (canvasData.width - 2*canvasData.playerR)*Math.random(),
  y : canvasData.playerR + (canvasData.height - 2*canvasData.playerR)*Math.random(),
  r : canvasData.playerR
};

var player = d3.select('svg').selectAll('player').data([playerData])
  .enter()
  .append('circle')
  .attr('class', 'player')
  .attr('cx', function(d) {return d.x})
  .attr('cy', function(d) {return d.y})
  .attr('r', function(d) {return d.r})
  .attr('fill', 'white');

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
  d3.selectAll(".enemy").each(function() {
    var me = d3.select(this);
    var t = me.attr('transform');
    var x = +t.substr(t.indexOf('(')+1, t.indexOf(',')-t.indexOf('(')-1) + 20;
    var y = +t.substring(t.indexOf(",")+1, t.length - 1) + 20;
    var dx = x - playerData.x;
    var dy = y - playerData.y;
    var dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < +me.attr("r") + playerData.r) {
      canvasData.currentScore = 0;
      canvasData.collectCount = 1;
      foundCollision = true;
      me.attr("fill","red");
      setTimeout(function() {
        me.attr("fill", "black");
      }, 1000);
    }
  });

  if(!foundCollision) {
    canvasData.currentScore += 1*canvasData.collectCount;
    canvasData.highScore = Math.max(canvasData.currentScore, canvasData.highScore);
  }

  d3.select(".scoreboard").selectAll("div span")
    .data([canvasData.highScore, canvasData.currentScore, canvasData.collectCount])
    .text(function(d) {return d})
}
setInterval(findCollisions, 16);

var collectorData = [];
for (var j=0; j<5; j++) {
  var radius = 1 + 5*Math.random();
  var radiusPlace = radius;
  if (Math.random() > 0.5) {radiusPlace = 0-radius;}
  collectorData.push({
    x: canvasData.width/2 + radiusPlace*50*Math.random(),
    y: canvasData.height/2 + radiusPlace*50*Math.random(),
    r: radius
  });
}

d3.select('svg').selectAll('collectors').data(collectorData)
  .enter()
  .append('circle')
  .attr('class', 'collector')
  .attr('cx', function(d){return d.x})
  .attr('cy', function(d){return d.y})
  .attr('r', function(d){return d.r})
  .attr('fill', 'yellow')

function collectTheThings () {
  d3.selectAll('.collector').each(function(){
    var thisOne = d3.select(this)
    var x = +thisOne.attr('cx');
    var y = +thisOne.attr('cy');
    var points = Math.floor(+thisOne.attr('r'));
    var dx = x - playerData.x;
    var dy = y - playerData.y;
    var dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < points + playerData.r) {
      canvasData.collectCount += (6 -points);
      thisOne.remove()
    }

  })
}
setInterval(collectTheThings, 16);
