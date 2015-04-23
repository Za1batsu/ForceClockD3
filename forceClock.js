//Variable to hold settings and information
var settings = {
  height: window.innerHeight / 3 * 2,
  width: window.innerWidth,
  nodes: [],
  tinyBlast: 2,
  tickBlast: 10,
  clickBlast: 60,
};

var svg = d3.select('body')
  .append('svg')
  .attr('height', '100%')
  .attr('width', '100%')
  .classed({ 'svg': true });

var seconds = {
  r: 5,
  nodes: [],
  charge: -10,
  x: (settings.width / 3) * 2.5,
  y: (settings.height / 3) * 3,
  node: svg.selectAll('.secondNodes')
};

var minutes = {
  r: 8,
  nodes: [],
  charge: -15,
  x: (settings.width / 2),
  y: (settings.height / 3) * 3,
  node: svg.selectAll('.minuteNodes')
};

var hours = {
  r: 12,
  nodes: [],
  charge: -50,
  x: (settings.width / 3) * 0.5,
  y: (settings.height / 3) * 3,
  node: svg.selectAll('.hourNodes')
};

var tick = function(tp, e) {
  var k = e.alpha * 0.1;
 
  tp.nodes.forEach(function(o, i){
    o.y += (tp.y - o.y) * k;
    o.x += (tp.x - o.x) * k;
  });

  tp.node
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
};

var force = function(tp, node){
  return d3.layout.force()
    .nodes(tp.nodes)
    .links([])
    .gravity(0)
    .charge(tp.charge)
    .size([settings.width, settings.height])
    .on('tick', function(e){
      tick(tp, e);
    });
}

var secondForce = force(seconds);
var minuteForce = force(minutes);
var hourForce = force(hours);

var spawnSecond = function() {
  seconds.nodes.push({ id: [0] });
  secondForce.start();

  var alpha = Math.random() * 0.6 + 0.2;

  seconds.node = seconds.node.data(seconds.nodes);
  seconds.node.enter().append('circle')
    .attr('class', 'secondNodes')
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", seconds.r)
    .style('opacity', alpha)
    .call(secondForce.drag);
};

var spawnMinute = function() {
  minutes.nodes.push({ id: [1] });
  minuteForce.start();

  var alpha = Math.random() * 0.6 + 0.4;

  minutes.node = minutes.node.data(minutes.nodes);

  minutes.node.enter().append('circle')
    .attr('class', 'minuteNodes')
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", minutes.r)
    .style('opacity', alpha)
    .call(minuteForce.drag);
};

var spawnHour = function() {
  hours.nodes.push({ id: [2] });
  hourForce.start();

  var alpha = Math.random() * 0.6 + 0.2;

  hours.node = hours.node.data(hours.nodes);

  hours.node.enter().append('circle')
    .attr('class', 'hourNodes')
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", hours.r)
    .style('opacity', alpha)
    .call(hourForce.drag);
};

var convertSeconds = function() {
  seconds.nodes.splice(0);
  svg.selectAll('.secondNodes').data([seconds.nodes]).exit().remove();
};

var convertMinutes = function() {
  minutes.nodes.splice(0);
  svg.selectAll('.minuteNodes').data(minutes.nodes).exit().remove();
};

var convertHour = function(){
  hours.nodes.splice(0);
  svg.selectAll('.hourNodes').data(hours.nodes).exit().remove();
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

  while(s!==seconds.nodes.length){
    if(s>seconds.nodes.length){  
      spawnSecond();
      secondBump();
    } else {
      convertSeconds();
    }
  }

  while(m!==minutes.nodes.length){
    if(m>minutes.nodes.length){
      spawnMinute();
      minuteBump();
    } else {
      convertMinutes();
    }
  }

  while(h!==hours.nodes.length){
    if(h>hours.nodes.length){  
      spawnHour();
      hourBump();
    } else {
      convertHour();
    }
  }
  updateDigital();
};

var updateDigital = function() {
  var digSec = seconds.nodes.length;
  var digMin = minutes.nodes.length;
  var digHour = hours.nodes.length;

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
  node.x += (Math.random() - 0.5) * settings.tickBlast;
  node.y += (Math.random() - 0.5) * settings.tickBlast;
};

var bumpTiny = function(node, index) {
  node.x += (Math.random() - 0.5) * settings.tinyBlast;
  node.y += (Math.random() - 0.5) * settings.tinyBlast;
}

var bumpClick = function(node, index) {
  node.x += (Math.random() - 0.5) * settings.clickBlast;
  node.y += (Math.random() - 0.5) * settings.clickBlast;
}


var secondBump = function() {
  seconds.nodes.forEach(bumpTick);
  minutes.nodes.forEach(bumpTiny);
  hours.nodes.forEach(bumpTiny);
  secondForce.resume();
  minuteForce.resume();
  hourForce.resume();
};

var minuteBump = function() {
  minutes.nodes.forEach(bumpTick);
  seconds.nodes.forEach(bumpTiny);
  hours.nodes.forEach(bumpTiny);
  minuteForce.resume();
  secondForce.resume();
  hourForce.resume();
};

var hourBump = function() {
  hours.nodes.forEach(bumpTick);
  seconds.nodes.forEach(bumpTiny);
  minutes.nodes.forEach(bumpTiny);
  hourForce.resume();
  secondForce.resume();
  minuteForce.resume();
};

var clickBump = function() {
  d3.event.stopPropagation();

  seconds.nodes.forEach(bumpClick);
  minutes.nodes.forEach(bumpClick);
  hours.nodes.forEach(bumpClick);
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