var data = [
  {month: new Date(2015, 0, 1), EML4_ALK_Fusion: 1.35, ALK_NonCoding_Fusion: 0.58, ALK_L1196M: 0, ALK_G1269A: 0.1},
  {month: new Date(2015, 1, 1), EML4_ALK_Fusion: 0, ALK_NonCoding_Fusion: 0, ALK_L1196M: 0, ALK_G1269A: 0},
  {month: new Date(2015, 2, 1), EML4_ALK_Fusion: 0, ALK_NonCoding_Fusion: 0, ALK_L1196M: 0, ALK_G1269A: 0},
  {month: new Date(2015, 3, 1), EML4_ALK_Fusion: 0.3, ALK_NonCoding_Fusion: 0, ALK_L1196M: 0, ALK_G1269A: 0},
  {month: new Date(2015, 4, 1), EML4_ALK_Fusion: 1.36, ALK_NonCoding_Fusion: 0.32, ALK_L1196M: 0.31, ALK_G1269A: 0},
  {month: new Date(2015, 5, 1), EML4_ALK_Fusion: 3.32, ALK_NonCoding_Fusion: 0.7, ALK_L1196M: 0.27, ALK_G1269A: 0},
  {month: new Date(2015, 6, 1), EML4_ALK_Fusion: 1.62, ALK_NonCoding_Fusion: 0.14, ALK_L1196M: 0.22, ALK_G1269A: 0},
  {month: new Date(2015, 7, 1), EML4_ALK_Fusion: 0.82, ALK_NonCoding_Fusion: 0.17, ALK_L1196M: 0.13, ALK_G1269A: 0},
  {month: new Date(2015, 8, 1), EML4_ALK_Fusion: 1.1, ALK_NonCoding_Fusion: 0.15, ALK_L1196M: 0.15, ALK_G1269A: 0.5},
  {month: new Date(2015, 9, 1), EML4_ALK_Fusion: 1.62, ALK_NonCoding_Fusion: 0.15, ALK_L1196M: 0.19, ALK_G1269A: 0.01},
  {month: new Date(2015, 10, 1), EML4_ALK_Fusion: 3.17, ALK_NonCoding_Fusion: 0.45, ALK_L1196M: 0.3, ALK_G1269A: 0},
  {month: new Date(2015, 11, 1), EML4_ALK_Fusion: 3.35, ALK_NonCoding_Fusion: 0.72, ALK_L1196M: 0.31, ALK_G1269A: 0.13},
  {month: new Date(2016, 1, 1), EML4_ALK_Fusion: 3.58, ALK_NonCoding_Fusion: 1.26, ALK_L1196M: 0.32, ALK_G1269A: 0.57},
  {month: new Date(2016, 2, 1), EML4_ALK_Fusion: 2.93, ALK_NonCoding_Fusion: 1.71, ALK_L1196M: 0.66, ALK_G1269A: 0.36},
  {month: new Date(2016, 3, 1), EML4_ALK_Fusion: 3.24, ALK_NonCoding_Fusion: 1.17, ALK_L1196M: 0.46, ALK_G1269A: 0.23},
  {month: new Date(2016, 4, 1), EML4_ALK_Fusion: 4.35, ALK_NonCoding_Fusion: 0.35, ALK_L1196M: 0.17, ALK_G1269A: 0.09}
];

var stack = d3.stack()
	.keys(["EML4_ALK_Fusion","ALK_NonCoding_Fusion","ALK_L1196M","ALK_G1269A"])
	.order(d3.stackOrderInsideOut)
	//.order(d3.stackOrderNone)
	//.offset(d3.stackOffsetWiggle);
	.offset(d3.stackOffsetSilhouette);

var series = stack(data);

var aspect = 400 / 600;

    var margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = $("#lgtdGraph").width() - margin.left - margin.right,
        height = ($("#lgtdGraph").width()*aspect) - margin.top - margin.bottom;

var svg = d3.select("#lgtdGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var defs = svg.append("defs");
var g0 = defs.append("linearGradient").attr("id", "g0").attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "0%");
g0.append("stop").attr('class', 'start').attr("offset", "0%").attr("stop-color", "#00aeff").attr("stop-opacity", 1);
g0.append("stop").attr('class', 'end').attr("offset", "100%").attr("stop-color", "#006da0").attr("stop-opacity", 1);

var g1 = defs.append("linearGradient").attr("id", "g1").attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "0%");
g1.append("stop").attr('class', 'start').attr("offset", "0%").attr("stop-color", "#3af600").attr("stop-opacity", 1);
g1.append("stop").attr('class', 'end').attr("offset", "100%").attr("stop-color", "#269105").attr("stop-opacity", 1);

