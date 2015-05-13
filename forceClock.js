var svg = d3.select('body')
  .append('svg')
  .attr('height', '100%')
  .attr('width', '100%')
  .classed({ 'svg': true });

set.height = window.innerHeight;
set.width = window.innerWidth;
set.nodes = [seconds, minutes, hours];

var force = function(tp, node){
  return d3.layout.force()
    .nodes(tp.nodes)
    .links([])
    .gravity(tp.g)
    .charge(tp.charge)
    .size([set.width, set.height])
    .on('tick', function(e){
      tick(tp, e);
    });
};

seconds.nodes = [];
seconds.stringed = 'second';
seconds.x = (set.width / 3) * 2.5;
seconds.y = (set.height / 3) * 2;
seconds.node = svg.selectAll('.' + this.stringed + 'Nodes');
seconds.force = force(seconds);

minutes.nodes = [];
minutes.stringed = 'minute';
minutes.x = (set.width / 2);
minutes.y = (set.height / 3) * 2;
minutes.node = svg.selectAll('.' + this.stringed + 'Nodes');
minutes.force = force(minutes);

hours.nodes = [];
hours.stringed = 'hour';
hours.x = (set.width / 3) * 0.5;
hours.y = (set.height / 3) * 2;
hours.node = svg.selectAll('.' + this.stringed + 'Nodes');
hours.force = force(hours);
  
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


var spawn = function(tp) {
  tp.nodes.push({});
  tp.force.start();

  tp.node = tp.node.data(tp.nodes);
  tp.node.enter().append('circle')
    .attr('class', tp.stringed + 'Nodes')
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", tp.r)
    .style('opacity', Math.random() * 0.6 + 0.2)
    .call(seconds.force.drag);
};

var convert = function(tp){
  tp.nodes.splice(0);
  svg.selectAll('.' + tp.stringed + 'Nodes').data([tp.nodes]).exit().remove();
};


var updateNodes = function(t, tpArr){
  while(t !== tpArr[0].nodes.length){
    if(t > tpArr[0].nodes.length){  
      spawn(tpArr[0]);
      tpBump(tpArr[0], tpArr[1], tpArr[2]);
    } else {
      convert(tpArr[0]);
    }
  }
};

var update = function() {
  var date = new Date();

  updateNodes(date.getSeconds(), [seconds, minutes, hours], seconds.force);
  updateNodes(date.getMinutes(), [minutes, seconds, hours], minutes.force);
  updateNodes(date.getHours(), [hours, seconds, minutes], hours.force);

  updateDig();
};

var updateTpDig = function(tp, dig) {
  $('.' + tp.stringed).text( dig < 10 ? '0' + dig : dig );
};

var updateDig = function() {
  updateTpDig(seconds, seconds.nodes.length);
  updateTpDig(minutes, minutes.nodes.length);
  updateTpDig(hours, hours.nodes.length);
};

var bump = function(mag ,node, index){
  node.x += (Math.random() - 0.5) * mag;
  node.y += (Math.random() - 0.5) * mag;
};

d3.select('body').on('mousedown', function() {
  d3.event.stopPropagation();
  for (var i = 0; i < set.nodes.length; i++) {
    set.nodes[i].nodes.forEach(function(node, index){
      bump(set.largeBlast, node, index);
    });
    set.nodes[i].force.resume();
  };
});

tpBump = function(main, otherOne, otherTwo) {
  main.nodes.forEach(function(node, index){
    bump(set.mediumBlast, node, index)
  });
  otherOne.nodes.forEach(function(node, index){
    bump(set.smallBlast, node, index)
  });
  otherTwo.nodes.forEach(function(node, index){
    bump(set.smallBlast, node, index)
  });
  seconds.force.resume();
  minutes.force.resume();
  hours.force.resume();
};

var init = function(date) {
  var initiate = function(n, t, tp){
    while (n++ < t) {
      spawn(tp);
    }
  }
  initiate(0, date.getSeconds(), seconds, seconds.force);
  initiate(0, date.getMinutes(), minutes, minutes.force);
  initiate(0, date.getHours(), hours, hours.force);

  updateDig();
}(new Date()); 

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