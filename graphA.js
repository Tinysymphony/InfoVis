var svg = d3.select("body")
	.append("svg")
	.append("g")
	.attr("id","container");


svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

var width = 1400,
    height = 550,
	radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width*0.28 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };

//data segment starts
var color = d3.scale.ordinal()
	.domain(["Ameriaca", "India", "Japan", "Australia", "Canada", "England", "Russia", "Germany", "Iran", "Mexico","France","Indonesia","South Africa","Italy","China"])
	.range(["#14ccda", "#f1c64f", "#ed69ab", "#e5693f", "#d0743c", "#ff8c00","#e0e046","#89e07e","#44d88e","#5899af","#af5874","#ed8080","#faf249","#bdf35c","#e94538"]);

var carbonData = new Array();
carbonData[0] = [4879.4,690.6,1094.6,570.2,450.1,570.2,2339.0,980.6,211.1,314.3,399.0,149.6,333.5,425.3,2460.7];
carbonData[1] = [5713.4,1186.7,1219.6,329.6,534.5,543.7,1558.1,832.1,372.7,381.5,365.6,263.4,368.6,448.1,3405.2];
carbonData[2] = [5713.4,1979.4,1101.1,400.2,513.9,474.6,1574.4,734.6,602.1,446.2,363.4,451.8,499.0,400.8,7687.1];

var totalCO=[22274.2,24810.9,32042.3];

var dataColor=["#14ccda", "#f1c64f", "#ed69ab", "#e5693f", "#d0743c", "#ff8c00","#e0e046","#89e07e","#44d88e","#5899af","#af5874","#ed8080","#faf249","#bdf35c","#e94538"];

var countryName=["US","IN","JP","AU","CA","GB","RU","DE","IR","MX","FR","ID","ZA","IT","CN"];

var perCapita= new Array();
perCapita[0]=[19.6,0.8,8.9,16.8,16.2,10.0,15.8,12.4,3.8,3.7,6.8,0.8,9.5,7.5,2.2];
perCapita[1]=[20.2,1.1,9.6,17.2,17.4,9.2,10.6,10.1,5.7,3.8,6.0,1.2,8.4,7.9,2.7];
perCapita[2]=[17.3,1.6,8.6,18.2,15.2,7.7,11.1,9.0,8.2,4.0,5.6,1.9,10.1,6.7,5.8];
//data segment ends


//initial segment starts
var count=-1;
var totalSize=0;
var year=1980;

d3.select("#wytiny").style("visibility","");
d3.select("#changeYear").style("visibility","");
d3.select("#cYear").text(1990);
d3.select("#titleA").text("Emissions of CO2 By 15 Main Countries In The World");
d3.select("#titleB").text("WyTiny 3120101996 -- zjutiny@gmail.com");
d3.select("#infoA").text("Total Emissions of Carbon Dioxide (million metric tons)");
d3.select("#infoB").text("Emissions of Carbon Dioxide per Capita (ton)");

var graphics = svg.append("g")
		.attr("transform","translate(380,-200)");
var graphicsA = svg.append("g")
		.attr("transform","translate(380,-200)");
var graphicsB = svg.append("g")
		.attr("transform","translate(380,-200)");

drawHistogram(count);



change(nextTenYear());

d3.select("#changeYear")
	.on("click", function(){
		change(nextTenYear());
		drawHistogram(count);
	});

//main ends	



//functions' definiton

function nextTenYear (){
	if(count==-1)
		d3.select("#total").text(totalCO[0]);

	count++;
	if(count==3){
		count=0;
		year=1990;
	}
	else
		year+=10;

	setTimeout(function(){
	d3.select("#cYear").text(year);
	d3.select("#total").text(totalCO[count]);
	},3000);
	
	var sum=0;
	for(var t=0;t<carbonData[count].length;t++)
		sum+=carbonData[count][t];
	totalSize=sum;
	var labels = color.domain();
		// return labels.map(function(label){
		// 	return { label: label, value: Math.random() }
	return labels.map(function(label,i){
		return {label:label,value:carbonData[count][i]};
	});
	// });
}



