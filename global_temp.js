// Code adapted from:
// http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f

var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 900 - margin.left - margin.right,
            height = 900 - margin.top - margin.bottom;

var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g');

queue()
    .defer(d3.csv, "data.csv")
    .await(ready);
function ready(error, data) {

  var parseDate = d3.timeParse("%Y-%m-%d");
  var formatDate = d3.timeFormat("%Y-%m");

  data.forEach(function(d) { 
    d.Year = parseDate(d.Year.slice(0,10));
    d.Anomaly = +d.Anomaly;
  });

  function relative_area(anom) {
    return Math.sqrt((anom / Math.PI));
  };

  var min = d3.min(data, function(d) { return d.Anomaly;} );
  var max = d3.max(data, function(d) { return d.Anomaly;} );

  var scaleNorm = d3.scaleLinear().domain([min,max]).range([0,1])

  min = relative_area(scaleNorm(min));
  max = relative_area(scaleNorm(max));

  var scale = d3.scaleLinear().domain([min,max]).range([75,350])
  // var colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([max,min])
  var colorScale = d3.scaleSequential(d3.interpolateReds).domain([min,max])

  var dur = 1000;
  var i = 0;
  current_max = data[i]['Anomaly'];



  svg.append("circle")
        .attr("cx", width/2)
        .attr("cy", height/2)
        .attr("r", scale(relative_area(scaleNorm(data[0]['Anomaly']))))        
        .attr("fill","none")
        .attr("stroke",colorScale(relative_area(scaleNorm(data[0]['Anomaly']))))
        // .attr("stroke-width",5)
        .transition()
        .duration(dur)
        .style("opacity",0.1)
        // .attr("stroke-width",1)
        .ease(d3.easeLinear)
        // .on("start", repeat)
        ;

  svg.append('text')
      .attr("id","year")
      .attr('x',width/2)
      .attr('y',(height/2))
      .attr('text-anchor','middle')
      .text(function(d) {        
        return formatDate(data[i]['Year'])
      })
      .attr("font-family","Open Sans Condensed")
      .attr("font-size", "30px")
      .attr("fill", "#212121")
      .transition()
      // .delay(1000)
      .ease(d3.easeLinear)
      .on("start", repeat)

  svg.append('text')
      .attr("id","max-anomaly")
      .attr('x',width/2)
      .attr('y',(height/2)+30)
      .attr('text-anchor','middle')
      .text(current_max+"\u00B0"+"C")
      .attr("font-family","Open Sans Condensed")
      .attr("font-size", "30px")
      .attr("fill", "#212121")
      .transition()
      // .delay(1000)
      .ease(d3.easeLinear)
      // .on("start", repeat)



  function repeat() {
    if (i < data.length-1){
      i += 1;
    }
    if (data[i]['Anomaly'] > current_max) {
      current_max = data[i]['Anomaly'];
      

      d3.selectAll("text").filter("#max-anomaly")
        .transition()
        .duration(dur)
        .attr("fill", colorScale(relative_area(scaleNorm(data[i]['Anomaly']))))
        .text(current_max+"\u00B0"+"C")
        .transition()
        .duration(1000)
        .attr("fill", "#212121")
        ;
    }

  svg.append("circle").attr("cx", width/2)
        .attr("cy", height/2)
        .attr("r", scale(relative_area(scaleNorm(data[i]['Anomaly']))))        
        .attr("fill","none")
        .attr("stroke",colorScale(relative_area(scaleNorm(data[i]['Anomaly']))))
        // .attr("stroke-width",5)
        .transition()
        .duration(dur)
        .style("opacity",0.1)
        // .attr("stroke-width",1)

    d3.active(this).filter("#year")
      .transition()
      .duration(dur)
      .text(formatDate(data[i]['Year']))
      .attr("fill", "#212121")
      .on('start',repeat) 

  

  }


}