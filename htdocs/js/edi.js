var aspect = 600 / 600;

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = $("#compMut").width() - margin.left - margin.right,
        height = $("#compMut").width() - margin.top - margin.bottom;

var svg = d3.select("#compMut").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

	$("#dataWindow").css("top",height-(height*0.9)).css("left",0);
		
var defs = svg.append("defs");
	//Create a radial Sun-like gradient
	defs.append("radialGradient")
		.attr("id", "bigCircleGradient")
		.attr("cx", "50%")      //not really needed, since 50% is the default
		.attr("cy", "50%")      //not really needed, since 50% is the default
		.attr("r", "50%")       //not really needed, since 50% is the default
		.selectAll("stop")
		.data([
			{offset: "0%", color: "#000"},
			{offset: "80%", color: "#003156"},
			{offset: "95%", color: "#226ca5"},
			{offset: "100%", color: "#569ed6"}
		])
		.enter().append("stop")
		.attr("offset", function(d) { return d.offset; })
		.attr("stop-color", function(d) { return d.color; });

	defs.append("radialGradient")
		.attr("id", "SNVGradient")
		.attr("cx", "50%")      //not really needed, since 50% is the default
		.attr("cy", "50%")      //not really needed, since 50% is the default
		.attr("r", "100%")       //not really needed, since 50% is the default
		.selectAll("stop")
		.data([ 
			{offset: "0%", color: "#fff"},
			{offset: "25%", color: "#c7d9e6"},
			{offset: "75%", color: "#77c4e8"},
			{offset: "100%", color: "#5babd0"}
		])
		.enter().append("stop")
		.attr("offset", function(d) { return d.offset; })
		.attr("stop-color", function(d) { return d.color; });

	defs.append("radialGradient")
                .attr("id", "CNVGradient")
                .attr("cx", "50%")      //not really needed, since 50% is the default
                .attr("cy", "50%")      //not really needed, since 50% is the default
                .attr("r", "100%")       //not really needed, since 50% is the default
                .selectAll("stop")
                .data([
                        {offset: "0%", color: "#fff"},
                        {offset: "25%", color: "#560496"},
                        {offset: "75%", color: "#8c53b7"},
                        {offset: "100%", color: "#c99eea"}
                ])
                .enter().append("stop")
                .attr("offset", function(d) { return d.offset; })
                .attr("stop-color", function(d) { return d.color; });

	defs.append("radialGradient")
                .attr("id", "FusionGradient")
                .attr("cx", "50%")      //not really needed, since 50% is the default
                .attr("cy", "50%")      //not really needed, since 50% is the default
                .attr("r", "100%")       //not really needed, since 50% is the default
                .selectAll("stop")
                .data([
                        {offset: "0%", color: "#ff0000"},
                        {offset: "45%", color: "#ffcbc6"},
                        {offset: "80%", color: "#ff0000"},
                        {offset: "100%", color: "#ff0000"}
                ])
                .enter().append("stop")
                .attr("offset", function(d) { return d.offset; })
                .attr("stop-color", function(d) { return d.color; });

        defs.append("radialGradient")
                .attr("id", "IndelGradient")
                .attr("cx", "50%")      //not really needed, since 50% is the default
                .attr("cy", "50%")      //not really needed, since 50% is the default
                .attr("r", "100%")       //not really needed, since 50% is the default
                .selectAll("stop") 
                .data([
                        {offset: "0%", color: "#fff"},
                        {offset: "45%", color: "#197d1c"},
                        {offset: "80%", color: "#23bc26"},
                        {offset: "100%", color: "#c99eea"}
                ])
                .enter().append("stop")
                .attr("offset", function(d) { return d.offset; })
                .attr("stop-color", function(d) { return d.color; });

	svg.append("circle")
		.attr("r",(2/3)*380)
		.attr("fill","url(#bigCircleGradient)")
		.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

	g = svg.append("g").attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");


var stratify = d3.stratify().parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });
//var cluster = d3.cluster().size([360, width / 2 - 120]);
var cluster = d3.cluster().size([360, 380]);

