//Parses dates with the form day-month(abbreviated) 
var parseDate = d3.timeParse("%d-%b");

//imports data from csv file, parses dates, declares values in tempf and NoOwls
//columns as numbers
d3.csv("2013datatemp.csv")
  .row(function(d) {return {date: parseDate(d.date), tempf:Number(d.tempf), NoOwls:Number(d.NoOwls)};})
  .get(function(error,data) {

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var tempColor;

//get minimum and maximum date, and declare as variables
var minDate = d3.min(data,function(d){return d.date;})
var maxDate = d3.max(data,function(d){return d.date;})

//set the ranges, set the minimum and maximum of the xAxis
var x = d3.scaleTime()
              .domain([minDate, maxDate])
              .range([0, width]);

var y = d3.scaleLinear().range([height, 0]);

var xValue = function(d) { return d.NoOwls;} // data -> value

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // add the tooltip area to the webpage
  var tooltip = d3.select('body').append('div')
      .style('position', 'absolute')
      .style('padding', '0 10px')
      .style('background', 'lightsteelblue')
      .style('opacity', 0)

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([d3.min(data, function(d) { return d.tempf; }) - 1, d3.max(data, function(d) { return d.tempf; })]);

  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
    //base the radius of the dots on the data
      .attr("r", function(d) {return (d.NoOwls * 1.18);})
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.tempf); })
      //on mouseover, display data corresponding to respective dot
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
             tooltip.html("Temp: " + d["tempf"] + "˚F" + "<br/> Owls: " + xValue(d))
                    .style('top', (d3.event.pageY-10)+"px")
                    .style('left',(d3.event.pageX+10)+"px");
                  })

      //on mouseout, reduce opacity of tooltip to zero (hide tooltip)
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

    //add text below the x axis
      svg.append("text")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate("+ (width/2) +","+(height*1.1)+")")  // centre below axis
                    .text("Date");
        //add text behind the y axixs
        svg.append("text")
                .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate(-30,"+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
                .text("Temperature (Fahrenheit)");

});
