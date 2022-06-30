////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////
var screenWidth = $(window).width(), mobileScreen = (screenWidth > 400 ? false : true);

var margin = {left: 50, top: 0, right: 90, bottom: 10},
	width = Math.min(screenWidth, 900) - margin.left - margin.right,
	height = (mobileScreen ? 600 : Math.min(screenWidth, 1000)*5/6) - margin.top - margin.bottom;
			
var svg = d3.select("#chart").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom));
			
var wrapper = svg.append("g").attr("class", "chordWrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");;
			
var outerRadius = Math.min(width, height) / 2  - (mobileScreen ? 80 : 100),
	innerRadius = outerRadius * 0.95,
	pullOutSize = (mobileScreen? 20 : 90),
	opacityLow = 0.05; //hover opacity of those chords not hovered over
	
////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////
var respondents = 3137, //Total number of respondents (i.e. the number that makes up the total group)
        emptyPerc = 0.2, //What % of the circle should become empty
        emptyStroke = Math.round(respondents*emptyPerc); 

var Names = ["TRBV2","TRBV3-1","TRBV4-1","TRBV4-2","TRBV4-3","TRBV5-1","TRBV5-4","TRBV5-5","TRBV5-6","TRBV5-8","TRBV6-1","TRBV6-2","TRBV6-4","TRBV6-5","TRBV6-6","TRBV6-8","TRBV6-9","TRBV7-2","TRBV7-3","TRBV7-4","TRBV7-6","TRBV7-7","TRBV7-8","TRBV7-9","TRBV9","TRBV10-1","TRBV10-2","TRBV10-3","TRBV11-1","TRBV11-2","TRBV11-3","TRBV12-3","TRBV12-5","TRBV13","TRBV14","TRBV16","TRBV18","TRBV19","TRBV20-1","TRBV24-1","TRBV25-1","TRBV27","TRBV28","TRBV29-1","TRBV29-OR9-2","TRBV30","","TRBJ1-1","TRBJ1-2","TRBJ1-3","TRBJ1-4","TRBJ1-5","TRBJ1-6","TRBJ2-1","TRBJ2-2","TRBJ2-3","TRBJ2-4","TRBJ2-5","TRBJ2-6","TRBJ2-7",""],
colors = ["#FF4800", "#FF4A00", "#FF4D00", "#FF5000", "#FF5300", "#FF5600", "#FF5900", "#FF5C00", "#FF5E00", "#FF6100", "#FF6400", "#FF6700", "#FF6A00", "#FF6D00", "#FF7000", "#FF7200", "#FF7500", "#FF7800", "#FF7B00", "#FF7E00", "#FF8100", "#FF8400", "#FF8600", "#FF8900", "#FF8C00", "#FF8F00", "#FF9200", "#FF9500", "#FF9800", "#FF9B00", "#FF9D00", "#FFA000", "#FFA300", "#FFA600", "#FFA900", "#FFAC00", "#FFAF00", "#FFB100", "#FFB400", "#FFB700", "#FFBA00", "#FFBD00", "#FFC000", "#FFC300", "#FFC500", "#FFC800","#000", "#47fff8", "#40f0fc", "#3adcfa", "#33c6f8", "#2daff6", "#2798f4", "#2180f2", "#1b68ef", "#164fed", "#1035eb", "#0a1be9", "#0a05e7", "#1b00e5","#000"],
        opacityDefault = 0.9;

