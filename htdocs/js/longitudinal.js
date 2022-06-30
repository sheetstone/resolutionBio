var stack = d3.stack()
	.keys(keys)
	.order(d3.stackOrderInsideOut)
	.offset(d3.stackOffsetExpand);

var series = stack(data);

var stack2 = d3.stack().keys(keys)
	.order(d3.stackOrderInsideOut)
	.offset(d3.stackOffsetSilhouette);
var stream = stack2(data);

if(cohortDesc == 'Vanderbilt SCLC VSC-12') {
	var treatmentCSV = 'Treatment,start,end\n"carboplatin + etoposide",7-Jul-15,16-Feb-16';
	var imagingCSV = 'date,comment\n14-Dec-15,"MRI Brain<br>Diffuse intracranial disease"\n1-Jan-16,"CT C/A/P<br>Stable Disease"\n2-Feb-16,"PET Scan<br>Widespread progression in bone"\n';
} else if(cohortDesc == 'Vanderbilt SCLC VSC-13') {
        var treatmentCSV = 'Treatment,start,end\n"carboplatin + etoposide",9-Sep-15,16-Dec-15';        
	var imagingCSV = 'date,comment\n28-Oct-15,"CT Scan<br>Partial Response"\n1-Feb-16,"CT Scan<br>Progession of disease<br>New Liver Lesion<br>Right hilar mass still responding.<br><img src=\'/img/SCLCscan.jpg\'>\n';
} else if(cohortDesc == 'Vanderbilt SCLC VSC-7') {
        var treatmentCSV = 'Treatment,start,end\n"cisplatin and etoposide",20-Jul-15,21-Sep-15\n"carboplatin and etoposide",11-May-16,27-Jul-16';        
        var imagingCSV = 'date,comment\n18-Apr-16,"CT Scan<br>Disease Progression<br>New adrenal metastases"\n5-Oct-16,"CT Scan<br>Stable disease."\n';
} else if(cohortDesc == 'Vanderbilt SCLC VSC-14') {
	var treatmentCSV = 'Treatment,start,end\n"carboplatin + etoposide",31-Aug-15,15-Sep-15\n"Nivolumab",19-Oct-15,30-Nov-15\n"Paclitaxel",21-Dec-15,11-Jan-16\n';
	var imagingCSV = 'date,comment\n14-Oct-15,"CT Scan<br>Progressive Disease"\n15-Dec-15,CT Scan<br>"Progressive Disease"\n25-Jan-16,"CT Scan<br>Progressive Disease"\n';
} else {
	var treatmentCSV = '';
	var imagingCSV = '';
}

var treatment = d3.csvParse(treatmentCSV);
var imaging = d3.csvParse(imagingCSV);

var parseDate = d3.timeParse("%d-%b-%y");
var data_array = d3.csvParse(lineGraph);
var muts = [];
var lineGraphData = data_array.columns.slice(1).map(function(id) {
	muts.push(id);
        return {
                id: id,
                values: data_array.map(function(d) {
                        return {date: parseDate(d.tp), af: +d[id], mut: id};
                })
        };
});

var aspect = 150 / 600;
var mult = 3;
    var margin = {top: 50, right: 140, bottom: 80, left: 90},
        width = $("#longGraph").width() - margin.left - margin.right,
        height = ($("#longGraph").width()*aspect) - margin.top - margin.bottom;
/*
var svg = d3.select("#longGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ",15)");
*/
var svg2 = d3.select("#longLineGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", (height*mult)+ 30  )
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 18 + ")");

var streamSVG = d3.select("#streamGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height+margin.bottom + margin.top)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 18 + ")");

var treatmentSVG = d3.select("#longLineGraph").append("svg")
	.attr("width", width + margin.left + margin.right)
        .attr("height", 30 + 10 )
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")");

var defs = svg2.append("defs");

