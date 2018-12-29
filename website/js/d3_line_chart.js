$(document).ready(function() {



// This will be updated from whatever's been selected for the table
var selectedNTAs
// = ['BK33']
 // = ['BK33', 'MN11', 'MN20']



// Create a reverse  dictionary of NTA Code:Name
function swap(json){
        var ret = {};
        for(var key in json){
          ret[json[key]] = key;
        }
        return ret;
      }
// Key value pair swap
allNTA_rev = swap(allNTA)


console.log(allNTA_rev)


  // Set the dimensions of the canvas / graph
  var margin = {top: 40, right: 20, bottom: 30, left: 30},
      width = 1100 - margin.left - margin.right,
      height = 550 - margin.top - margin.bottom;

  // Create a parseDate function that can take in a string like '2011'
  var parseDate = d3v3.time.format("%Y").parse;

  // Trying to fix missing year data by adding in 0s, every year from 2010 to 2018...
  // This might be needed later
  var date_range = d3v3.time.years(parseDate('2010'),parseDate('2019'), 1);


  // Set the ranges
  var x = d3v3.time.scale().range([0, width]);
  var y = d3v3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3v3.svg.axis().scale(x)
      .orient("bottom").ticks(9)
      .tickFormat(d3v3.time.format("%Y"))

  var yAxis = d3v3.svg.axis().scale(y)
      .orient("left").ticks(5);

  // Define the line function
  var ntaline = d3v3.svg.line()
  		.interpolate("monotone")
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.count); });

  // Adds the svg canvas
  var svg = d3v3.select("#lineViz")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
  var data;
  
  var $datasetDropdown = $("#datasetDropdown");
  var $ntaDropdown = $("#neighborhoodDropdown");



  // Get the list of the column names that are the NTA code
  $("#neighborhoodDropdown,#datasetDropdown").change(function() {
  //$ntaDropdown.change(function() {
    $ntaDropdown.dropdown('refresh');
      
    dataset=$datasetDropdown.dropdown("get value");
    selectedNTAs = $("#neighborhoodDropdown").dropdown("get value") 
    selectedNTAs = selectedNTAs.slice(0,5)

  console.log(selectedNTAs);
  
  // Get the initial data
    if (datasetDict[dataset]["groupby_cat"]=="no"){
     sqlD3 = `https://wxu-carto.carto.com/api/v2/sql?q=SELECT DATE_PART('year',${datasetDict[dataset]["datename"]}) as year, ntacode, count(*) FROM "wxu-carto".${dataset} WHERE ntacode in ('${selectedNTAs.join(`', '`)}') group by DATE_PART('year',${datasetDict[dataset]["datename"]}),ntacode&api_key=c5yeQOubTACo6uxKipiq8A`
 
    }else{
    sqlD3 = `https://wxu-carto.carto.com/api/v2/sql?q=SELECT DATE_PART('year',${datasetDict[dataset]["datename"]}) as year,${datasetDict[dataset]["groupby_cat"]}, ntacode, count(*) FROM "wxu-carto".${dataset} WHERE ntacode in ('${selectedNTAs.join(`', '`)}') group by DATE_PART('year',${datasetDict[dataset]["datename"]}),${datasetDict[dataset]["groupby_cat"]},ntacode&api_key=c5yeQOubTACo6uxKipiq8A`
    }
  // console.log(sqlD3);
    var complaintTypes = {};
    console.log(sqlD3);
    
    d3v3.json(sqlD3,
    
    //READ ONLY SQL API KEY
    function(error, json) {
    json = json.rows;
    //console.log(json);
    var dropdown = document.getElementById('inds');
    dropdown.innerHTML='' 
   
    json.forEach(function(d, i) {
  	  d.count = +d.count;
      d.year = parseDate(String(d.year));
        
      complaint = d[datasetDict[dataset]['groupby_cat']] ;
      
    // Adding in dropdown options
    if (!complaintTypes[complaint]){
      dropdown.innerHTML += `<option value="${complaint}">${complaint}</option>`;

      complaintTypes[complaint] = true;
      }
    });
    
    // data here is filtered and filled zero data
    data = filterJSON(json, datasetDict[dataset]['groupby_cat'],datasetDict[dataset]['first_cat']);
    data = getZeroes(data, datasetDict[dataset]['first_cat']);
    updateGraph(data);
 
    // Update data filter when dropdown menu option changes
  	d3v3.select('#inds')
  	    .on("change", function () {
          var sect = document.getElementById("inds");
  	  	  var section = sect.options[sect.selectedIndex].value;
          // json variable is ALWAYS the same, it's the initial SQL query
  		  data = filterJSON(json,datasetDict[dataset]['groupby_cat'] ,section);
          console.log("get filtered data for this category",data);
          data = getZeroes(data, section)

  	      //debugger
  		  data.forEach(function(d) {
          // Make sure 'count' is a number
      		d.count = +d.count;
            // The code in line below might not be necessary, depends on data date format
//  		    d.year = parseDate(String(d.year));
   			d.active = true;
      	  });
          //console.log("updated and filtered data is",data);
    	  updateGraph(data);
  		  });

  	
   
    });
})
  // Update the chart when the neighborhood or data dropdowns change

  // color object
  var color = d3v3.scale.category20();

