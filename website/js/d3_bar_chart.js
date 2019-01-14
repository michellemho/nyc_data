$(document).ready(function() {

dataset = $("#datasetDropdown").dropdown("get value"); 
selectedNTAs= $("#neighborhoodDropdown").dropdown("get value")
var color = d3v3.scale.category20();

// This will be updated from whatever's been selected for the table
//var selectedNTAs
// = ['BK33']
 // = ['BK33', 'MN11', 'MN20']


//var neighborhoodList=[];

	var margin = {
		top: 20,
		right: 20,
		bottom: 30,
		left: 40
	};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	var svg = d3.select("#chart-container").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// define div for the tooltips
	var div = d3.select("#chart-container").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

	// set up an x scaleBand and y linear scale, fill in domain later with data
	var x = d3.scaleBand()
	.range([0, width]);

	var y = d3.scaleLinear()
	.range([height, 0])

	var yAxis = d3.axisLeft(y);

	var selectedVar = 'male_under_5_years'
	var name = 'age_sex'
	var dataset = `nta_acs_${name}_2013`
//    dataset = $("#datasetDropdown").dropdown("get value");
	var denominator = 'total_population'


	Object.entries(variables[name]).forEach(function(d){
		var dropdown = document.getElementById('indsBar');
		// console.log(d)
		dropdown.innerHTML += `<option value="${d[1]}">${d[0]}</option>`;
	})

	// add the y Axis
	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);

	var sqlApiQuery = `https://wxu-carto.carto.com/api/v2/sql?q=SELECT a.${selectedVar}/${denominator}::float as var, a.ntacode, b.ntaname FROM "wxu-carto".${dataset} as a, "wxu-carto".nynta_4326 as b where a.ntacode = b.ntacode`

	var totalPop = `https://wxu-carto.carto.com/api/v2/sql?q=SELECT a.${selectedVar}::float as var, a.ntacode, b.ntaname FROM "wxu-carto".${dataset} as a, "wxu-carto".nynta_4326 as b where a.ntacode = b.ntacode`


// Get the list of the column names that are the NTA code
$("#datasetDropdown,#neighborhoodDropdown").change(function() {

	$('neighborhoodDropdown').dropdown('refresh');
//	neighborhoodList = []
//	$("#table-container thead tr th").each(function(){
//		neighborhoodList.push($(this).text());
//		});
	
//	selectedNTAs = $.map(neighborhoodList.slice(1),function(val,i){return allNTA[val]});
	selectedNTAs = $("#neighborhoodDropdown").dropdown("get value");
	// console.log('New NTAs for barchart!');
	// console.log(selectedNTAs);

	d3.select('#indsBar')
	.on("change", function () {
		var sect = document.getElementById("indsBar");
		var selectedVar = sect.options[sect.selectedIndex].value;
		// console.log(selectedVar)
		drawChart(sqlApiQuery, selectedVar, selectedNTAs)
	})


	drawChart(sqlApiQuery, 'total_population', selectedNTAs)

	function drawChart(sqlApiQuery, selectedVar, selectedNTAs){
		d3.select('#indsBar')
			.selectAll("rect")
        	.remove();
		var sqlApiQuery = `https://wxu-carto.carto.com/api/v2/sql?q=SELECT a.${selectedVar}/${denominator}::float as var, a.ntacode, b.ntaname FROM "wxu-carto".${dataset} as a, "wxu-carto".nynta_4326 as b where a.ntacode = b.ntacode`

		var totalPop = `https://wxu-carto.carto.com/api/v2/sql?q=SELECT a.${selectedVar}::float as var, a.ntacode, b.ntaname FROM "wxu-carto".${dataset} as a, "wxu-carto".nynta_4326 as b where a.ntacode = b.ntacode`

		if (selectedVar === 'total_population'){
			query = totalPop
			unit = 'people'
		}
		else{
			query = sqlApiQuery
			unit = '%'
		}
		d3.json(query, function(error, data){
			// debugger
			data = data.rows
			// make sure values are numeric
			data.forEach(function(d, i) {
				d.var = +d.var;
			})
		// sort the data
		data.sort(function(a, b) {
			return a.var - b.var;
		});
		// console.log('max value is ', d3.max(data, function(d) { return d.var; }))

		// Add in domain for y linear scale
		y.domain([0,d3.max(data, function(d) { return d.var; })])

		// map data vars to the domain of the x scaleBand 
        x.domain(data.map((x, i) => i))
		
		x.paddingInner(0.05);

		// console.log('bandwidth: ', x.bandwidth())
		// create a selection and bind data
		var selection = svg.selectAll('rect')
		.data(data);

		// create label element for text labels
		var labels = svg.selectAll('.label')
		.data(data);

		// create new elements wherever needed 
		selection.enter()
			.append('rect')
			.attr("class", "bar")
			.attr('x', function(d, i){
				// fixed in case of duplicate d.var
				return x(i)
			})
			.attr('width', x.bandwidth())

			.merge(selection) // merge new elements with existing ones, so everything below applies to all
			.attr('fill', function(d,i){ return (selectedNTAs.includes(d.ntacode) ? color(d.ntacode) : "#828282"); })
			.attr('height', function(d){
				return height - y(d.var);
			})
			.attr('y', function(d){return y(d.var)})
			.on("mouseover", function(d, i) {
				var xPosition = parseFloat(d3.select(this).attr("x"));
				var yPosition = parseFloat(d3.select(this).attr("y"));

				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(d.ntaname + "<br/>" + d.var.toFixed(4))
					.style("left", xPosition + "px")
					.style("top", yPosition + "px");
				})
			.on("mouseout", function(d) {
			div.transition()
				.duration(500)
				.style("opacity", 0);
			});

			
		//left axis
		svg.select('.y.axis')
		.call(yAxis)
		// grid
		svg.select('g')
		.attr('class', 'grid')
		.call(yAxis)

		// remove any unused bars
		selection.exit()
				.remove();
		})
	}
		;	

	});







})