d3.csv("/js/flare.csv", function(error, data) {
	if (error) throw error;

	var root = stratify(data).sort(function(a, b) { return a.height - b.height || a.id.localeCompare(b.id); });
	cluster(root);

	var link = g.selectAll(".link")
		.data(root.descendants().slice(1))
		.enter().append("path")
		.attr("class", function(d) {
			if(d.depth == 2) {
				var ID = d.children[0].data.id.substring(d.children[0].data.id.lastIndexOf(".") + 1).split(":");
				if(ID.length > 1) { return ID[0]+" link depth"+d.depth +" "+d.id.replace(/\.|\*| /g,""); } else { return "link depth"+d.depth+" "+d.id.replace(/\.|\*| /g,""); }
			} else {
				return "depth"+d.depth+" link ";
			}
		})
		.attr("style",function(d) {
                        if(d.depth > 2) { return "display: none;"; }
                })
		.attr("stroke", function(d) { if(d.depth == 2) { var ID = d.children[0].data.id.substring(d.children[0].data.id.lastIndexOf(".") + 1).split(":"); return "url(#"+ID[0]+"Gradient)"; } })
		.attr("d", function(d) {
			return "M" + project(d.x, d.y)
			+ "C" + project(d.x, (d.y + d.parent.y) / 2)
			+ " " + project(d.parent.x, (d.y + d.parent.y) / 2)
			+ " " + project(d.parent.x, d.parent.y);
		})
		.on("mouseover", function (d) {
			if(d.depth > 1) {
				g.selectAll("."+d.id.replace(/\.|\*| /g,"")).classed("active",true);
				$("."+d.id.replace(/\.|\*| /g,"")).mouseover();
				getP(d);
			}
		})
		.on("mouseout", function (d) {
			g.selectAll("."+d.id.replace(/\.|\*| /g,"")).classed("active",false);
			$("."+d.id.replace(/\.|\*| /g,"")).mouseout();
			$("#dataWindow").css("display","none");
		});

	var node = g.selectAll(".node")
		.data(root.descendants())
		.enter().append("g")
		.attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
		.attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });

	node.append("circle")
		//.attr("r", 2.5);
		.attr("class", function(d) {
			if(d.depth == 2) {
				var ID = d.children[0].data.id.substring(d.children[0].data.id.lastIndexOf(".") + 1).split(":");
				if(ID.length > 1) { return ID[0]+" depth"+d.depth+" "+d.id.replace(/\.|\*| /g,""); } else { return "depth"+d.depth+" "+d.id.replace(/\.|\*| /g,""); }
			} else {
				return "depth"+d.depth;
			}
		})
		.attr("r",function(d) {
			if(d.depth == 0) { return 0; }
			if(d.children) {
				var t = d.id.substring(d.id.lastIndexOf(".") + 1);
				if(d.children.length == 1) {
					return 3;
				}
				if(t == 'TP53') {
					return d.children.length*0.5;
				} else {
					return d.children.length * 1.8;
				}
			} else {
				return 0;
			}
		})
		.style("cursor", "pointer")
		.on("mouseover", function (d) {
			if(d.depth == 2) {
				if(d.depth == 2) {
					getP(d);
				}
			}
			g.selectAll("."+d.id.replace(/\.|\*| /g,"")).classed("active",true); 
		})
		.on("mouseout", function (d) {
			g.selectAll("."+d.id.replace(/\.|\*| /g,"")).classed("active",false);
			$("#dataWindow").css("display","none");
		});

	node.append("text")
		.attr("dy", "0.31em")
		//.attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
		.attr("class", function(d) {
				return "depth"+d.depth+" "+d.id.replace(/\.|\*| /g,"");
		})
		.attr("x",function(d) {
			if(d.depth == 1) {
				return d.x < 180 ? 200 : -200;
			} else {
				return d.x < 180 ? 11 : -11;
			}
		})
		.attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
		.attr("style",function(d) {
			if(d.depth > 2) {
				return "display: none;";
			} else {
				return d.x < 180 ? "display: block; text-anchor:start" : "display: block; text-anchor:end";
				//return "display: block; text-anchor: end;";
			}
		})
		.text(function(d) {
			var t = d.id.substring(d.id.lastIndexOf(".") + 1).split(":");
			if(t.length > 1) {
				return t[2]; // name
			} else {
				return t[0].replace(".","*").replace("_",".");
			}
		})
		.style("cursor", "pointer")
                .on("mouseover", function (d) {
			g.selectAll("."+d.id.replace(/\.|\*| /g,"")).classed("active",true);
			$("."+d.id.replace(/\.|\*| /g,"")).mouseover();
			if(d.depth == 2) { 
                                if(d.depth == 2) {
					getP(d);
                                }
                        }
                })
                .on("mouseout", function (d) {
			g.selectAll("."+d.id.replace(/\.|\*| /g,"")).classed("active",false);
			$("."+d.id.replace(/\.|\*| /g,"")).mouseover();
			$("#dataWindow").css("display","none");
                });

	svg.append("circle")
                .attr("r",30)
                .attr("fill","#fff")
                .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");
});

function project(x, y) {
  var angle = (x - 90) / 180 * Math.PI, radius = y;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}


function getP(d) {
	var ID = d.children[0].data.id.substring(d.children[0].data.id.lastIndexOf(".") + 1).split(":");
	var m = d.id.split(".");
	var t = d3.nest()
		.key(function(d) {
			tmp = d.id.split(":");
			return tmp[2];
		})
		.key(function(d) {
			tmp = d.id.split(":");
			return tmp[1];
		})
		.entries(d.children);

	var html = '<ul>';
	for(i=0;i<t.length;i++) {
		html = html+"<li>"+t[i].key+"</li>";
		for(x=0;x<t[i].values.length;x++) {
			html = html+"<ul><li>"+t[i].values[x].values.length+" "+t[i].values[x].key+"</li></ul>";
		}
	$("#dataWindow").html( "<h4>"+m[1]+" "+m[2].replace(".","*").replace("_",".")+"</h4>"+html ).css("display","block");}
	
}