var g0 = defs.append("linearGradient").attr("id", "g0").attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "0%");
g0.append("stop").attr('class', 'start').attr("offset", "0%").attr("stop-color", "#00aeff").attr("stop-opacity", 0);
g0.append("stop").attr('class', 'end').attr("offset", "100%").attr("stop-color", "#006da0").attr("stop-opacity", 1);

var g1 = defs.append("linearGradient").attr("id", "g1").attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "0%");
g1.append("stop").attr('class', 'start').attr("offset", "0%").attr("stop-color", "#00aeff").attr("stop-opacity", 0);
g1.append("stop").attr('class', 'end').attr("offset", "100%").attr("stop-color", "#006da0").attr("stop-opacity", 0.15);

var g2 = defs.append("linearGradient").attr("id", "g2").attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "0%");
g2.append("stop").attr('class', 'start').attr("offset", "0%").attr("stop-color", "#eaff00").attr("stop-opacity", 1);
g2.append("stop").attr('class', 'end').attr("offset", "100%").attr("stop-color", "#ffd200").attr("stop-opacity", 1);

var g3 = defs.append("linearGradient").attr("id", "g3").attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "0%");
g3.append("stop").attr('class', 'start').attr("offset", "0%").attr("stop-color", "#209cd5").attr("stop-opacity", 1);
g3.append("stop").attr('class', 'end').attr("offset", "100%").attr("stop-color", "#213a63").attr("stop-opacity", 1);

	var x = d3.scaleTime().domain(d3.extent(data, function(d){ return d.month; })).range([0, width]);
	var x2 = d3.scaleTime().domain(d3.extent(data_array, function(d) { return parseDate(d.date); })).range([0, width]);

	var bisectDate = d3.bisector(function(d) { return d.month; }).right;

	 var numberFormat = d3.format(".1%");
	function logFormat(d) {
		var x = Math.log(d) / Math.log(10) + 1e-6;
		return Math.abs(x - Math.floor(x)) < .7 ? numberFormat(d) : "";
	}
	// setup axis
	var xAxis = d3.axisBottom(x);
	var x2Axis = d3.axisBottom(x2);
	/*
	var y2 = d3.scaleLinear().range([height*mult, 0])
		.domain([
			d3.min(lineGraphData, function(c) { return d3.min(c.values, function(d) { return d.af; }); }),
			d3.max(lineGraphData, function(c) { return d3.max(c.values, function(d) { return d.af; }); })
		]);
	*/

	// if low AF then go log, otherwise linear
	if(minAF < .01) {
		var y2 = d3.scaleLog().range([height*mult, 0]).clamp(true).nice().base(10)
			.domain([0.001,
		    //            d3.min(lineGraphData, function(c) { return d3.min(c.values, function(d) { return d.af; }); }),
				d3.max(lineGraphData, function(c) { return d3.max(c.values, function(d) { return d.af; }); })
			]);
		 var y2Axis = d3.axisLeft(y2).tickFormat(logFormat);
	} else {
		var y2 = d3.scaleLinear().range([height*mult, 0]).domain([0,1])
		 var y2Axis = d3.axisLeft(y2).ticks(10,"%");
	}

	var y = d3.scaleLinear().domain([0,1]).range([height, 0])
	//var y = d3.scaleLog().domain([0.1,1]).range([height, 0]);
	var yAxis = d3.axisLeft(y);
	//var y2Axis = d3.axisLeft(y2).tickFormat(d3.format(".1%"));
	var y3 = d3.scaleLinear().range([height,0])
		.domain([-(maxAF*50),(maxAF*50)
			//d3.max(layers0.concat(layers1), function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
			//d3.min(series, function(layer) { return d3.min(layer, function(d){ return d[0] + d[1];}); }),
			//d3.max(series, function(layer) { return d3.max(layer, function(d){ return d[0] + d[1];}); })
			//-(d3.max(lineGraphData, function(c) { return d3.max(c.values, function(d) { return (d.af*100); }); })),
                        //d3.max(lineGraphData, function(c) { return d3.max(c.values, function(d) { return (d.af*100); }); })
			
                ]);
        var y3Axis = d3.axisLeft(y3);
	var color = d3.scaleSequential(d3.interpolateRainbow).domain([0, lineGraphData.length]);
	//var color = d3.scaleOrdinal(d3.schemeCategory20);
	var dateOptions = { year: "numeric", month: "short", day: "numeric" };
	// draw boxes for timepoints

	var mutLine = d3.line()
		//.curve(d3.curveCardinal)
		.curve(d3.curveMonotoneX)
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y2(d.af); });

	var dLast = 0;
	data.forEach(function(d) {
		//console.info(d.month+' '+dLast+' '+x(d.month));
/*
		svg.append("rect")
			.attr("x", dLast)
			.attr("width", x(d.month)-dLast)
			.attr("height", height)
			.style("fill", "url(#g1)");
*/
		svg2.append("rect")
			.attr("x", dLast)
			.attr("width", x(d.month)-dLast)
			.attr("height", height*mult)
			.style("fill", "url(#g1)");

		 streamSVG.append("rect")
			.attr("x", dLast)
			.attr("width", x(d.month)-dLast)
			.attr("height", height)
			.style("fill", "url(#g1)");
/*
		svg.append("line")
			.attr("x1", x(d.month))
			.attr("y1", 0)
			.attr("x2", x(d.month))
			.attr("y2", height)
			.attr("class", "line")
			.style("stroke", "#006da0")
			.style("stroke-width", "2px");
*/
		svg2.append("line")
			.attr("x1", x(d.month))
			.attr("y1", 0)
			.attr("x2", x(d.month))
			.attr("y2", height*mult)
			.attr("class", "line")
			.style("stroke", "#006da0")
			.style("stroke-width", "2px");

		streamSVG.append("line")
			.attr("x1", x(d.month))
			.attr("y1", 0)
			.attr("x2", x(d.month))
			.attr("y2", height)
			.attr("class", "line")
			.style("stroke", "#006da0")
			.style("stroke-width", "2px");

		streamSVG.append("text")
			.attr("class", "collection")
			//	.attr("transform", "rotate(90)")
			.attr("x", x(d.month))
			.attr("y", 0)
			.style("text-anchor", "end")
			.attr("dx", "0.3em")
			.attr("dy", (height)+22)
			.attr('font-family', 'FontAwesome')
			.attr('font-size', function(d) { return '1.8em'} )
			.style('fill', '#B20000')
			.text(function(d) { return '\uf043' }); 

		streamSVG.append("text")
			.attr("class", "collection")
			//.attr("x", x(d.month))
			//.attr("y", height)
			.style("text-anchor", "end")
			.attr("dx", "-2em")
			.attr("dy", "2.2em")
			.attr("font-weight", "bold")
			.attr("transform", "translate("+x(d.month)+","+height+") rotate(-45)")
			.style("font-size", "11px")
			.text(d.month.toLocaleDateString("en-us",dateOptions));

		dLast = x(d.month);
	});


	treatment.forEach(function(d) {
		var start = x(parseDate(d.start));
		var end = x(parseDate(d.end));
		if (start < 0) { start = 0; }
		var treatRect = treatmentSVG.append("g");
		treatRect.append("rect")
			.attr("x", start)
			.attr("width", end - start)
			.attr("height", "2em")
			.style("fill", "url(#g3)")
			.style("fill-opacity","1")
			.on("mouseover", function () {
                        //d3.select(this).style("fill-opacity","1");
				$(this).popover({
					placement: 'auto top',
					container: 'body',
					mouseOffset: 10,
					followMouse: true,
					trigger: 'hover',
					html: true,
					content: function () {
						return "<p style='font-size: 14px; text-align: center;'><span style='font-weight:900'>" + d.Treatment + "</span><span style='font-weight:400'>" + '<br>'+(parseDate(d.start).toLocaleDateString("en-us",dateOptions))+'-'+(parseDate(d.end).toLocaleDateString("en-us",dateOptions))+'</span>';
					}
				});
				$(this).popover('show');
			})

		treatRect.append("text")
			.attr("x", (start+((end-start)/2)))
			.attr("y", "1.2em")
			.attr("class", "treatment")
			.style("text-anchor", "middle")
			//.attr("font-weight", "regular")
			.attr("fill","#fff")
			.style("font-size", "1em")
			.attr('font-family', 'FontAwesome')
                        .style("font-size", "1.2em")
                        .text('\uf0fa');

	});
	treatmentSVG.append("text")
		.attr("x", "-10px")
		.attr("y", "1.5em")
		.attr("class", "treatment")
		.style("text-anchor", "end")
		//.attr("font-weight", "regular")
		.attr("fill","#000")
		.style("font-size", "12px")
		.text('Treatment');

	// imaging - camera icon
	imaging.forEach(function(d) {
                streamSVG.append("text")
                        .attr("class", "imaging")
                        .attr("x", x(parseDate(d.date)))
                        .attr("y", "-2px")
                        .style("text-anchor", "end")
                        .attr("dx", "9px")
                        .attr("dy", 0)
                        .attr('font-family', 'FontAwesome')
                        .attr('font-size', "18px" )
                        .style('fill', '#000')
                        .text(function(d) { return '\uf030' })
			.on("mouseover", function () {
                                $(this).popover({
                                        placement: 'auto top',
                                        container: 'body',
                                        mouseOffset: 10,
                                        followMouse: true,
                                        trigger: 'hover',
                                        html: true,
                                        content: function () {
                                                return "<p style='font-size: 14px; text-align: center;'><span style='font-weight:900'>" + d.comment + "</span><span style='font-weight:400'>" + '<br>'+(parseDate(d.date).toLocaleDateString("en-us",dateOptions))+'</span>';
                                        }
                                });
                                $(this).popover('show');
                        });
	});

	// line graph
	svg2.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + (height*mult) + ")")
	    .call(xAxis.ticks(0));

	svg2.append("g")
	    .attr("class", "y axis")
	    .call(y2Axis)
            .style("font-size", "10px")
            .append("text")
            .attr("y", 10)
            .attr("dx", height)
            .attr("dy", height/2)
            .style("text-anchor", "end")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("transform", "rotate(-90)")
            .text("Relative Mutations");

	var mutations = svg2.selectAll(".mutations")
                .data(lineGraphData)
                .enter().append("g")
                .attr("class","mutationLine");

        mutations.append("path")
                .attr("class", "line")
		.style("stroke", function(d) { return color(muts.indexOf(d.id)); })
                .style("fill", "none")
		.attr("mutation" , function(d) { return d.id; })
		.style("stroke-width", "3px")
                .attr("d", function(d) { return mutLine(d.values); });

        mutations.selectAll("circle")
		.data(function(d){ return d.values; })
                .enter()
                .append("circle")
                .attr("r", 6)
                .attr("cx", function(d){ return x(d.date); })
                .attr("cy", function(d){ return y2(d.af); })
		.attr("class", function(d) { return d.mut.replace(" ","_"); })
		.attr("mutation" , function(d) { return d.mut; })
                .attr("fill", function(d) { return color(muts.indexOf(d.mut)); })
                .attr("stroke", "#fff")
		.style("fill-opacity","1")
                .on("mouseover", function (d) {
			//d3.select(this).style("fill-opacity","1");
			$(this).popover({
				placement: 'auto top',
				container: 'body',
				mouseOffset: 10,
				followMouse: true,
				trigger: 'hover',
				html: true,
				content: function () {
					return "<p style='font-size: 14px; text-align: center;'><span style='font-weight:900'>" + d.mut + "</span><span style='font-weight:400'>" + '<br>AF: <span id="af">'+(d.af*100).toFixed(1)+'</span>%';
				}
			});
			$(this).popover('show');
		})
		.on("mouseout", function(d) {
			//d3.select(this).style("fill-opacity","0.6");
		});

	var legend = svg2.selectAll(".legend")
            .data(lineGraphData)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 17 + ")";
            });

	legend.append("rect")
	    .attr("x", width+10 )
	    .attr("width", 15)
	    .attr("height", 15)
		.attr("fill", function(d) { return color(muts.indexOf(d.id)); })
	    .attr("opacity", 1)
	    .attr("stroke-opacity", 1)
	    .attr("active", 1)
	    .attr("class", "rect")
	    .style("cursor", "pointer")
	 	.on("mouseover", function (id) {
			svg2.selectAll('circle').filter(function (mutation) { return mutation.mut != id.id; }).attr("opacity", 0.1);
			svg2.selectAll('.mutationLine').filter(function (m) { return m.id != id.id; }).attr("opacity", 0.1);
			streamSVG.selectAll('.mutationLine').filter(function (m) { return m.key != id.id; }).attr("opacity", 0.1);
		    })
		    .on("mouseout", function (id) {
			svg2.selectAll('circle').filter(function (mutation) { return mutation.mut != id.id; }).attr("opacity", 1);
                        svg2.selectAll('.mutationLine').filter(function (m) { return m.id != id.id; }).attr("opacity", 1);
			streamSVG.selectAll('.mutationLine').filter(function (m) { return m.key != id.id; }).attr("opacity", 1);
		    });

        legend.append("text")
            .attr("x", width +27)
            .attr("y", 11)
            .attr("dy", "0em")
		.style("font-size", "11px")
            .style("text-anchor", "start")
            .style("cursor", "pointer")
            .text(function (d) {
                return d.id;
            })
		.on("mouseover", function (id) {
                        svg2.selectAll('circle').filter(function (mutation) { return mutation.mut != id.id; }).attr("opacity", 0.1);
                        svg2.selectAll('.mutationLine').filter(function (m) { return m.id != id.id; }).attr("opacity", 0.1);
			streamSVG.selectAll('.mutationLine').filter(function (m) { return m.key != id.id; }).attr("opacity", 0.1);
                    })
                    .on("mouseout", function (id) {
                        svg2.selectAll('circle').filter(function (mutation) { return mutation.mut != id.id; }).attr("opacity", 1);
                        svg2.selectAll('.mutationLine').filter(function (m) { return m.id != id.id; }).attr("opacity", 1);
			streamSVG.selectAll('.mutationLine').filter(function (m) { return m.key != id.id; }).attr("opacity", 1);
                    });



