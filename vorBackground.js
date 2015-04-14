$(document).ready(function() {

  var portrait = new Portrait();

  portrait.init();
});

var Portrait = function() {
  this.width = window.innerWidth;
  this.height = window.innerHeight;

  this.recolorDuration = 2000;
  this.autoRecolor = true;

  //Vertices
  this.vertCount = 50;
  this.vertices = d3.range(this.vertCount).map(function() {
    return [(Math.random() * this.width), (Math.random() * this.height)];
  }.bind(this));

  //Voronoi
  this.voronoi = d3.geom.voronoi()
    .clipExtent([
      [0, 0],
      [this.width, this.height]
    ]);

  //SVG
  // this.svg = svg;
  this.svg = d3.select('body').append('svg')
                  .attr('width', this.width)
                  .attr('height', this.height)
                  .attr('class', 'svg2');

  //Path
  this.path = this.svg.append('g').selectAll('path');

  //A circle for each vertices
  this.svg.selectAll('circle').data(this.vertices)
    .enter().append('circle')
    .attr('class', 'vertices')
    .attr('fill', 'none')
    .attr('transform', function(d) {
      return 'translate(' + d + ')';
    })
    .attr('r', 1.5);
};

Portrait.prototype.init = function() {
  this.redraw();
  this.recolor(this.path[0]);
  //on clicking svg canvas
  if (!this.autoRecolor) {
    this.svg.on('click', function() {
      this.recolor(this.path[0]);
      // this.redraw();
    }.bind(this));
  } else {
    this.recolor(this.path[0]);
    d3.timer(function() {
      this.recolor(this.path[0]);
    }.bind(this), 2000);
  }

  this.vertices.splice(0);
  this.svg.selectAll('.vertices').data(this.vertices).exit().remove();

  // this.path.on('click', function(d){
  //   d3.select(this).transition().duration(1000)
  //       .attr('fill', randColor());

  //       // //Changes again on interval
  //       // setInterval(function(){
  //       //     d3.select(this).transition().duration(1000)
  //       //         .attr('fill', randColor());
  //       // }.bind(this), 1000);
  // });
};

var randColor = function() {
  return '#' + (function co(lor) {
    return (lor +=
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) &&
      (lor.length == 6) ? lor : co(lor);
  })('');
};

Portrait.prototype.polygon = function(d) {
  return 'M' + d.join('L') + 'Z';
};

Portrait.prototype.redraw = function() {
  this.path = this.path.data(this.voronoi(this.vertices), this.polygon);

  this.path.exit().remove();

  this.path.enter().append('path')
    .attr('class', 'shard')
    // .attr('fill', randColor())
    // .attr('opacity', 0.3)
    .attr('d', this.polygon);

  this.path.each(function() {
    d3.select(this).attr('fill', randColor());
  });

  this.path.order();
};

Portrait.prototype.recolor = function(shardArray) {
  for (var i = 0; i < shardArray.length; i++) {
    d3.select(shardArray[i]).transition().duration((Math.random() * this.recolorDuration) + 100)
      .attr('fill', randColor())
      .attr('stroke', 'none');
  }
};

//Transition each vertices to a random position
//FAILURE!!!!
Portrait.prototype.revertices = function() {
  var circles = d3.selectAll('circle');
  circles.each(function(o, i) {
    d3.select(circles[0][i]).attr('transform', 'translate(' + (Math.random() * this.width) + ',' + (Math.random() * this.height) + ')');
  });

};