//Variable to hold settings and information
var clockSettings = {
  height: window.innerHeight / 3 * 2,
  width: window.innerWidth,
  //nodes: [],
  secondNodes: [],
  minuteNodes: [],
  hourNodes: [],
  nodes: [],
  tinyBlast: 2,
  tickBlast: 10,
  clickBlast: 60
};

var fociPos = [{
  x: (clockSettings.width / 3) * 2.5,
  y: (clockSettings.height / 4) * 3
}, {
  x: (clockSettings.width / 2),
  y: (clockSettings.height / 4) * 3
}, {
  x: (clockSettings.width / 3) * 0.5,
  y: (clockSettings.height / 4) * 3
}];

var fillColor = d3.scale.category20();

var svg = d3.select('body') //.select('div')
  .append('svg')
  .attr('height', '100%')
  .attr('width', '100%')
  .classed({
    'svg': true
  });
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
// var force = d3.layout.force()
//               .nodes(clockSettings.nodes)
//               .links([])
//               .gravity(0)
//               .size([clockSettings.width, clockSettings.height])
//               .on('tick', tick); //Invoke 'tick' on every...tick.

//var node = svg.selectAll('circle');
var secondNode = svg.selectAll('.secondNodes');
var minuteNode = svg.selectAll('.minuteNodes');
var hourNode = svg.selectAll('.hourNodes');

function secondTick(e) {
  var k = e.alpha * 0.1;

  //Push nodes towards designated position. 
  clockSettings.secondNodes.forEach(function(o, i) {
    o.y += (fociPos[o.id].y - o.y) * k;
    o.x += (fociPos[o.id].x - o.x) * k;
  });

  secondNode.attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
}

function minuteTick(e) {
  var k = e.alpha * 0.1;

  //Push nodes towards designated position. 
  clockSettings.minuteNodes.forEach(function(o, i) {
    o.y += (fociPos[o.id].y - o.y) * k;
    o.x += (fociPos[o.id].x - o.x) * k;
  });

  minuteNode.attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
}

function hourTick(e) {
  var k = e.alpha * 0.1;

  //Push nodes towards designated position. 
  clockSettings.hourNodes.forEach(function(o, i) {
    o.y += (fociPos[o.id].y - o.y) * k;
    o.x += (fociPos[o.id].x - o.x) * k;
  });

  hourNode.attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
}

var spawnSecond = function() {
  clockSettings.secondNodes.push({
    id: [0]
  });
  secondForce.start();

  secondNode = secondNode.data(clockSettings.secondNodes);
  secondNode.enter().append('circle')
    .attr('class', 'secondNodes')
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", 5)
    .call(secondForce.drag);
  //clockSettings.secondNodes = svg.selectAll('.seconds');

  // clockSettings.secondCount++;

};
var spawnMinute = function() {
  clockSettings.minuteNodes.push({
    id: [1]
  });
  minuteForce.start();

  minuteNode = minuteNode.data(clockSettings.minuteNodes);

  // if(!atPos){
  minuteNode.enter().append('circle')
    .attr('class', 'minuteNodes')
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", 8)
    .call(minuteForce.drag);
  //clockSettings.secondNodes = svg.selectAll('.seconds');
  // }

  // clockSettings.minuteCount++;
};

var spawnHour = function() {
  clockSettings.hourNodes.push({
    id: [2]
  });
  hourForce.start();

  hourNode = hourNode.data(clockSettings.hourNodes);

  // if(!atPos){
  hourNode.enter().append('circle')
    .attr('class', 'hourNodes')
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", 12)
    .call(hourForce.drag);
  //clockSettings.secondNodes = svg.selectAll('.seconds');
  // }

  // clockSettings.hourCount++;
};

var convertSeconds = function() {
  // force.stop();
  // clockSettings.secondNodes = [];
  // svg.selectAll('.seconds').data(clockSettings.secondNodes)
  //   .exit().remove();
  clockSettings.secondNodes.splice(0);

  svg.selectAll('.secondNodes').data([clockSettings.secondNodes]).exit().remove();
  // clockSettings.secondCount = -1;
};