var area = d3.area()
	.x(function(d) {
		return x(d.data.month);
	})
	.y0(function(d) { return y(d[0]); })
	.y1(function(d) { return y(d[1]); })
	//.curve(d3.curveBasis);
	.curve(d3.curveMonotoneX);

var area3 = d3.area()
        .x(function(d) { return x(d.data.month); })
        .y0(function(d) { return y3(d[0]); })
        .y1(function(d) { return y3(d[1]); })
        //.curve(d3.curveBasis);
	.curve(d3.curveMonotoneX);
/*
svg.selectAll(".layer")
	.data(series)
	.enter().append("path")
	.attr("class", "layer")
	.attr("d", area)
	.style("fill-opacity", "0.7")
	.style("stroke", function(d) {
		return '#fff';
		//return color(d.index);
	})
	.style("stroke-width", "0.0")
	.style("fill", function(d) {
		//return "url(#g"+d.index+")";
		return color(d.index);
	})
	.style("cursor", "pointer")
	.on("mouseover", function (d) {
                d3.select(this).style("fill-opacity","0.9");
		var x0 = x.invert(d3.mouse(this)[0]);
		$(this).popover({
                placement: 'auto top',
                container: 'body',
                mouseOffset: 10,
                followMouse: true,
                trigger: 'hover',
                html: true,
                content: function () {
			//var x0 = x.invert(d3.mouse(this)[0]),
			var i = bisectDate(data,x0,1),
			d0 = data[i-1],
			d1 = data[i],
			dt = x0-d0.month > d1.month - x0 ? d1 : d0;
			return "<p style='font-size: 14px; text-align: center;'><span style='font-weight:900'>" + d.key + "</span><span style='font-weight:400'>" +
                        '<br>AF: <span id="af">'+dt[d.key]+'</span>%';
                }
            });
            $(this).popover('show');
	})
	.on("mousemove", function(d) {
		var x0 = x.invert(d3.mouse(this)[0]),
		i = bisectDate(data,x0,1),
		d0 = data[i-1],
		d1 = data[i],
		dt = x0-d0.month > d1.month - x0 ? d1 : d0;

		//var i = bisectDate(data,x.invert(mousex),1);
		$("#af").html(dt[d.key]);
	})
	.on("mouseout", function(d) {
		d3.select(this).style("fill-opacity","0.7").style("stroke-width", "0");
		dataWindow.style("visibility", "hidden");
	});


	svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis.ticks(0,""));

	svg.append("g")
            .attr("class", "y axis")
            .call(yAxis.ticks(2, "%"))
            .style("font-size", "10px")
            .append("text")
            .attr("y", 10)
            .attr("dx", "0.2em")
            .attr("dy", "-1.5em")
            .style("text-anchor", "start")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
	    //.attr("transform", "rotate(90)")
            .text("Relative Mutations");
*/

