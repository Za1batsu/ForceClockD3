//Variable to hold settings and information
var clockSettings = {
  height: window.innerHeight / 3 * 2,
  width: window.innerWidth,
  secondNodes: [],
  minuteNodes: [],
  hourNodes: [],
  nodes: [],
  tinyBlast: 2,
  tickBlast: 10,
  clickBlast: 60,
  secondR: 5,
  minuteR: 8,
  hourR: 12,
};


var fociPos = [{
  x: (clockSettings.width / 3) * 2.5,
  y: (clockSettings.height / 3) * 3
}, {
  x: (clockSettings.width / 2),
  y: (clockSettings.height / 3) * 3
}, {
  x: (clockSettings.width / 3) * 0.5,
  y: (clockSettings.height / 3) * 3
}];

var svg = d3.select('body')
  .append('svg')
  .attr('height', '100%')
  .attr('width', '100%')
  .classed({ 'svg': true });

var setFocal = function(k, o, i) {
  o.y += (fociPos[o.id].y - o.y) * k;
  o.x += (fociPos[o.id].x - o.x) * k;
};

var secondTick = function(e) {
  var k = e.alpha * 0.1;
  var setFocalSeconds = setFocal.bind(null, k);
 
  clockSettings.secondNodes.forEach(setFocalSeconds);

  secondNode
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
};

var minuteTick = function(e) {
  var k = e.alpha * 0.1;
  var setFocalMinutes = setFocal.bind(null, k);

  clockSettings.minuteNodes.forEach(setFocalMinutes);

  minuteNode
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
};

var hourTick = function(e) {
  var k = e.alpha * 0.1;
  var setFocalHours = setFocal.bind(null, k);

  clockSettings.hourNodes.forEach(setFocalHours);

  hourNode
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
}

var secondForce = d3.layout.force()
  .nodes(clockSettings.secondNodes)
  .links([])
  .gravity(0)
  .charge(-10)
  .size([clockSettings.width, clockSettings.height])
  .on('tick', secondTick); //Invoke 'tick' on every...tick.

var minuteForce = d3.layout.force()
  .nodes(clockSettings.minuteNodes)
  .links([])
  .gravity(0)
  .charge(-15)
  .size([clockSettings.width, clockSettings.height])
  .on('tick', minuteTick); //Invoke 'tick' on every...tick.

var hourForce = d3.layout.force()
  .nodes(clockSettings.hourNodes)
  .links([])
  .gravity(0)
  .charge(-50)
  .size([clockSettings.width, clockSettings.height])
  .on('tick', hourTick); //Invoke 'tick' on every...tick.

var secondNode = svg.selectAll('.secondNodes');
var minuteNode = svg.selectAll('.minuteNodes');
var hourNode = svg.selectAll('.hourNodes');

var spawnSecond = function() {
  clockSettings.secondNodes.push({ id: [0] });
  secondForce.start();

  var alpha = Math.random() * 0.6 + 0.2;

  secondNode = secondNode.data(clockSettings.secondNodes);
  secondNode.enter().append('circle')
    .attr('class', 'secondNodes')
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", clockSettings.secondR)
    .style('opacity', alpha)
    .call(secondForce.drag);
};

var spawnMinute = function() {
  clockSettings.minuteNodes.push({ id: [1] });
  minuteForce.start();

  var alpha = Math.random() * 0.6 + 0.4;

  minuteNode = minuteNode.data(clockSettings.minuteNodes);

  minuteNode.enter().append('circle')
    .attr('class', 'minuteNodes')
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", clockSettings.minuteR)
    .style('opacity', alpha)
    .call(minuteForce.drag);
};

var spawnHour = function() {
  clockSettings.hourNodes.push({ id: [2] });
  hourForce.start();

  var alpha = Math.random() * 0.6 + 0.2;

  hourNode = hourNode.data(clockSettings.hourNodes);

  hourNode.enter().append('circle')
    .attr('class', 'hourNodes')
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", clockSettings.hourR)
    .style('opacity', alpha)
    .call(hourForce.drag);
};

var convertSeconds = function() {
  clockSettings.secondNodes.splice(0);
  svg.selectAll('.secondNodes').data([clockSettings.secondNodes]).exit().remove();
};

var convertMinutes = function() {
  clockSettings.minuteNodes.splice(0);
  svg.selectAll('.minuteNodes').data(clockSettings.minuteNodes).exit().remove();
};