var g2 = defs.append("linearGradient").attr("id", "g2").attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "0%");
g2.append("stop").attr('class', 'start').attr("offset", "0%").attr("stop-color", "#eaff00").attr("stop-opacity", 1);
g2.append("stop").attr('class', 'end').attr("offset", "100%").attr("stop-color", "#ffd200").attr("stop-opacity", 1);

var g3 = defs.append("linearGradient").attr("id", "g3").attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "0%");
g3.append("stop").attr('class', 'start').attr("offset", "0%").attr("stop-color", "#ff00de").attr("stop-opacity", 1);
g3.append("stop").attr('class', 'end').attr("offset", "100%").attr("stop-color", "#980785").attr("stop-opacity", 1);

var x = d3.scaleTime()
	.domain(d3.extent(data, function(d){ return d.month; }))
	.range([0, width]);

var bisectDate = d3.bisector(function(d) { return d.month; }).left;

// setup axis
var xAxis = d3.axisBottom(x);
	var y = d3.scaleLinear()
		.domain([-5, d3.max(series, function(layer) { return d3.max(layer, function(d){ return d[0] + d[1];}); })])
		.range([height, 0]);
	var yAxis = d3.axisLeft(y);

//var color = d3.scaleLinear(d3.interpolateRainbow())
//    .range(["#51D0D7", "#ffd000"]);

var color = d3.scaleOrdinal(d3.schemeCategory20);

var area = d3.area()
	.x(function(d) {
		//console.info('in area function', d);
		return x(d.data.month);
	})
	.y0(function(d) { return y(d[0]); })
	.y1(function(d) { return y(d[1]); })
	.curve(d3.curveBasis);


svg.selectAll(".layer")
    .data(series)
    .enter().append("path")
	.attr("class", "layer")
    .attr("d", area)
	.style("fill-opacity", "0.6")
	.style("stroke", function(d) {
		return '#fff';
		//return color(d.index);
	})
	.style("stroke-width", "0.0")
	.style("fill", function(d) {
		return "url(#g"+d.index+")";
		//return color(d.index);
	})
	.style("cursor", "pointer")
	.on("mouseover", function (d) {
                d3.select(this).style("fill-opacity","1");
	})
	.on("mousemove", function(d) {
		mousex = d3.mouse(this);
		mousex = mousex[0];
		//console.info(mousex);

		var i = bisectDate(data,x.invert(mousex),1);
		//console.log(d.key+" "+i+" "+d[i].data[d.key]);

		d3.select(this)
			.style("stroke", "#fff")
			.style("stroke-width", "3px"), 
			dataWindow.html( "<p>" + (d.key).replace(/_/g,' ')+ "<br>AF: "+d[i-1].data[d.key]+"%</p>" ).style("visibility", "visible");
      
	})
	.on("mouseout", function(d) {
		d3.select(this).style("fill-opacity","0.6").style("stroke-width", "0");
		dataWindow.style("visibility", "hidden");
	});


svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            //.call(xAxis.ticks(10,""))
            .call(xAxis)
            .selectAll("text")
            .attr("y", 20)
            .attr("x", -10)
            .attr("dy", "-0.8em")
            .attr("dx", "0.15em")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "10px");
/*
svg.append("g")
	.attr("class", "y axis")
            .call(yAxis.ticks(0))
            .style("font-size", "10px")
            .append("text")
            .attr("y", 10)
            .attr("dx", "-0.1em")
            .attr("dy", "-1.4em")
            .style("text-anchor", "start")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("transform", "rotate(90)")
            .text("Approximate ploidy");
*/
var vertical = d3.select("svg")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "19")
        .style("width", "3px")
        .style("height", "600px")
        .style("top", "10px")
        .style("bottom", "30px")
        .style("left", "0px")
        .style("background", "#00aeef");

  d3.select(".svg")
      .on("mousemove", function(){  
         mousex = d3.mouse(this);
         mousex = mousex[0] + 5;
         vertical.style("left", mousex + "px" )})
      .on("mouseover", function(){  
         mousex = d3.mouse(this);
         mousex = mousex[0] + 5;
         vertical.style("left", mousex + "px")});

var dataWindow = d3.select("#lgtdGraph")
	.append("div")
	.attr("class", "remove")
	.style("position", "absolute")
	.style("z-index", "20")
	.style("visibility", "hidden")
	.style("top", "10px")
	.style("left", "120px")
	.style("font-size", "13px");