/*
	streamSVG.append("g")
            .attr("class", "y axis")
            .call(y3Axis)
            .style("font-size", "10px")
            .append("text")
            .attr("y", 10)
            .attr("dx", "-10em" )
            .attr("dy", "-4.5em")
            .style("text-anchor", "start")
            .attr("fill", "#000")
*/

	streamSVG.selectAll(".layer")
		.data(stream)
		.enter().append("path")
		.attr("class", "layer")
		.attr("class","mutationLine")
		.attr("d", area3)
		.style("fill-opacity", "0.9")
		//.style("fill", function(d) { return color(d.index); })
		.attr("fill", function(d) { return color(muts.indexOf(d.key)); })
		.on("mouseover", function (d) {
                        //d3.select(this).style("fill-opacity","1");
			var x0 = x.invert(d3.mouse(this)[0]);
                        $(this).popover({
                                placement: 'auto top',
                                container: 'body',
                                mouseOffset: 10,
                                followMouse: true,
                                trigger: 'hover',
                                html: true,
                                content: function () {
					var i = bisectDate(data,x0,1),
					d0 = data[i-1],
					d1 = data[i],
					dt = x0-d0.month > d1.month - x0 ? d1 : d0;
                                        return "<p style='font-size: 14px; text-align: center;'><span style='font-weight:900'>" + d.key + "</span><span style='font-weight:400'>" + '<br>AF: <span id="af">'+dt[d.key]+'</span>%';
                                }
                        });
                        $(this).popover('show');
                })
		.on("mousemove", function(d) {
			var x0 = x.invert(d3.mouse(this)[0]),
			i = bisectDate(data,x0,1),
			d0 = data[i-1],
			d1 = data[i],
			dt = x0-d0.month > d1.month - x0 ? d1 : d0;

			//var i = bisectDate(data,x.invert(mousex),1);
			$("#af").html(dt[d.key]);
		})
		.on("mouseout", function(d) {
                        //d3.select(this).style("fill-opacity","0.6");
                });

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


var dataWindow = d3.select("#longGraph")
	.append("div")
	.attr("class", "remove")
	.style("position", "absolute")
	.style("z-index", "20")
	.style("visibility", "hidden")
	.style("top", "180px")
	.style("left", "120px")
	.style("font-size", "13px");
