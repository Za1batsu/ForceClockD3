

//Variable to hold settings and information
var clockSettings = {
  height: window.innerHeight/3*2,
  width: window.innerWidth,
  fillColor: {
    second: 'blue',
    minute: 'red',
    hour: 'green'
  },
  //nodes: [],
  secondNodes: [],
  minuteNodes: [],
  hourNodes: [],
  secondCount: 0,
  minuteCount: 0,
  hourCount: 0,
  //fociPos:[{x:600, y:250}, {x:400, y:250}, {x:200, y:250}] //Seconds, Minutes, Hours
};

var fociPos = [{x:(clockSettings.width/3)*2.5, y:clockSettings.height/2}, 
              {x:(clockSettings.width/2), y:clockSettings.height/2}, 
              {x:(clockSettings.width/3)*0.5, y:clockSettings.height/2}];

var svg = d3.select('body')//.select('div')
                .append('svg')
                .attr('height', clockSettings.height+'px')
                .attr('width', clockSettings.width+"px")
                .classed({'canvas':true});
var secondForce = d3.layout.force()
              .nodes(clockSettings.secondNodes)
              .links([])
              .gravity(0)
              .size([clockSettings.width, clockSettings.height])
              .on('tick', secondTick); //Invoke 'tick' on every...tick.
var minuteForce = d3.layout.force()
              .nodes(clockSettings.minuteNodes)
              .links([])
              .gravity(0)
              .size([clockSettings.width, clockSettings.height])
              .on('tick', minuteTick); //Invoke 'tick' on every...tick.
var hourForce = d3.layout.force()
              .nodes(clockSettings.hourNodes)
              .links([])
              .gravity(0)
              .size([clockSettings.width, clockSettings.height])
              .on('tick', hourTick); //Invoke 'tick' on every...tick.
// var force = d3.layout.force()
//               .nodes(clockSettings.nodes)
//               .links([])
//               .gravity(0)
//               .size([clockSettings.width, clockSettings.height])
//               .on('tick', tick); //Invoke 'tick' on every...tick.

//var node = svg.selectAll('circle');
var secondNode = svg.selectAll('.seconds');
var minuteNode = svg.selectAll('.minutes');
var hourNode = svg.selectAll('.hours');

function secondTick(e){
  var k = e.alpha*0.1;

  //Push nodes towards designated position. 
  clockSettings.secondNodes.forEach(function(o,i){
    o.y += (fociPos[o.id].y - o.y) * k;
    o.x += (fociPos[o.id].x - o.x) * k;
  });

  secondNode.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}
function minuteTick(e){
  var k = e.alpha*0.1;

  //Push nodes towards designated position. 
  clockSettings.minuteNodes.forEach(function(o,i){
    o.y += (fociPos[o.id].y - o.y) * k;
    o.x += (fociPos[o.id].x - o.x) * k;
  });

  minuteNode.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}
function hourTick(e){
  var k = e.alpha*0.1;

  //Push nodes towards designated position. 
  clockSettings.hourNodes.forEach(function(o,i){
    o.y += (fociPos[o.id].y - o.y) * k;
    o.x += (fociPos[o.id].x - o.x) * k;
  });

  hourNode.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

var spawnSecond = function(){
  clockSettings.secondNodes.push({id:[0]});
  secondForce.start();

  secondNode = secondNode.data(clockSettings.secondNodes);
  secondNode.enter().append('circle')
                .attr('class', 'seconds')
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", 4)
                .style('fill', clockSettings.fillColor.second)
                .call(secondForce.drag);
  //clockSettings.secondNodes = svg.selectAll('.seconds');

  clockSettings.secondCount++;
};
var spawnMinute = function(){
  clockSettings.minuteNodes.push({id:[1]});
  minuteForce.start();

  minuteNode = minuteNode.data(clockSettings.minuteNodes);

  // if(!atPos){
    minuteNode.enter().append('circle')
                  .attr('class', 'minutes')
                  .attr("cx", function(d) { return d.x; })
                  .attr("cy", function(d) { return d.y; })
                  .attr("r", 8)
                  .style('fill', clockSettings.fillColor.minute)
                  .call(minuteForce.drag);
    //clockSettings.secondNodes = svg.selectAll('.seconds');
  // }

  clockSettings.minuteCount++;
};

var spawnHour = function(){
  clockSettings.hourNodes.push({id:[2]});
  hourForce.start();

  hourNode = hourNode.data(clockSettings.hourNodes);

  // if(!atPos){
    hourNode.enter().append('circle')
                  .attr('class', 'hours')
                  .attr("cx", function(d) { return d.x; })
                  .attr("cy", function(d) { return d.y; })
                  .attr("r", 12)
                  .style('fill', clockSettings.fillColor.hour)
                  .call(hourForce.drag);
    //clockSettings.secondNodes = svg.selectAll('.seconds');
  // }

  clockSettings.hourCount++;
};

var convertSeconds = function(){
  // force.stop();
  // clockSettings.secondNodes = [];
  // svg.selectAll('.seconds').data(clockSettings.secondNodes)
  //   .exit().remove();
  clockSettings.secondNodes.splice(0);

  svg.selectAll('.seconds').data(clockSettings.secondNodes).exit().remove();
  clockSettings.secondCount = 0;
};

var convertMinutes = function(){
  // force.stop();
  clockSettings.minuteNodes.splice(0);
  svg.selectAll('.minutes').data(clockSettings.minuteNodes).exit().remove();
  clockSettings.minuteCount = 0;
};
var init = function(){
  var s=0, m=0, h=0;
  while(s++<date.getSeconds()){
  // while(s++<57){
    spawnSecond();
  }
  while(m++<date.getMinutes()){
   // while(m++<59){
    spawnMinute();
  }
  while(h++<date.getHours()){
   // while(h++<2){
    spawnHour();
  }
};

//Updates for every second
var update = function(){
  if(clockSettings.secondCount >= 59){
    convertSeconds();
    if(clockSettings.minuteCount >=59){
      convertMinutes();
      spawnHour();
    }
    
      spawnMinute();
    
  }
    spawnSecond();
  
};








var date = new Date();
//console.dir(clockSettings.secondNodes);
// spawnSecond();
// spawnMinute();
// spawnHour();
init();

// setTimeout(update, 3000);
// setTimeout(update, 5000);
// setTimeout(update, 6000);

setInterval(update, 1000);






