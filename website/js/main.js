$(document).ready(function() {



// const datasetDict ={'order_to_repair_vacate_orders':'Order to Repair or Vacate'}



// ///////////////////////////////
// initialize NTA dropdown /////
// ///////////////////////////////
var $ntaDropdown = $("#neighborhoodDropdown");
$('#neighborhoodDropdown').dropdown();
// var ntaDropdown = cities[parseInt(year)].sort();

$ntaDropdown.empty();
// $.each(cityList, function() {

$.getJSON( 'https://wxu-carto.carto.com/api/v2/sql?q=SELECT ntaname,ntacode FROM nynta_4326 order by ntaname',function(data){
	d = data['rows']
	$ntaDropdown.append($('<option value="NYC">NYC</option>'))
	$.each( d, function( key, val ) {
		$ntaDropdown.append($(' <option value="'+val['ntacode']+'">'+val['ntaname']+'</option>'))
		
		})
	}

)

// ///////////////////////////////
// initialize dataset dropdown ///
// ///////////////////////////////
var $datasetDropdown = $("#datasetDropdown");
$('#datasetDropdown').dropdown();

$.each( datasetDict, function( key, val ) {
		$datasetDropdown.append($(' <option value="'+key+'">'+val['name']+'</option>'))
		
		})

$datasetDropdown.dropdown('setting','onChange',function(){
	dataset = $("#datasetDropdown").dropdown("get value") 

	$ntaDropdown.dropdown('setting', 'onChange', function(){
		ntaList = $("#neighborhoodDropdown").dropdown("get value") 
		


		conditional=''
		$.each(ntaList,function(k,v){
			conditional = conditional + ` a.ntacode ='${v}' or`
		})
		conditional = conditional.slice(0,-3)
		// sql= `https://wxu-carto.carto.com/api/v2/sql?q=SELECT count(*), count(*)/100::float as fake_percentage, a.ntacode,b.ntaname FROM "wxu-carto".${dataset} as a, "wxu-carto".nynta_4326 as b where ( ${conditional} ) and a.ntacode = b.ntacode group by a.ntacode,b.ntaname 	 `
		sql= `https://wxu-carto.carto.com/api/v2/sql?q=SELECT ${datasetDict[dataset]['groupby_count']},count(*),count(*)/b.population_2016 as perpop  FROM "wxu-carto".${dataset} as a, "wxu-carto".nynta_4326 as b where ( ${conditional} ) and a.ntacode = b.ntacode group by b.population_2016 , ${datasetDict[dataset]['groupby_count']}`
		list = {}

		$.getJSON( sql,function(data){
			d = data['rows']
			// console.log(d.length)
			
			vallist = {}
			$.each(d[0],function(j,k){
					vallist[j] = []
					// console.log("val list creation",vallist[j] )
				})
		
			

			dict_keys = Object.keys(d[0])
			console.log("val list is", vallist);


			
			// For each row in the data
			$.each( d, function( i, row ) {
				// Create an empty list with the columns of our query
				

				//For each of the columns, create an empty list
				
				// for each of the columns, push the elemtn 
				// console.log(row);
				$.map(row,function(val,i){
					vallist[i].push(val)
				
					// console.log(val,i);
				})

				
			})
			maxCols = 5
			vallist = $.each(vallist,function(key,val){
				vallist[key] = val.slice(0,maxCols)
				console.log(vallist[key])
			})
			// vallist =vallist.slice(0,3)


			let header = '<thead><th></th>'
			$.each(vallist.ntaname, function(index, value){
				header += `<th>${value}</th>`
			})
			header += '</thead>'
			
			let body = '<tbody>'
			
			$.each( vallist, function( key, val ) {
				if (key !== 'ntaname' && key !== 'ntacode'){
					let tr = `<tr>`
					tr += `<td>${key}</td>`
					$.each(val,function(k,v){
						tr =tr +`<td>${v}</td>`
					})


					tr = tr+`</tr>`
					body += tr
				}
			})

			body += '</tbody>'

			const table = '<table class="ui selectable celled table">' + header + body + '</table>'
			console.log(table)
			
			$('#table-container').html(table)
			})
				
			// // 	})
			// console.log(list);	
			}

		)
		// console.log(list);	

	});
})