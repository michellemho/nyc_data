$(document).ready(function() {



// This will be updated from whatever's been selected for the table
var selectedNTAs = ['BK33', 'MN11', 'MN20']

function getNTAs(){
  var neighborhoodList = []

  // Create a dictionary of NTA Name:Code
  var allNTA={};
  sql= `https://wxu-carto.carto.com/api/v2/sql?q=SELECT ntacode,ntaname  FROM "wxu-carto".nynta_4326 `
      list = {}

  $.getJSON( sql,function(data){
        d = data['rows'];
        $.each(d,function(i,v){
          allNTA[v['ntaname']]= v['ntacode']  
        })
        
  })

  var selectedNTAs1;
  // Get the list of the column names that are the NTA code
  $("#neighborhoodDropdown").change(function() {
    var selectedNTAs1 
    neighborhoodList = []
     $("#table-container thead tr th").each(function(){
        neighborhoodList.push($(this).text());

        selectedNTAs1 = $.map(neighborhoodList,function(val,i){return allNTA[val]});
        console.log("new NTAs",selectedNTAs1);
        // selectedNTAs = selectedNTAs1
    });
  })  
  return selectedNTAs1
}

console.log("Nta List is",getNTAs())



  // function for use later to filter JSON by type
  function filterJSON(json, key, value) {
    var result = [];
    json.forEach(function(val,idx,arr){
      if(val[key] == value){

        result.push(val)
      }
    })
    // console.log(result);
    return result;
  }

  // function to nest filterJSON data, feed into fillZero, and return unnested version (flat)
  function getZeroes(data, section) {
    // debugger
    var result = [];
    var m = d3.nest().key(function(d) { return d.ntacode }).entries(data);
    // console.log(m)
    ntas_found = []
    m.forEach(function(nta_data, idx){
      newArray = fillZero(nta_data.values, m[idx].key, section)
      result.push(newArray)
      ntas_found.push(m[idx].key)
    });
    // selectedNTAs= getNTAs();
    selectedNTAs.forEach(function(ntacode){
      if (!(ntas_found.includes(ntacode))){
        console.log(`nta code ${ntacode} NOT found... adding zeroes!`)
        newArray = fillZero([{'year':0}], ntacode, section)
        result.push(newArray)
      }
    })
    // console.log('zeroed data! ', result.flat())
    return result.flat()
  }

  // function that maps a nta's data array by year, in order to fill missing years with 0
  function fillZero(nta_data, ntacode, section){
    var m = d3.map(nta_data, function(d) { return d.year });
    var newData = date_range.map(function(bucket) {
        return m.get(bucket) || {year: bucket, count: 0, complaint_type: section, ntacode: ntacode};
    });
    // console.log('NEW DATA!', newData);
    return newData;
  }

  // Set the dimensions of the canvas / graph
  var margin = {top: 50, right: 20, bottom: 30, left: 160},
      width = 1000 - margin.left - margin.right,
      height = 550 - margin.top - margin.bottom;

  // Create a parseDate function that can take in a string like '2011'
  var parseDate = d3.time.format("%Y").parse;

  // Trying to fix missing year data by adding in 0s, every year from 2010 to 2018...
  // This might be needed later
  var date_range = d3.time.years(parseDate('2010'),parseDate('2019'), 1);


  // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(9)
      .tickFormat(d3.time.format("%Y"))

  var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);

  // Define the line function
  var ntaline = d3.svg.line()
  		.interpolate("monotone")
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.count); });

  // Adds the svg canvas
  var svg = d3.select("#lineViz")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
  var data;
  var complaintTypes = {};


  // Get the initial data
  d3.json(`https://wxu-carto.carto.com/api/v2/sql?q=
    SELECT%20DATE_PART(%27year%27,%20created_date)%20as%20year,
    %20complaint_type,%20ntacode,%20count(*)%20FROM%20%22wxu-carto%22.threeoneone_2010_2018
    WHERE ntacode in ('${selectedNTAs.join(`', '`)}')
    %20group%20by%20DATE_PART(%27year%27,%20created_date),%20complaint_type,%20ntacode&api_key=c5yeQOubTACo6uxKipiq8A`,
    
  //READ ONLY SQL API KEY
  function(error, json) {
    json = json.rows;
    // console.log(json);

    // debugger
    json.forEach(function(d, i) {
  		d.count = +d.count;
      d.year = parseDate(String(d.year));
      // console.log(d.complaint_type);
      // Adding in dropdown options
      if (!complaintTypes[d.complaint_type]){
        var dropdown = document.getElementById('inds');
        dropdown.innerHTML += `<option value="${d.complaint_type}">${d.complaint_type}</option>`;
        complaintTypes[d.complaint_type] = true;
      }
    });

  // Update data filter when dropdown menu option changes
  	d3.select('#inds')
  			.on("change", function () {
  				var sect = document.getElementById("inds");
  				var section = sect.options[sect.selectedIndex].value;
          // console.log(section)
          // json variable is ALWAYS the same, it's the initial SQL query
  				data = filterJSON(json, 'complaint_type', section);
          data = getZeroes(data, section)

  	      //debugger
  		    data.forEach(function(d) {
            // Make sure 'count' is a number
      			d.count = +d.count;
            // The code in line below might not be necessary, depends on data date format
      			// d.year = parseDate(String(d.year));
      			d.active = true;
      		});

  		    //debugger
  				updateGraph(data);
  			});

  	// generate initial graph
  	data = filterJSON(json, 'complaint_type', 'Blocked Driveway');
    data = getZeroes(data, 'Blocked Driveway');
    // console.log(data)
    // data here is filtered and filled zero data
  	updateGraph(data);

  });

  // color object
  var color = d3.scale.ordinal().range(["#48A36D",  "#0096ff", "#ff007e"]);

  function updateGraph(data) {
      // Scale the range of the data
      // TODO fix to extend of ALL data, for example 2000 - 2018 or 2012 - 2018
      x.domain(d3.extent(data, function(d) { return d.year; }));
      y.domain([0, d3.max(data, function(d) { return d.count; })]);


      // Nest the entries by nta
      dataNest = d3.nest()
          .key(function(d) {return d.ntacode;})
          // .rollup(function(v){return fillZero(v.values, function(d){return d.complaint_type})})
          .entries(data);

   		result = dataNest.filter(function(val,idx, arr){
  				  return $("." + val.key).attr("fill") != "#ccc"
  				  // matching the data with selector status
          })
          
      // .line here because there may already be lines there, we need to update the data
       var nta = svg.selectAll(".line")
                    .data(result, function(d){return d.key})
                    
        nta.enter()
          .append("path")
          .attr("class", "line")
        nta.exit().remove()


  		nta.transition()
  			.style("stroke", function(d,i) { return d.color = color(d.key); })
  			.attr("id", function(d){ return 'tag'+d.key.replace(/\s+/g, '');}) // assign ID
  			.attr("d", function(d){

  				return ntaline(d.values)
  			});

  		nta.exit().remove();

  		var legend = d3.select("#legend")
  			.selectAll("text")
  			.data(dataNest, function(d){return d.key});

  		//checkboxes
  		legend.enter().append("rect")
  		  .attr("width", 10)
  		  .attr("height", 10)
  		  .attr("x", 0)
  		  .attr("y", function (d, i) { return 0 +i*15; })  // spacing
  		  .attr("fill",function(d) {
  		    return color(d.key);

  		  })
  		  .attr("class", function(d,i){return "legendcheckbox " + d.key})


      // Add the Legend text
      legend.enter().append("text")
        .attr("x", 15)
        .attr("y", function(d,i){return 10 +i*15;})
        .attr("class", "legend");

  		legend.transition()
        .style("fill", "#777" )
        .text(function(d){return d.key;});

  		legend.exit().remove();

  		svg.selectAll(".axis").remove();

      // Add the X Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // Add the Y Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
  };

  function clearAll(){
    d3.selectAll(".line")
  	.transition().duration(100)
  			.attr("d", function(d){
          return null;
        });
    d3.select("#legend").selectAll("rect")
    .transition().duration(100)
        .attr("fill", "#ccc");
  };

  function showAll(){
    d3.selectAll(".line")
  	.transition().duration(100)
  			.attr("d", function(d){
          return ntaline(d.values);
        });
    d3.select("#legend").selectAll("rect")
    .attr("fill",function(d) {
      if (d.active == true){
         return color(d.key);
       }
     })
  };
})