var convertMinutes = function() {
  // force.stop();
  clockSettings.minuteNodes.splice(0);
  svg.selectAll('.minuteNodes').data(clockSettings.minuteNodes).exit().remove();
  // clockSettings.minuteCount = -1;
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
    // while(s++<57){
    spawnSecond();
  }
  while (m++ < date.getMinutes()) {
    // while(m++<59){
    spawnMinute();
  }
  while (h++ < date.getHours()) {
    // while(h++<24){
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

var secondBump = function() {

  clockSettings.secondNodes.forEach(function(node, index) {
    node.x += (Math.random() - 0.5) * clockSettings.tickBlast;
    node.y += (Math.random() - 0.5) * clockSettings.tickBlast;
  });
  secondForce.resume();
  secondForce.resume();
  clockSettings.minuteNodes.forEach(function(node, index) {
    node.x += (Math.random() - 0.5) * clockSettings.tinyBlast;
    node.y += (Math.random() - 0.5) * clockSettings.tinyBlast;
  });
  minuteForce.resume();
  clockSettings.hourNodes.forEach(function(node, index) {
    node.x += (Math.random() - 0.5) * clockSettings.tinyBlast;
    node.y += (Math.random() - 0.5) * clockSettings.tinyBlast;
  });
  hourForce.resume();
};

var minuteBump = function() {
  clockSettings.minuteNodes.forEach(function(node, index) {
    node.x += (Math.random() - 0.5) * clockSettings.tickBlast;
    node.y += (Math.random() - 0.5) * clockSettings.tickBlast;
  });
  minuteForce.resume();
  clockSettings.secondNodes.forEach(function(node, index) {
    node.x += (Math.random() - 0.5) * clockSettings.tinyBlast;
    node.y += (Math.random() - 0.5) * clockSettings.tinyBlast;
  });
  secondForce.resume();
  clockSettings.hourNodes.forEach(function(node, index) {
    node.x += (Math.random() - 0.5) * clockSettings.tinyBlast;
    node.y += (Math.random() - 0.5) * clockSettings.tinyBlast;
  });
  hourForce.resume();
};

var hourBump = function() {
  clockSettings.hourNodes.forEach(function(node, index) {
    node.x += (Math.random() - 0.5) * clockSettings.tickBlast;
    node.y += (Math.random() - 0.5) * clockSettings.tickBlast;
  });
  hourForce.resume();
  clockSettings.secondNodes.forEach(function(node, index) {
    node.x += (Math.random() - 0.5) * clockSettings.tinyBlast;
    node.y += (Math.random() - 0.5) * clockSettings.tinyBlast;
  });
  secondForce.resume();
  clockSettings.minuteNodes.forEach(function(node, index) {
    node.x += (Math.random() - 0.5) * clockSettings.tinyBlast;
    node.y += (Math.random() - 0.5) * clockSettings.tinyBlast;
  });
  minuteForce.resume();
};

var clickBump = function() {
  d3.event.stopPropagation();

  clockSettings.secondNodes.forEach(function(node, index) {
    node.x += (Math.random() - 0.5) * clockSettings.clickBlast;
    node.y += (Math.random() - 0.5) * clockSettings.clickBlast;
  });
  secondForce.resume();
  clockSettings.minuteNodes.forEach(function(node, index) {
    node.x += (Math.random() - 0.5) * clockSettings.clickBlast;
    node.y += (Math.random() - 0.5) * clockSettings.clickBlast;
  });
  minuteForce.resume();
  clockSettings.hourNodes.forEach(function(node, index) {
    node.x += (Math.random() - 0.5) * clockSettings.clickBlast;
    node.y += (Math.random() - 0.5) * clockSettings.clickBlast;
  });
  hourForce.resume();
};

d3.select('body').on('mousedown', function() {
  clickBump();
});

init(); 






//-----------------------------
//This handles the FPS from stats.js
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild(stats.domElement);

var updateStats = function() {

  stats.begin();

  // monitored code goes here

  stats.end();

  requestAnimationFrame(updateStats);

};
//------------------------------

 requestAnimationFrame(updateStats); //Call updateStates for every frame
d3.timer(update, 500);

