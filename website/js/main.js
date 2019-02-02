$(document).ready(function() {



// const datasetDict ={'order_to_repair_vacate_orders':'Order to Repair or Vacate'}



// ///////////////////////////////
// initialize NTA dropdown /////
// ///////////////////////////////
var $ntaDropdown = $("#neighborhoodDropdown");

$ntaDropdown.empty();

$.getJSON( 'https://wxu-carto.carto.com/api/v2/sql?q=SELECT ntaname,ntacode FROM nynta_4326 order by ntaname',function(data){
	d = data['rows']
	$ntaDropdown.append($('<option selected="selected" value="NYC">NYC</option>'))
	$.each( d, function( key, val ) {
		$ntaDropdown.append($(' <option value="'+val['ntacode']+'">'+val['ntaname']+'</option>'))
		
		})
	}

)

// ///////////////////////////////
// initialize dataset dropdown ///
// ///////////////////////////////
var $datasetDropdown = $("#datasetDropdown");

$.each( datasetDict, function( key, val ) {
		$datasetDropdown.append($(' <option value="'+key+'">'+val['name']+'</option>'))
		
		})

$("#datasetDropdown").dropdown('set selected', 'threeoneone_2010_2018')
$("#neighborhoodDropdown").dropdown('set selected', [''])
updateTable()


$datasetDropdown.dropdown('setting','onChange',function(){updateTable()});
    //datasetDropdown.dropdown('setting','onChange',function(){
$ntaDropdown.dropdown('setting', 'onChange',function(){updateTable()});


function updateTable(){
  	dataset = $("#datasetDropdown").dropdown("get value") 	
    ntaList = $("#neighborhoodDropdown").dropdown("get value") 

    conditional=''
	$.each(ntaList,function(k,v){
		conditional = conditional + ` a.ntacode ='${v}' or`
	})
	  conditional = conditional.slice(0,-3)
	//   console.log(conditional)
    groupby_cat = datasetDict[dataset]['groupby_cat']	
//   sql= `https://wxu-carto.carto.com/api/v2/sql?q=SELECT ${datasetDict[dataset]['groupby_count']},count(*),count(*)/b.population_2016 as perpop,  (*)/c.nta_count as per_nta FROM "wxu-carto".${dataset} as a, (select ntacode, count(*) as nta_count from "wxu-carto".${dataset} group by ntacade) as c,"wxu-carto".nynta_4326 as b where ( ${conditional} ) and a.ntacode = b.ntacode group by b.population_2016 , ${datasetDict[dataset]['groupby_count']}`
  //sql = `https://wxu-carto.carto.com/api/v2/sql?q=select a.*, to_char(cast(a.count_per_type as decimal)/b.count_nta*100,'999D99%25') type_percentage, b.count_nta from (SELECT a.ntacode,b.ntaname, a.${groupby_cat},count(*) count_per_type ,to_char( count(*)/b.population_2016*100,'999D99%25') as perpop  FROM "wxu-carto".${dataset} as a, "wxu-carto".nynta_4326 as b where a.ntacode = b.ntacode group by b.population_2016 , a.ntacode,b.ntaname, a.${datasetDict[dataset]['groupby_cat']} order by ntaname,${datasetDict[dataset]['groupby_cat']}) as a,(SELECT a.ntacode,b.ntaname,count(*) count_nta,count(*)/b.population_2016 as perpop  FROM "wxu-carto".${dataset} as a, "wxu-carto".nynta_4326 as b where a.ntacode = b.ntacode group by b.population_2016 , a.ntacode,b.ntaname) as b where a.ntacode = b.ntacode and (${conditional} )`
   var sql = `https://wxu-carto.carto.com/api/v2/sql?q=select a.*, to_char(cast(a.count_per_type as decimal)/b.count_nta*100,'999D99%25') type_percentage, b.count_nta from (select * from (select a.*, rank() OVER (PARTITION BY ntacode ORDER BY count_per_type DESC ) as rank from (SELECT a.ntacode,b.ntaname, a.${datasetDict[dataset]['groupby_cat']}, count(*) count_per_type, to_char( count(*)/b.population_2016*100,'999D99%25') as perpop FROM  "wxu-carto".${dataset} as a, "wxu-carto".nynta_4326 as b where a.ntacode = b.ntacode group by b.population_2016, a.ntacode,b.ntaname, a.${datasetDict[dataset]['groupby_cat']} order by ntaname,${datasetDict[dataset]['groupby_cat']}) as a ) as t where t.rank<=5 )as a,(SELECT a.ntacode,b.ntaname,count(*) count_nta,count(*)/b.population_2016 as perpop  FROM "wxu-carto".${dataset} as a, "wxu-carto".nynta_4326 as b where a.ntacode = b.ntacode group by b.population_2016 , a.ntacode,b.ntaname) as b where a.ntacode = b.ntacode and (${conditional} )`
   if (dataset.includes('acs')){
	sql = `SELECT a.*, b.ntaname FROM ${dataset} as a, nynta4326 as b WHERE b.ntacode = a.ntacode AND (${conditional} )`
	// FOR NOW just remove the table...
	// TO DO: add the ACS data table 
	$('#table-container').html("")
	return
   }  
   console.log('Chart Query', sql); 
	list = {}
	$.getJSON(sql,function(data){
		  d = data['rows']
		//   console.log('the data!')
  	  	vallist = {}
      
        $.each(d[0],function(j,k){
  			vallist[j] = []
	  			// console.log("val list creation",vallist[j] )
				})
		
			dict_keys = Object.keys(d[0])
			
			// For each row in the data
			$.each( d, function( i, row ) {
				
				// for each of the columns, push the elemtn 
				// console.log(row);
				$.map(row,function(val,i){
					vallist[i].push(val)
					// console.log(val,i);
				})

			})
			maxCols = 25
			vallist = $.each(vallist,function(key,val){
				vallist[key] = val.slice(0,maxCols)
				// console.log(vallist[key])
			})
			// vallist =vallist.slice(0,3)

			let header = '<thead><th></th>'
            // Make the header span the number of columns that exists for that
            // category
//            ntanameNew = $.unique(vallist.ntaname);
            len_nta = {}
            $.each(vallist.ntaname,function(i,v){
              len_nta[v] =  $.grep(vallist['ntaname'],function(n,i){
                if( n ==v){
                return n}
              }).length
            })

            $.each(len_nta, function(k, v){
			    //len_nta = $.grep(vallist['ntaname'],function(n,i){
                //if( n ==value)
                //return n}).length
                header += `<th colspan="${v}">${k}</th>`
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
			
			$('#table-container').html(table)
			})
			
	};
})