function change(data) {
	var delayTime=3000;

	/* ------- CHANGE PIE SLICES WHEN BUTTON IS PRESSED-------*/
	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice.enter()
		.insert("path")
		.style("fill", function(d) { return color(d.data.label); })
		.attr("class", "slice")
		.on("mouseover",mouseOn)
		.on("mouseleave",mouseOut);
					

	slice		
		.transition().duration(delayTime)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

	/* ------- CHANGE THE TEXT OF EACH SLICE WHEN BUTTON IS PRESSED-------*/

	var text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
			return d.data.label;
		});
	
	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(delayTime)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES WHEN BUTTON IS PRESSED-------*/

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);
	
	polyline.enter()
		.append("polyline");

	polyline.transition().duration(delayTime)
		.attrTween("points", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};			
		});
	
	polyline.exit()
		.remove();

};

function mouseOn(d){
	var percentage = (100 * d.value / totalSize).toPrecision(3);
	var percentageString = percentage + "%";
	if (percentage < 0.1) {
		percentageString = "< 0.1%";
	}
	d3.select("#percentage")
		.text(percentageString);

	d3.select("#cYear")
		.style("visibility", "hidden");
	d3.select("#total")
		.style("visibility", "hidden");
	d3.select("#info")
		.style("visibility", "");

	d3.selectAll("path")
		.transition()
		.duration(300)
		.style("opacity",0.3);

	d3.select(this)
		.transition()
		.duration(400)
		.style("opacity",1);
}

function mouseOut(d){
	d3.selectAll("path")
			.transition()
			.duration(500)
			.style("opacity", 1);
	d3.selectAll("text")
	 	.style("opacity", 1);
	d3.select("#cYear")
	    .style("visibility", "");
	d3.select("#total")
	    .style("visibility", "");
	d3.select("#info")
	   .style("visibility", "hidden");
}

