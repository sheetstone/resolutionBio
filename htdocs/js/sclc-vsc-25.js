var data = [
{month: new Date(2015, 11, 11), TP53_L111P: 17, RB1_FRAMESHIFT: 19.4, NOTCH3_V1659I: 0.4 },
{month: new Date(2016, 2, 15), TP53_L111P: 8, RB1_FRAMESHIFT: 9.8, NOTCH3_V1659I: 0.1 },
{month: new Date(2016, 4, 4), TP53_L111P: 54, RB1_FRAMESHIFT: 54.5, NOTCH3_V1659I: 0 },
{month: new Date(2016, 5, 11), TP53_L111P: 4.8, RB1_FRAMESHIFT: 5.3, NOTCH3_V1659I: 0.1 },
{month: new Date(2016, 6, 16), TP53_L111P: 32, RB1_FRAMESHIFT: 32.9, NOTCH3_V1659I: 0.2 },
{month: new Date(2016, 6, 24), TP53_L111P: 49.7, RB1_FRAMESHIFT: 42.7, NOTCH3_V1659I: 0 },
{month: new Date(2016, 7, 18), TP53_L111P: 54.1, RB1_FRAMESHIFT: 48.8, NOTCH3_V1659I: 0 },
];

var stack = d3.stack()
	.keys(["TP53_L111P", "RB1_FRAMESHIFT","NOTCH3_V1659I"])
	.order(d3.stackOrderInsideOut)
	//.order(d3.stackOrderNone)
	.offset(d3.stackOffsetWiggle);
	//.offset(d3.stackOffsetSilhouette);

var series = stack(data);

var aspect = 400 / 600;

    var margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = $("#lgtdSCLCGraph").width() - margin.left - margin.right,
        height = ($("#lgtdSCLCGraph").width()*aspect) - margin.top - margin.bottom;

var svg = d3.select("#lgtdSCLCGraph").append("svg")
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
		.domain([-30, d3.max(series, function(layer) {
			return d3.max(layer, function(d){ return d[0] + d[1];});
		})])
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
		d3.select(this)
			.style("stroke", "#fff")
			.style("stroke-width", "0px"), 
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

var dataWindow = d3.select("#lgtdSCLCGraph")
	.append("div")
	.attr("class", "remove")
	.style("position", "absolute")
	.style("z-index", "20")
	.style("visibility", "hidden")
	.style("top", "10px")
	.style("left", "120px")
	.style("font-size", "13px");
