$(document).ready(function() {


// const catDict1 ={'% White':'white_perc',
//             "% Black":'colored_perc',
//             "% Hispanic":'hispanic_perc',
//             "% Asian, Native American, Pacific Islander and 'other' or multiple races":'other_perc',
//             "Population":'population',
//             '% Unemployment':"unemployed_perc",
//             "Population density (ppl/sq-km)":'population_density',
// 			"Median household income (adj. 2016)":'median_income_adj',
//             '% Higher education':'college_perc'}


// const legendCatDesc= {'white_perc':`Quantiles of the median percentage of White race (including Hispanic, where applicable) as defined by each year's census`,
//             'colored_perc':`Quantiles of the median percentage of White race (including Hispanic, where applicable) as defined by each year's census`,
//             'hispanic_perc':"% Hispanic",
//             'other_perc':"% Other races",
//             'population':"Population",
//             'population_density':"Population density (ppl/sq-km)",
//             'unemployed_perc':'% Unemployment',
//             'median_income_adj':"Median household income (adj. 2016)",
//             'college_perc':'% Higher education'}

// function getBoundsSQL(city,year){
// 	sql = `select  * from holc_overlay_${year} where city='${city}'`
// 	return sql
// }
// function getBoundsAllSQL(city){
// 	sql = `select  * from holc_overlay_all where city ='${city}' `
// 	return sql
// }



// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////


// /////////////////////////////
// ///////// Page functions ////
// /////////////////////////////

$('#neighborhoodDropdown')
  .dropdown();

// $('.homeIcon').on('click',function(){
// 	$('.dimmer').addClass('active');
// })

// $('.infoIcon').on('click',function(){
// 	$('#infoMessage').transition('fade in');
// })

// $('.dataIcon').on('click',function(){
// 	$('#dataMessage').transition('fade in');
// })
// $('.message .close')
//   .on('click', function() {
//     $(this)
//       .closest('.message')
//       .transition('fade')
//     ;
//   });

// // Color dict for the legend
// const censusCatDict = {
// 			"colored_perc":[
// 		            '#f0d9dd',
// 		            '#f2afb9',
// 		            '#ef8491',
// 		            '#e75567',
// 		            '#d9033c'
// 		        ],
//     		"hispanic_perc": [
// 	            '#e1bee7',
// 	            '#ba68c8',
// 	            '#9c27b0',
// 	            '#7b1fa2',
// 	            '#4a148c'],
// 		    "white_perc":  [
// 		        '#e8eaf6',
// 		        '#7986cb',
// 		        '#3f51b5',
// 		        '#303f9f',
// 		        '#1a237e'],
//     		"other_perc": [
// 		           '#ffe0b2',
// 		            '#ffb74d',
// 		           '#ff9800',
// 		            '#f57c00',
// 		            '#e65100'
// 		        ],
// 		    "median_income_adj": [
// 	            "#cf597e",
// 	            "#e88471",
// 	            "#eeb479",
// 	            "#e9e29c",
// 	            "#9ccb86",
// 	            "#39b185",
// 	            "#009392"
// 	        ],
// 		    "population": [
// 		            "#f3e0f7",
// 		            "#e4c7f1",
// 		            "#d1afe8",
// 		            "#b998dd",
// 		            "#9f82ce",
// 		            "#826dba",
// 		            "#63589f"
// 		        ],
// 		    "population_density": [
// 		            "#d1eeea",
// 		            "#a8dbd9",
// 		            "#85c4c9",
// 		            "#68abb8",
// 		            "#4f90a6",
// 		            "#3b738f",
// 		            "#2a5674"
// 		        ],
// 		    "college_perc":[
// 		            "#DEEACC",
// 		            "#AACF92",
// 		            "#72B461",
// 		            "#39993A",
// 		            "#1B7E2F"
// 		        ],
// 		    "unemployed_perc": [
// 		        '#F2DDDF',
// 		        '#DE98A2',
// 		        '#CA5C6C',
// 		        '#B6293F',
// 		        '#A2001A']
// 		       }


/////////////////////////////////
//////// initial datasets /////
/////////////////////////////////



const catDict ={'order_to_repair_vacate_orders':'Order to Repair or Vacate'}


function populateDataDropdown(dict){

}


// const holc_tiles = {1930:'holc_overlay_1930',
// 				1940:'holc_overlay_1940',
// 				1950:'holc_overlay_1950',
// 				1960:'holc_overlay_1960',
// 				1970:'holc_overlay_1970',
// 				1980:'holc_overlay_1980',
// 				1990:'holc_overlay_1990',
// 				2000:'holc_overlay_2000',
// 				2010:'holc_overlay_2010',
// 				2016:'holc_overlay_2016'
// 	}

// const holc_colors_dict = {'A':'5fce23','B':'0bc0ed','C':'ffd419','D':'ff4b19'}
// const s = carto.expressions;


// /// Definite the initial category parameters
// var year = '2016';
// var city='Cleveland';
// var category ='colored_perc';



// /////////////////////////////////
// // initialize city dropdown /////
// /////////////////////////////////
// var $cityDropdown = $("#cityDropdown");
// $('#cityDropdown1').dropdown();
// var cityList = cities[parseInt(year)].sort();

// $cityDropdown.empty();
// $.each(cityList, function() {
// $cityDropdown.append($('<div class="item" data-value="'+this+'">'+this+'</div>'))})



// /////////////////////////////////
// /// Initialize Census dropdown///
// ////////////////////////////////
// var $censusDropdown = $("#censusDropdown");
// $('#censusDropdown1').dropdown();
// var censusList1 = censusFeatures[parseInt(year)];

// $censusDropdown.empty();
// $.each(censusList1, function(k,v) {
// 	$censusDropdown.append($('<div class="item" data-value="'+v+'">'+catDict[v]+'</div>'))
// })



// ///////////////////////////
// /// Insert Year Selector //
// ///////////////////////////
// years = [1930,1940,1950,1960,1970,1980,1990,2000,2010,2016]
// var infoPanelDiv = document.getElementById("info");
// var marginLeft = 40;
// var width = infoPanelDiv.clientWidth-marginLeft;
// var yearSlider = d3.sliderHorizontal()
//     .min(1930)
//     .max(2020)
//     .marks(years)
//     .ticks(12)
//     .width(width-40)
//     .tickFormat(d3.format("d"))
//     .default(2016);

//   var g = d3.select("div#yearSlider").append("svg")
//     .attr("width", width)
//     .attr("height", 50)
//     .append("g")
//     .attr("transform", "translate(18,10)");

//   g.call(yearSlider);

//   d3.select("p#value2").text((yearSlider.value()));
//   d3.select("a#setValue2").on("click", () => yearSlider.value(5));




// //////////////////////////
// // Add base line layers //
// //////////////////////////

// mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtd2Z4IiwiYSI6ImNqNGFnMnIyMzEwZzgycXJ1ODdqbG14eGMifQ.3AqBqXZlcbsbEhxddAPB-g';
// const mapRedline = new mapboxgl.Map({
//     container: 'left', // container id
//     style:'mapbox://styles/iamwfx/cjjx6bl926vgt2ss0l9dbpmxz', // LightLite
//     center:[-81.681290,41.505493], // starting position [lng, lat]
//     zoom: 10 // starting zoom
//   });

// const mapCensus = new mapboxgl.Map({
//       container: 'right',
//       style:'mapbox://styles/iamwfx/cj84yjo8702b82smocliue4pn', // Light
//       center: [-81.681290,41.505493],
//       zoom: 10
//     });

// carto.setDefaultAuth({
//       user:  'parksgps',
//       apiKey: 'a5egxawWBp3cGSA9Fcxd4A'
//     });

// const map = new mapboxgl.Compare(mapRedline, mapCensus, {
//     // Set this to enable comparing two maps by mouse movement:
//     // mousemove: true
// });


// var holcOverlaySource = new carto.source.SQL(`
// 	SELECT * from holc_overlay_2016
// 	`, {
// 	  user:  'parksgps',
// 	  apiKey: 'a5egxawWBp3cGSA9Fcxd4A'
// 	});

// /////// Census
// var holcOverlayVizCensus = new carto.Viz(`
  
//   @city:$city
//   @holc_grade:$holc_grade_x
//   @population:$population
//   @population_density:$population_density
//   @white_perc:$white_perc
//   @colored_perc:$colored_perc
//   @median_income_adj:$median_income_adj
//   @hispanic_perc:$hispanic_perc
//   @other_perc:$other_perc
//   @unemployed_perc:$unemployed_perc
//   @unemployed_perc_css:$unemployed_perc*10
//   @college_perc:$college_perc
//   color: opacity(ramp(viewportQuantiles($colored_perc,5), PINK_WX),@colored_perc*1.5)
//   strokeWidth: 0
//   strokeColor: rgba(255, 255, 255,0.01)
// `);

// ///// Redline
// var holcOverlayVizRedline = new carto.Viz(`
//   @city:$city
//   @holc_grade:$holc_grade_x
//   @population:$population
//   @population_density:$population_density
//   @white_perc:$white_perc
//   @colored_perc:$colored_perc
//   @median_income_adj:$median_income_adj
//   @hispanic_perc:$hispanic_perc
//   @other_perc:$other_perc
//   @unemployed_perc:$unemployed_perc
//   @unemployed_perc_css:$unemployed_perc*10
//   @college_perc:$college_perc
//   color: opacity(ramp(buckets($holc_grade_x,['A','B','C','D']),[#5fce23,#0bc0ed,#ffd419,#ff4b19,#ff4b19]),.5)
//   strokeWidth: 1
//   strokeColor: rgb(255, 255, 255)
// `);


// var holcOverlayLayerCensus = new carto.Layer('holcOverlayLayerCensus', holcOverlaySource, holcOverlayVizCensus);
// holcOverlayLayerCensus.addTo(mapCensus);

// var holcOverlayLayerRedline = new carto.Layer('holcOverlayLayerRedline', holcOverlaySource, holcOverlayVizRedline);
// holcOverlayLayerRedline.addTo(mapRedline);


// // disable map rotation using right click + drag
// mapCensus.dragRotate.disable();
// mapRedline.dragRotate.disable();

// // disable map rotation using touch rotation gesture
// mapCensus.touchZoomRotate.disableRotation();
// mapRedline.touchZoomRotate.disableRotation();


// mapCensus.addControl(new mapboxgl.NavigationControl(),'bottom-right');

// //////////////////////////////
// //////////// Add bbox ////////
// //////////////////////////////

// var lng1=mapCensus.getBounds()['_ne']['lng'];
// var lat1=mapCensus.getBounds()['_ne']['lat'];
// var lng2=mapCensus.getBounds()['_sw']['lng'];
// var lat2=mapCensus.getBounds()['_sw']['lat'];
// var bbox= [[lng1,lat1],[lng2,lat2]];


// //////////////////////////////
// ///// Add raster maps ////////
// //////////////////////////////

// mapRedline.on('load',function(){

// 	rastertiles.forEach(function(element){
// 		if (element.type =='raster'){
// 			// console.log(element);
// 			mapRedline.addLayer({
// 				id:element.name,
// 				type: 'raster',
// 				source:{
// 					type:'raster',
// 					url:'mapbox://'+element.id
// 					// tiles: ['https://api.mapbox.com/v4/'+element.id+'/{z}/{x}/{y}.png?access_token='+mapboxgl.accessToken],
// 				},
// 				paint:{
// 					 'raster-opacity':0.5
// 				},
// 				 // minzoom: 0,
//     	// 		maxzoom: 22
// 				'source-layer':element.name
// 			})

// 		}})


// })

// ///////////////////////////////////////////////////////
// ////// Allow enter on initalized charts and map ///////
// ///////////////////////////////////////////////////////
// mapRedline.on('load', (ev) => {
// 	yearBoxPlot(getBoundsSQL(city,year),category);
// 	$.when(historicalBoxPlot(getBoundsAllSQL(city),'colored_perc')).then(
// 		$("#undim").removeClass("loading disabled"));
// });

// /////////////////////////////////
// ////// Add in the Legend ////////
// /////////////////////////////////

// updateLegend(city,category,year,mapCensus,bbox);


// /////////////////////////////////////////////////
// // Change info panel and legend on year change //
// /////////////////////////////////////////////////

// $('#yearSlider>svg>g>.slider>.parameter-value>text').bind('DOMSubtreeModified',function(){
	
// 	/// Establish the parameters
// 	var city  = $('#cityDropdown1 .text').text();
// 	year = this.innerHTML;
// 	var category = catDict1[$('#censusDropdown1 .text').text()];
	
// 	// Change the available cities
//   	cityList = cities[parseInt(year)].sort();
//   	$cityDropdown.empty();
//   	$.each(cityList, function() {
// 		$cityDropdown.append($('<div class="item" data-value="'+this+'">'+this+'</div>'))
   		
// 		})

//   	// Change the available census features
//   	censusList1 = censusFeatures[parseInt(year)];
//   	$censusDropdown.empty();
// 	$.each(censusList1, function(k,v) {
// 	$censusDropdown.append($('<div class="item" data-value="'+v+'">'+catDict[v]+'</div>'))})

// 	// If the current city isn't in the new list, then default to the first on the list
// 	if ($.inArray(city,cityList)==-1){
// 		city = cityList[0];
// 		$('#cityDropdown1 .text').text(city)

		
// 	}
// 	// If the current category isn't in the new list, then default to the first on the list
// 	if ($.inArray(category,censusList1)==-1){
// 		category=censusList1[0];
	
// 		$('#censusDropdown1 .text').text(catDict[category]);
// 	}

// 	// All the years will get population_density, white, and black
// 	censusList1_amend = censusFeatures[parseInt(year)].slice(4); 

// 	holcOverlaySource =new carto.source.SQL(`
//   		select * from holc_overlay_${year} where city ='${city}'`,
//   		{
// 	  user: 'parksgps',
// 	  apiKey: 'a5egxawWBp3cGSA9Fcxd4A'
// 	})
//   	;
//   	updateCensusMap(city,category,year,holcOverlayLayerCensus,holcOverlaySource)

  	
// 	updateLegend(city,category,year,mapCensus,bbox)
//   })


// /////////////////////////////////
// // Change layer on city change //
// /////////////////////////////////
// $('#cityDropdown1').on('change',function(){
// 		console.log('city changed2');
// 		/// Establish the parameters
// 		// Get the new features
//         newFeatures = getFeatures();
//         category=newFeatures[0]
//         city = newFeatures[1]
//         year = newFeatures[2]

// 		holcOverlaySource =new carto.source.SQL(`
// 	  		select * from holc_overlay_${year}
// 	  		where city = '${city}'
// 	  		`,
// 	  		{
// 			  user: 'parksgps',
// 			  apiKey: 'a5egxawWBp3cGSA9Fcxd4A'
// 			})
// 		console.log(`
// 	  		select * from holc_overlay_${year}
// 	  		where city = '${city}'
// 	  		`);
// 		updateCensusMap(city,category,year,holcOverlayLayerCensus,holcOverlaySource);

	

// })
// /////////////////////////////////
// // Change layer on cat change ///
// /////////////////////////////////

// $('#censusDropdown1').on('change',function(){

// 		/// Establish the parameters
// 		newFeatures = getFeatures();
//         category=newFeatures[0]
//         city = newFeatures[1]
//         year = newFeatures[2]

// 		// Update Categeory map
// 		updateCensusMap(city,category,year,holcOverlayLayerCensus,holcOverlaySource);
// 		//Update legend
// 		updateLegend(city,category,year,mapCensus,bbox);

// 	}
// )



// ///////////////////////////////////////////
// /////////// Add hover pop-ups /////////////
// ///////////////////////////////////////////

// const popupLeft = new mapboxgl.Popup({
//   closeButton: false,
//   closeOnClick: false
// });

// const popupRight = new mapboxgl.Popup({
//   closeButton: false,
//   closeOnClick: false
// });


// const interactivityCensus = new carto.Interactivity(holcOverlayLayerCensus);
// const interactivityRedline = new carto.Interactivity(holcOverlayLayerRedline);

// const delay = 70;
// let clickedFeatureId = null;

// popUp(interactivityCensus,popupRight,mapCensus,'red');
// popUp(interactivityRedline,popupLeft,mapRedline,'white');



// ///////////////////////////////////
// ////////// FUNCTIONS //////////////        
// ///////////////////////////////////
// function popUp(interactivity,popUp,map,outlineColor){
// 	///// Change the opacity of the highlighted HOLC zone 
// 	interactivity.on('featureEnter', event => {

		
// 		if (event.features.length > 0) {
// 		const feature = event.features[0];
// 		const vars = event.features[0].variables;

// 		if (feature.id !== clickedFeatureId) {

// 		  feature.color.blendTo(`opacity(#${holc_colors_dict[vars.holc_grade.value]},1)`, delay)
		  
// 			}
// 		}
// 	});
// 	///// Change the opacity back
// 	interactivity.on('featureLeave', event => {
// 	  if (event.features.length > 0) {
// 	    const feature = event.features[0];
// 	    if (feature.id !== clickedFeatureId) {
// 	      // feature.color.reset(delay);
// 	      feature.strokeWidth.reset(delay);
// 	      feature.color.reset(delay);
	      
// 	    }
// 	    popUp.remove();
// 	  }
// 	});

// 	///// On click, display the census info
// 	interactivity.on('featureClick', event =>{
		
// 		if (event.features.length > 0) {
// 	    const vars = event.features[0].variables;

// 	    /// Establish the parameters
// 		city = $('#cityDropdown1 .text').text();
// 		year = $('#yearSlider>svg>g>.slider>.parameter-value>text').text();

// 		// All the years will get population_density, white, and black
// 		censusList1_amend = censusFeatures[parseInt(year)].slice(4); 
		
// 		/// Display the baseline the numbers (Population, population density, white, and black races)
// 	    popUpStr = ` <div>
// 	      <h4>${year} ${vars.city.value}: Grade ${vars.holc_grade.value}</h4>
// 	      <p id="description">Population: ${numberWithCommas(parseInt(vars.population.value))}
// 	      <p id="description">Population density (people per sq. km.): ${numberWithCommas(parseInt(vars.population_density.value))}
// 	      <br>
// 	      White: ${d3.format(",.2%")(vars.white_perc.value)}
// 	      <br>
// 	      Black: ${d3.format(",.2%")(vars.colored_perc.value)}
// 	      <br>`

// 	    /// If there are other feature available, add them in
// 	    if (censusList1_amend.length!=0){
// 	    	popUpDict ={
// 				'other_perc':`Asian, Pacific Islander and multiple:  ${d3.format(",.2%")(vars.other_perc.value)} <br>`,
// 				'college_perc':`Higher Education:  ${d3.format(",.2%")(vars.college_perc.value)} <br>`,
// 				'median_income_adj':`Median income (adj 2016):  ${d3.format("$,.0f")(parseInt(vars.median_income_adj.value))} <br>`,
// 				}
// 	    	if (censusList1_amend.length==4){
// 	    		popUpDict ={
// 				'other_perc':`Asian, Pacific Islander and multiple:  ${d3.format(",.2%")(vars.other_perc.value)} <br>`,
// 				'college_perc':`Higher Education:  ${d3.format(",.2%")(vars.college_perc.value)} <br>`,
// 				'median_income_adj':`Median income (adj 2016):  ${d3.format("$,.0f")(parseInt(vars.median_income_adj.value))} <br>`,
// 				'hispanic_perc':`Hispanic: ${d3.format(",.2%")(vars.hispanic_perc.value)} <br>`
// 				}
// 	    	}
// 	    	else if (censusList1_amend.length==5){
// 	    		popUpDict ={
// 				'other_perc':`Asian, Pacific Islander and multiple:  ${d3.format(",.2%")(vars.other_perc.value)} <br>`,
// 				'college_perc':`Higher Education:  ${d3.format(",.2%")(vars.college_perc.value)} <br>`,
// 				'median_income_adj':`Median income (adj 2016):  ${d3.format("$,.0f")(parseInt(vars.median_income_adj.value))} <br>`,
// 				'hispanic_perc':`Hispanic: ${d3.format(",.2%")(vars.hispanic_perc.value)} <br>`,
// 				'unemployed_perc':`Unemployment:  ${d3.format(",.2%")(vars.unemployed_perc.value)} <br>`
// 				}
		    	
// 			}
// 		    $.each(censusList1_amend,function(i,v){
// 		    	popUpStr += popUpDict[v];
// 		    });
// 		 }
// 	    popUpStr+=`</p></div>`

// 	    popUp.setHTML(popUpStr);

	    
// 	    popUp.setLngLat([event.coordinates.lng, event.coordinates.lat+.003]);
// 	    if (!popUp.isOpen()) {
// 	      popUp.addTo(map);
// 	    }
// 	  	else {
// 	    popUp.remove();
// 	  	}

// 	  }
// 	})
// }

// function updateCensusMap(city,category,year,overlay,overlaySource){

// 	///Whenever the category changes, we need to update the following: 
// 	// The charts
// 	// The map
// 	// The legend

// 	var holcOverlayVizCensusNew;
// 	censusList1 = censusFeatures[parseInt(year)];
	
// 	//Update the map
// 	////// Set opacities based on the features
// 	////// For race percentages, we since we want to highlight higher percentages, 
// 	////// We're going to decrease opacity in lower percentages.
// 	////// For all other census categories, we'll set a standard opacity of 0.7
// 	const censusColors ={
// 		'white_perc':'color:opacity(ramp(viewportQuantiles($white_perc,5), BLUE_WX),@white_perc)\n',
//         'colored_perc':"color:opacity(ramp(viewportQuantiles($colored_perc,5), PINK_WX),@colored_perc_css)\n",
//         'hispanic_perc':"color:opacity(ramp(viewportQuantiles($hispanic_perc,5), PURPLE_WX),@hispanic_perc_css)\n",
//         'other_perc':"color:opacity(ramp(viewportQuantiles($other_perc,5), ORANGE_WX),@other_perc_css)\n",
//         'population_density':"color:opacity(ramp(viewportQuantiles($population_density,7), POPULATION_DENS_WX),.8)\n",
//         'population':"color:opacity(ramp(viewportQuantiles($population,7), POPULATION_WX),.8)\n",
//         'college_perc':'color:opacity(ramp(viewportQuantiles($college_perc,5), COLLEGE_WX),@college_perc_css)\n',
//         'median_income_adj':"color:opacity(ramp(viewportQuantiles($median_income_adj,7), INCOME_WX),.7)\n",
//         'unemployed_perc':'color:opacity(ramp(viewportQuantiles($unemployed_perc,5), UNEMPLOY_WX),@unemployed_perc_css)\n'}
//     const vizDict = {'city':`@city:$city\n`,
// 		'population_density':`@population_density:$population_density\n`,
// 		'population':`@population:$population\n`,
// 		'white_perc':`@white_perc:$white_perc\n`,
// 		'colored_perc':`@colored_perc:$colored_perc\n@colored_perc_css:$colored_perc*2\n`,
// 		'hispanic_perc':`@hispanic_perc:$hispanic_perc\n@hispanic_perc_css:$hispanic_perc*2\n`,
// 		'median_income_adj':`@median_income_adj:$median_income_adj\n`,
// 		'other_perc':'@other_perc:$other_perc\n@other_perc_css:$other_perc*4\n',
// 		'unemployed_perc':`@unemployed_perc:$unemployed_perc\n@unemployed_perc_css:$unemployed_perc*10\n`,
// 		'college_perc':`@college_perc:$college_perc\n@college_perc_css:$college_perc*4\n`}
	
// 	/// For each year and category we need to create a new literal for the carto viz.
// 	vizString = `strokeWidth: 0\n@city:$city \n @holc_grade:$holc_grade_x\n`,

// 	$.each(censusList1,function(i,v){
		
// 		vizString+=vizDict[v]
// 	})	  
// 	// String that represents the choropleth scheme for the map
// 	vizString+=	censusColors[category]
	
// 	var holcOverlayVizCensusNew = new carto.Viz(vizString);


// 	//Update overlay layer
// 	overlay.update(overlaySource,holcOverlayVizCensusNew);

// 	// Zoom to new city
// 	boundsQuery = "SELECT ST_XMin(st_extent(the_geom)) as xmin, ST_YMin(st_extent(the_geom)) as ymin, ST_XMax(st_extent(the_geom)) as xmax, ST_YMax(st_extent(the_geom)) as ymax from holc_overlay_"+year+" where city ='"+city+"'";
		
// 	$.getJSON('https://parksgps.carto.com/api/v2/sql/?q='+boundsQuery, function(data) {
// 		lng1= data.rows[0]['xmin'];
//         lat1= data.rows[0]['ymin'];
//         lng2= data.rows[0]['xmax'];
//         lat2= data.rows[0]['ymax'];
//         bbox = [[
// 	        lng1,
// 	        lat1
// 	    ], [
// 	        lng2,
// 	        lat2
// 	    ]];

// 	    /// change map to new city and then update the legend
// 	    mapCensus.fitBounds(bbox,{linear:true, padding:20});
// 	    updateLegend(city,category,year,mapCensus,bbox)


// 	});

	

// }
 

// function numberWithCommas(x) {
//     x = x.toString();
//     var pattern = /(-?\d+)(\d{3})/;
//     while (pattern.test(x))
//         x = x.replace(pattern, "$1,$2");
//     return x;
// }

// function updateLegend(city,category,year,mapCensus,bbox){
//     lng1=bbox[0][0]
//     lat1=bbox[0][1]
//     lng2=bbox[1][0]
//     lat2=bbox[1][1]
	
//     // var quantileQuery = "SELECT  CDB_QuantileBins(array_agg("+category+"), "+censusCatDict[category].length+") FROM holc_overlay_"+year+" where st_intersects(the_geom,ST_SetSRID(ST_MakeBox2D(ST_Point("+lng1+", "+lat1+"), ST_Point("+lng2+", "+lat2+")), 4326))";
//     var quantileQuery = `SELECT  CDB_QuantileBins(array_agg(${category}),${censusCatDict[category].length}) FROM holc_overlay_${year} where city='${city}'`;

//     $.getJSON('https://parksgps.carto.com/api/v2/sql/?q='+quantileQuery, function(data) {
//     	$('.censusLegend').empty();
// 	 	$('.censusLegend').append($(`<h5 class="header smallHeader ">${city} ${catDict[category].replace(/\b\w/g, l => l.toUpperCase())}</h5><div class="legendBar"</div>`));
	 	
// 	 	var x = d3.scaleLinear().range([0, 100]);
// 	 	const barWidth = parseInt(220/censusCatDict[category].length);

// 	 	const svg = d3.select(".legendBar").append("svg")
//                 .attr("width", 250)
//                 .attr("height",40)
//         const g = svg.append("g")
//                 .attr("transform", "translate(15,0)");
        
//         ///Formatter
//         var formattedNum;
//        	if(category=='median_income_adj'){
//         		var formatNum =d3.format("$.03s");
//         	}
//         	else if((category=='population') |(category=='population_density')){
//         		var formatNum =d3.format(".3s");
//         	}
//         	else{
//         		var formatNum=d3.format(",.2%");
//         	}

//         /// Create an array of legend values
// 	    var legendValues= data['rows'][0]['cdb_quantilebins']
// 	    legendValues.unshift(0);

// 		for (i=0; i<censusCatDict[category].length+1;i++){
// 			legendValues[i] = formatNum(legendValues[i]);
// 		}

// 		/// Draw the legend
// 		g.selectAll("rect")
// 		    .data(censusCatDict[category].map(function(d,i){return [i,d,legendValues[i]]}))
// 		    .enter().append("rect")
// 				.attr("height", 20)
// 				.attr("x", function(d){return (d[0])*barWidth})
// 				.attr("width", barWidth)
// 				.attr("fill",function(d){return d[1]})
// 		g.selectAll("tick")
// 			.data(legendValues.map(function(d,i){return [i,d]}))
// 			.enter().append("text")
// 				.attr("class", "caption")
// 				.attr("x",function(d){return (d[0])*barWidth})
// 				.attr("y", 30)
// 				.attr("fill", "#000")
// 				.attr("font-size", "10px")
// 				.attr("text-anchor", "middle")
// 				.attr("font-family",'Source Sans Pro')
// 				.text(function(d){return d[1]});


// 	})
// }

})