//simplify this function
function drawHistogram(count){

	var max_y=22;
	var bin_num = 15;
	var max_height = 400;
	var rect_step = 30;

	var yScale = d3.scale.linear()
						.domain([0,max_y])
						.range([0,max_height]);
	
	// var graphics = svg.append("g")
	// 		.attr("transform","translate(380,-200)");

	//draw the histogram
	//change the position
	// var graphics = svg.append("g")
	// 					.attr("transform","translate(380,-200)");
	
	//draw rects
	if(count==-1 || count==0){
		graphicsA.selectAll("rect").style("opacity",0).on("mouseover",null).on("mouseout",null);
		graphicsB.selectAll("rect").style("opacity",0).on("mouseover",null).on("mouseout",null);
		graphics.selectAll("rect")
			.data(perCapita[count+1])  //use 0 to init
			.enter()
			.append("rect")
			.on("mouseover",function(d,i){
				d3.selectAll("rect")
					.transition()
		          	.duration(200)
      				.style("opacity", 0.2);
				d3.select(this)
					.transition()
		          	.duration(0)
					.style("opacity", 1);
				d3.select("#dataB")
					.attr("visibility","")
					.text(d+" ton per capita");    				
		    })
		    .on("mouseout",function(d,i){
				d3.selectAll("rect")
					.transition()
		          	.duration(800)
					.style("opacity",1);
				d3.select("#dataB")
					.text("")
					.attr("visibility","hidden")

		    })
		    .attr("height",0)
		    .attr("y",max_height)
		    .attr("fill","white")
		    .transition()
			.duration(1500)
			.attr("x",function(d,i){
				return i * rect_step; 
			})
			.attr("y", function(d,i){
				return max_height - yScale(d);
			})
			.attr("width", function(d,i){
				return rect_step - 4; 
			})
			.attr("height", function(d){
				return yScale(d);
			})
			.attr("fill",function(d,i){ 
				return dataColor[i];
			});

	}
	if(count==1){
		graphics.selectAll("rect").style("opacity",0).on("mouseover",null).on("mouseout",null);
		graphicsB.selectAll("rect").style("opacity",0).on("mouseover",null).on("mouseout",null);
		graphicsA.selectAll("rect")
			.data(perCapita[1])  //use 0 to init
			.enter()
			.append("rect")
			.on("mouseover",function(d,i){
				d3.selectAll("rect")
					.transition()
		          	.duration(200)
      				.style("opacity", 0.2);
				d3.select(this)
					.transition()
		          	.duration(0)
					.style("opacity", 1);
				d3.select("#dataB")
					.attr("visibility","")
					.text(d+" ton per capita");    				
		    })
		    .on("mouseout",function(d,i){
				d3.selectAll("rect")
					.transition()
		          	.duration(800)
					.style("opacity",1);
				d3.select("#dataB")
					.text("")
					.attr("visibility","hidden")

		    })
		    .attr("height",0)
		    .attr("y",max_height)
		    .attr("fill","white")
		    .transition()
			.duration(1500)
			.attr("x",function(d,i){
				return i * rect_step; 
			})
			.attr("y", function(d,i){
				return max_height - yScale(d);
			})
			.attr("width", function(d,i){
				return rect_step - 4; 
			})
			.attr("height", function(d){
				return yScale(d);
			})
			.attr("fill",function(d,i){ 
				return dataColor[i];
			});		
	}
	if(count==2){
		graphics.selectAll("rect").style("opacity",0).on("mouseover",null).on("mouseout",null);
		graphicsA.selectAll("rect").style("opacity",0).on("mouseover",null).on("mouseout",null);
		
		graphicsB.selectAll("rect")
			.data(perCapita[2])  //use 0 to init
			.enter()
			.append("rect")
			.on("mouseover",function(d,i){
				d3.selectAll("rect")
					.transition()
		          	.duration(200)
      				.style("opacity", 0.2);
				d3.select(this)
					.transition()
		          	.duration(0)
					.style("opacity", 1);
				d3.select("#dataB")
					.attr("visibility","")
					.text(d+" ton per capita");    				
		    })
		    .on("mouseout",function(d,i){
				d3.selectAll("rect")
					.transition()
		          	.duration(800)
					.style("opacity",1);
				d3.select("#dataB")
					.text("")
					.attr("visibility","hidden")

		    })
		    .attr("height",0)
		    .attr("y",max_height)
		    .attr("fill","white")
		    .transition()
			.duration(1500)
			.attr("x",function(d,i){
				return i * rect_step; 
			})
			.attr("y", function(d,i){
				return max_height - yScale(d);
			})
			.attr("width", function(d,i){
				return rect_step - 4; 
			})
			.attr("height", function(d){
				return yScale(d);
			})
			.attr("fill",function(d,i){ 
				return dataColor[i];
			});
	}

	//draw the line of axis
	graphics.append("line")
			.attr("stroke","black")
			.attr("stroke-width","1px")
			.attr("x1",0)
			.attr("y1",max_height)
			.attr("x2",perCapita[0].length * rect_step)
			.attr("y2",max_height);
	
	//draw the line of axis
	graphics.append("line")
			.attr("stroke","black")
			.attr("stroke-width","1px")
			.attr("x1",0)
			.attr("y1",0)
			.attr("x2",0)
			.attr("y2",max_height);

	//draw short line of each rect
	graphics.selectAll(".linetick")
			.data(perCapita[0])
			.enter()
			.append("line")
			.attr("stroke","black")
			.attr("stroke-width","1px")
			.attr("x1",function(d,i){
				return i * rect_step + rect_step/2;
			})
			.attr("y1",max_height)
			.attr("x2",function(d,i){
				return i * rect_step + rect_step/2;
			})
			.attr("y2",max_height + 5);

	var perCapitaAxis=[0,2,4,6,8,10,12,14,16,18,20,22];

	graphics.selectAll(".linetick")
			.data(perCapitaAxis)
			.enter()
			.append("line")
			.attr("stroke","black")
			.attr("stroke-width","1px")
			.attr("x1",0)
			.attr("y1",function(d){
				return (max_height - max_height*d / max_y);
			})
			.attr("x2",-5)
			.attr("y2",function(d){
				return (max_height - max_height*d / max_y);
			});
	
	//draw text of histogram
	graphics.selectAll("texta")
			.data(perCapita[0])
			.enter()
			.append("text")
			.attr("font-size","12px")
			.attr("x",-max_y)
			.attr("y", function(d,i){
				return (max_height - max_height*i/(perCapitaAxis.length-1))+5;
			})
			.text(function(d,i){
				return perCapitaAxis[i];
			});

	graphics.selectAll("textb")
			.data(perCapita[0])
			.enter()
			.append("text")
			.attr("font-size","10px")
			.attr("x",function(d,i){
				return i * rect_step; 
			})
			.attr("y", function(d,i){
				return max_height;
			})
			.attr("dx",rect_step/2 - 8)
			.attr("dy","15px")
			.text(function(d,i){
				return countryName[i];
			});

}