///////////////////////////
///// FUNCTIONS ///////////
///////////////////////////

    // function that maps a nta's data array by year, in order to fill missing years with 0
  function fillZero(nta_data, ntacode, section){
    var m = d3v3.map(nta_data, function(d) { return d.year });
    var newData = date_range.map(function(bucket) {
        return m.get(bucket) || {year: bucket, count: 0, complaint_type: section, ntacode: ntacode};
    });
    // console.log('NEW DATA!', newData);
    return newData;
  }


  // function for use later to filter JSON by type
  function filterJSON(json, key, value) {
    var result = [];
    json.forEach(function(val,idx,arr){
        if(val[key] == value){
        result.push(val)
      }
    })
  //   console.log(result);
    return result;
  }

  // function to nest filterJSON data, feed into fillZero, and return unnested version (flat)
  function getZeroes(data, section) {
    // debugger
    var result = [];
    var m = d3v3.nest().key(function(d) { return d.ntacode }).entries(data);
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
        newArray = fillZero([{'year':0}], ntacode, section)
        result.push(newArray)
      }
    })
    // console.log('zeroed data! ', result.flat())
    return result.flat()
  }


  function updateGraph(data) {
      // Scale the range of the data
      // console.log("data is",data);
      // TODO fix to extend of ALL data, for example 2000 - 2018 or 2012 - 2018
      //console.log("data on chart is",data);
      x.domain(d3v3.extent(data, function(d) { return d.year; }));
      y.domain([0, d3v3.max(data, function(d) { return d.count; })]);


      


      // Nest the entries by nta
      dataNest = d3v3.nest()
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
      // console.log('dataNest',dataNest);


      // Remove all the legend content
      d3v3.select("#legend")
        .selectAll("text")
        .remove();
      d3v3.select("#legend")
        .selectAll("rect")
        .remove();

  		var legend = d3v3.select("#legend")
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
        .text(function(d){return allNTA_rev[d.key];});

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
    d3v3.selectAll(".line")
  	.transition().duration(200)
  			.attr("d", function(d){
          return null;
        });
    d3v3.select("#legend").selectAll("rect")
    .transition().duration(200)
        .attr("fill", "#ccc");
  };

  function showAll(){
    d3v3.selectAll(".line")
  	.transition().duration(200)
  			.attr("d", function(d){
          return ntaline(d.values);
        });
    d3v3.select("#legend").selectAll("rect")
    .attr("fill",function(d) {
      if (d.active == true){
         return color(d.key);
       }
     })
  };
})