var matrix = [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,5,1,5,10,2,29,11,15,1,7,2,8,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,8,2,3,1,7,42,11,5,4,10,1,16,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,4,3,5,2,5,13,7,4,0,12,0,9,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,0,4,13,0,7,5,11,0,1,0,11,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,2,10,5,5,0,0,2,8,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,8,2,4,1,1,36,21,7,0,12,3,27,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,6,0,2,0,3,19,3,3,1,5,0,9,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,3,2,2,3,1,1,0,1,2,1,4,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,1,3,0,7,2,1,0,1,1,12,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,0,0,0,0,8,0,4,0,1,0,3,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,12,6,1,4,1,24,4,17,4,8,2,17,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,5,1,0,1,3,22,11,6,4,0,2,27,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,6,0,5,3,0,12,25,6,0,2,0,7,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,9,0,6,3,7,14,7,10,1,5,2,13,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,1,4,3,4,4,4,0,2,3,9,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,9,4,4,3,1,22,5,15,3,8,1,19,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,1,33,4,1,38,0,3,7,5,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,7,0,17,3,2,0,3,0,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,4,2,1,0,2,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,3,0,1,2,1,16,7,1,1,10,1,8,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,11,1,3,4,11,30,22,17,0,22,0,31,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,5,5,1,1,25,8,15,1,5,1,9,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,2,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,3,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,1,1,1,0,8,4,1,0,1,0,11,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,0,0,0,4,0,7,0,3,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,2,2,0,2,1,23,5,13,0,3,0,6,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,2,0,1,0,0,0,5,6,0,0,1,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,8,4,4,10,2,21,2,6,2,10,1,10,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,2,0,3,0,3,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,3,0,3,0,2,1,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,51,0,0,0,1,5,2,3,1,0,0,12,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,4,4,6,6,12,9,10,9,0,11,2,10,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,13,3,6,14,5,20,15,12,0,10,2,28,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34,31,4,6,21,4,56,11,40,2,28,1,63,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,2,2,0,11,5,4,1,5,2,5,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,1,1,0,1,14,0,2,0,1,2,4,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,9,2,6,8,3,64,5,8,0,8,1,19,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,21,5,6,13,10,86,6,16,4,7,4,56,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,16,6,1,2,0,47,3,7,6,5,1,19,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,8,0,1,6,2,4,2,4,2,1,0,4,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke],
[14,7,7,6,0,24,2,3,4,1,7,6,5,13,3,0,0,12,5,0,1,1,6,8,6,0,0,6,3,7,7,20,1,1,2,0,16,16,34,3,1,13,12,12,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[5,8,4,2,2,8,6,2,0,2,12,5,6,9,0,0,0,9,0,1,0,0,3,11,0,0,0,1,1,2,2,8,0,1,51,0,4,13,31,1,3,9,21,16,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[1,2,3,0,0,2,0,3,0,0,6,1,0,0,0,0,0,4,0,0,0,0,0,1,5,1,0,1,1,2,0,4,0,0,0,0,4,3,4,0,1,2,5,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[5,3,5,4,1,4,2,2,1,0,1,0,5,6,1,0,0,4,0,1,1,0,1,3,5,1,0,1,0,0,1,4,0,0,0,0,6,6,6,2,1,6,6,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[10,1,2,13,1,1,0,2,3,0,4,1,3,3,4,2,0,3,1,0,7,0,2,4,1,0,0,1,0,2,0,10,0,0,0,0,6,14,21,2,0,8,13,2,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[2,7,5,0,2,1,3,3,0,0,1,3,0,7,3,0,0,1,33,0,0,0,1,11,1,0,0,0,0,1,0,2,0,0,1,0,12,5,4,0,1,3,10,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[29,42,13,7,10,36,19,1,7,8,24,22,12,14,4,0,0,22,4,0,17,4,16,30,25,0,0,8,4,23,0,21,2,3,5,2,9,20,56,11,14,64,86,47,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[11,11,7,5,5,21,3,1,2,0,4,11,25,7,4,0,0,5,1,0,3,2,7,22,8,0,0,4,0,5,5,2,0,0,2,0,10,15,11,5,0,5,6,3,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[15,5,4,11,5,7,3,0,1,4,17,6,6,10,4,0,0,15,38,0,2,1,1,17,15,2,0,1,7,13,6,6,3,3,3,0,9,12,40,4,2,8,16,7,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[1,4,0,0,0,0,1,1,0,0,4,4,0,1,0,0,0,3,0,0,0,0,1,0,1,0,0,0,0,0,0,2,0,0,1,0,0,0,2,1,0,0,4,6,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[7,10,12,1,0,12,5,2,1,1,8,0,2,5,2,0,0,8,3,0,3,2,10,22,5,0,3,1,3,3,0,10,3,2,0,1,11,10,28,5,1,8,7,5,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[2,1,0,0,2,3,0,1,1,0,2,2,0,2,3,0,0,1,7,0,0,0,1,0,1,0,0,0,0,0,1,1,0,1,0,0,2,2,1,2,2,1,4,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[8,16,9,11,8,27,9,4,12,3,17,27,7,13,9,1,0,19,5,0,1,0,8,31,9,0,3,11,0,6,1,10,0,1,12,0,10,28,63,5,4,19,56,19,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var colors = d3.scale.ordinal().domain(d3.range(Names.length)).range(colors);

//Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
//invisible chord center vertically
var offset = (2 * Math.PI) * (emptyStroke/(respondents + emptyStroke))/40;

//Custom sort function of the chords to keep them in the original order
function customSort(a,b) {
	return 1;
};

//Custom sort function of the chords to keep them in the original order
var chord = customChordLayout() //d3.layout.chord()//Custom sort function of the chords to keep them in the original order
	.padding(.02)
	.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
	.matrix(matrix);
	
var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)
	.startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
	.endAngle(endAngle);

var path = stretchedChord()
	.radius(innerRadius)
	.startAngle(startAngle)
	.endAngle(endAngle);

////////////////////////////////////////////////////////////
/////////////// Create the gradient fills //////////////////
////////////////////////////////////////////////////////////

//Function to create the id for each chord gradient
function getGradID(d){ return "linkGrad-" + d.source.index + "-" + d.target.index; }

//Create the gradients definitions for each chord
var grads = svg.append("defs").selectAll("linearGradient")
        .data(chord.chords())
        .enter().append("linearGradient")
        .attr("id", getGradID)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", function(d,i) { return innerRadius * Math.cos((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2); })
        .attr("y1", function(d,i) { return innerRadius * Math.sin((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2); })
        .attr("x2", function(d,i) { return innerRadius * Math.cos((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2); })
        .attr("y2", function(d,i) { return innerRadius * Math.sin((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2); })


//Set the starting color (at 0%)
grads.append("stop").attr("offset", "0%").attr("stop-color", function(d){ return colors(d.source.index); });

//Set the ending color (at 100%)
grads.append("stop").attr("offset", "100%").attr("stop-color", function(d){ return colors(d.target.index); });

////////////////////////////////////////////////////////////
//////////////////// Draw outer Arcs ///////////////////////
////////////////////////////////////////////////////////////

var g = wrapper.selectAll("g.group")
	.data(chord.groups)
	.enter().append("g")
	.attr("class", "group")
	.on("mouseover", fade(opacityLow))
	.on("mouseout", fade(opacityDefault));

g.append("path")
	.style("stroke", function(d,i) { return (Names[i] === "" ? "none" : colors(d.index) ); })
	.style("fill", function(d,i) { return (Names[i] === "" ? "none" : colors(d.index) ) })
	.style("pointer-events", function(d,i) { return (Names[i] === "" ? "none" : "auto"); })
	.attr("d", arc)
	.attr("transform", function(d, i) { //Pull the two slices apart
		d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > Math.PI ? -1 : 1);
		return "translate(" + d.pullOutSize + ',' + 0 + ")";
	});


////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////

//The text also needs to be displaced in the horizontal directions
//And also rotated with the offset in the clockwise direction
g.append("text")
	.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset;})
	.attr("dy", ".35em")
	.attr("class", "titles")
	.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	.attr("transform", function(d,i) { 
		var c = arc.centroid(d);
		return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
		+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + 20 + ",0)"
		+ (d.angle > Math.PI ? "rotate(180)" : "")
	})
  .text(function(d,i) { return Names[i]; })
  .call(wrapChord, 100);

////////////////////////////////////////////////////////////
//////////////////// Draw inner chords /////////////////////
////////////////////////////////////////////////////////////
 
var chords = wrapper.selectAll("path.chord")
	.data(chord.chords)
	.enter().append("path")
	.attr("class", "chord")
	.style("stroke", "none")
	.style("fill", function(d){ return "url(#" + getGradID(d) + ")"; })
	.style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacityDefault); }) //Make the dummy strokes have a zero opacity (invisible)
	.style("pointer-events", function(d,i) { return (Names[d.source.index] === "" ? "none" : "auto"); }) //Remove pointer events from dummy strokes
	.attr("d", path)
	.on("mouseover", fadeOnChord)
	.on("mouseout", fade(opacityDefault));	


//Include the offset in de start and end angle to rotate the Chord diagram clockwise
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }

// Returns an event handler for fading a given chord group
function fade(opacity) {
  return function(d, i) {
	wrapper.selectAll("path.chord")
		.filter(function(d) { return d.source.index != i && d.target.index != i && Names[d.source.index] != ""; })
		//.transition()
		.style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacity); });
  };
}//fade

// Fade function when hovering over chord
function fadeOnChord(d) {
	var chosen = d;
	wrapper.selectAll("path.chord")
		//.transition()
		.style("opacity", function(d) {
			if (d.source.index == chosen.source.index && d.target.index == chosen.target.index) {
				return opacityDefault;
			} else { 
				return (Names[d.source.index] === "" ? 0 : opacityLow);
			}
		});

	//Define and show the tooltip over the mouse location
        $(this).popover({
                placement: 'auto top',
                container: 'body',
                mouseOffset: 10,
                followMouse: true,
                trigger: 'hover',
                html : true,
                content: function() { return Names[d.target.index] +' and '+ Names[d.source.index]; } 
        });
        $(this).popover('show');
}//fadeOnChord

//Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text
function wrapChord(text, width) {
  text.each(function() {
	var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.1, // ems
		y = 0,
		x = 0,
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}
  });
}//wrapChord