var convertHour = function(){
  clockSettings.hourNodes.splice(0);
  svg.selectAll('.hourNodes').data(clockSettings.hourNodes).exit().remove();
};

var init = function() {
  var date = new Date();
  var s = 0,
      m = 0,
      h = 0;
  while (s++ < date.getSeconds()) {
    spawnSecond();
  }
  while (m++ < date.getMinutes()) {
    spawnMinute();
  }
  while (h++ < date.getHours()) {
    spawnHour();
  }

  updateDigital();
};

//Updates for every second
var update = function() {
  var date = new Date();
  var s = date.getSeconds(),
      m = date.getMinutes(),
      h = date.getHours();

  while(s!==clockSettings.secondNodes.length){
    if(s>clockSettings.secondNodes.length){  
      spawnSecond();
      secondBump();
    } else {
      convertSeconds();
    }
  }

  while(m!==clockSettings.minuteNodes.length){
    if(m>clockSettings.minuteNodes.length){
      spawnMinute();
      minuteBump();
    } else {
      convertMinutes();
    }
  }

  while(h!==clockSettings.hourNodes.length){
    if(h>clockSettings.hourNodes.length){  
      spawnHour();
      hourBump();
    } else {
      convertHour();
    }
  }
  updateDigital();
};

var updateDigital = function() {
  var digSec = clockSettings.secondNodes.length;
  var digMin = clockSettings.minuteNodes.length;
  var digHour = clockSettings.hourNodes.length;

  if (digSec < 10) {
    $('.second').text('0' + digSec);
  } else {
    $('.second').text(digSec);
  }
  if (digMin < 10) {
    $('.minute').text('0' + digMin);
  } else {
    $('.minute').text(digMin);
  }
  if (digHour < 10) {
    $('.hour').text('0' + digHour);
  } else {
    $('.hour').text(digHour);
  }
};

var bumpTick = function(node, index) {
  node.x += (Math.random() - 0.5) * clockSettings.tickBlast;
  node.y += (Math.random() - 0.5) * clockSettings.tickBlast;
};

var bumpTiny = function(node, index) {
  node.x += (Math.random() - 0.5) * clockSettings.tinyBlast;
  node.y += (Math.random() - 0.5) * clockSettings.tinyBlast;
}

var bumpClick = function(node, index) {
  node.x += (Math.random() - 0.5) * clockSettings.clickBlast;
  node.y += (Math.random() - 0.5) * clockSettings.clickBlast;
}


var secondBump = function() {
  clockSettings.secondNodes.forEach(bumpTick);
  clockSettings.minuteNodes.forEach(bumpTiny);
  clockSettings.hourNodes.forEach(bumpTiny);
  secondForce.resume();
  minuteForce.resume();
  hourForce.resume();
};

var minuteBump = function() {
  clockSettings.minuteNodes.forEach(bumpTick);
  clockSettings.secondNodes.forEach(bumpTiny);
  clockSettings.hourNodes.forEach(bumpTiny);
  minuteForce.resume();
  secondForce.resume();
  hourForce.resume();
};

var hourBump = function() {
  clockSettings.hourNodes.forEach(bumpTick);
  clockSettings.secondNodes.forEach(bumpTiny);
  clockSettings.minuteNodes.forEach(bumpTiny);
  hourForce.resume();
  secondForce.resume();
  minuteForce.resume();
};

var clickBump = function() {
  d3.event.stopPropagation();

  clockSettings.secondNodes.forEach(bumpClick);
  clockSettings.minuteNodes.forEach(bumpClick);
  clockSettings.hourNodes.forEach(bumpClick);
  secondForce.resume();
  minuteForce.resume();
  hourForce.resume();
};

d3.select('body').on('mousedown', function() {
  clickBump();
});

init(); 

//-----------------------------
//This handles the FPS from stats.js
// var stats = new Stats();
// stats.setMode(0); // 0: fps, 1: ms

// // align top-left
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.left = '0px';
// stats.domElement.style.top = '0px';

// document.body.appendChild(stats.domElement);

// var updateStats = function() {

//   stats.begin();

//   // monitored code goes here

//   stats.end();

//   requestAnimationFrame(updateStats);

// };
//------------------------------

 // requestAnimationFrame(updateStats); //Call updateStates for every frame
d3.timer(update, 500);