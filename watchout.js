d3.select('body').append('svg')
  .attr('height', '500px')
  .attr('width', '500px')
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


d3.select('svg').selectAll('circle').data(enemyData)
  .enter()
  .append('circle')
  .attr('class', 'enemy')
  .attr('cx', function(d) {return d.x})
  .attr('cy', function(d) {return d.y})
  .attr('r', function(d) {return d.r});

function moveEnemies() {
  d3.selectAll('.enemy')
    .transition().duration(900)
    .attr('cx', function(d) {d.x = 30 + 440*Math.random(); return d.x})
    .attr('cy', function(d) {d.y = 30 + 440*Math.random(); return d.y})

}

var playerData = {
  x : 30 + 440*Math.random(),
  y : 30 + 440*Math.random(),
  r : 15
};

d3.select('svg').selectAll('player').data([playerData])
  .enter()
  .append('circle')
  .attr('class', 'player')
  .attr('cx', function(d) {return d.x})
  .attr('cy', function(d) {return d.y})
  .attr('r', function(d) {return d.r})
  .attr('fill', 'green')
setInterval(moveEnemies, 1000);

