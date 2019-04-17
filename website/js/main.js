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
$ntaDropdown.dropdown('setting', 'onChange',function(){updateTable()});


function updateTable(){
  	dataset = $("#datasetDropdown").dropdown("get value") 	
    ntaList = $("#neighborhoodDropdown").dropdown("get value") 

    conditional=''
	$.each(ntaList,function(k,v){
		conditional = conditional + ` a.ntacode ='${v}' or`
	})
	  conditional = conditional.slice(0,-3)

   groupby_cat = datasetDict[dataset]['groupby_cat']	
   // var nyc_sql = `https://wxu-carto.carto.com/api/v2/sql?q=SELECT a.primary_vacate_reason, count(*) count_per_type, sum(count(*)) over () as totals,to_char(cast(count(*) as decimal)/sum(count(*)) over () *100,'999D99%25') type_percentage, to_char(cast(count(*) as decimal)/13664290 *100,'999D99%25') perpop, rank() OVER (ORDER BY count(*) DESC ) as rank,13664290 as count_nta FROM "wxu-carto".${dataset} as a group by a.${datasetDict[dataset]['groupby_cat']}`
   var sql = `https://wxu-carto.carto.com/api/v2/sql?q=select a.ntaname::text,a.${datasetDict[dataset]['groupby_cat']}::text,a.count_per_type::int,a.perpop::text,a.rank::int, to_char(cast(a.count_per_type as decimal)/b.count_nta*100,'999D99%25') type_percentage, b.count_nta from (select * from (select a.*, rank() OVER (PARTITION BY ntacode ORDER BY count_per_type DESC ) as rank from (SELECT a.ntacode,b.ntaname, a.${datasetDict[dataset]['groupby_cat']}, count(*) count_per_type, to_char( count(*)/b.population_2016*100,'999D99%25') as perpop FROM  "wxu-carto".${dataset} as a, "wxu-carto".nynta_4326 as b where a.ntacode = b.ntacode group by b.population_2016, a.ntacode,b.ntaname, a.${datasetDict[dataset]['groupby_cat']} order by ntaname,${datasetDict[dataset]['groupby_cat']}) as a ) as t where t.rank<=5 )as a,(SELECT a.ntacode,b.ntaname,count(*) count_nta,count(*)/b.population_2016 as perpop  FROM "wxu-carto".${dataset} as a, "wxu-carto".nynta_4326 as b where a.ntacode = b.ntacode group by b.population_2016 , a.ntacode,b.ntaname) as b where a.ntacode = b.ntacode and (${conditional} )`
   

   if (ntaList.includes('NYC')){
   	console.log('true')
   	sql = sql + ` union select * from (SELECT  'Entire New York City' as ntaname,a.${datasetDict[dataset]['groupby_cat']},count(*) count_per_type, to_char(cast(count(*) as decimal)/13664290 *100,'999D99%25') perpop, rank() OVER (ORDER BY count(*) DESC ) as rank,to_char(cast(count(*) as decimal)/sum(count(*)) over () *100,'999D99%25') type_percentage, 13664290 as count_nta FROM  "wxu-carto".${dataset}  as a group by a.${datasetDict[dataset]['groupby_cat']}) as a where a.rank <=5 order by ntaname, rank`
   	console.log(sql)
   }
   

   if (dataset.includes('acs')){
	sql = `SELECT a.*, b.ntaname FROM ${dataset} as a, nynta4326 as b WHERE b.ntacode = a.ntacode AND (${conditional} )`
	// FOR NOW just remove the table...
	// TO DO: add the ACS data table 
	$('#table-container').html("")
	return
   }  
   // console.log('Chart Query', sql); 
	list = {}
	$.getJSON(sql,function(data){
		  d = data['rows']
  	  	vallist = {}
      
        $.each(d[0],function(j,k){
  			vallist[j] = []
				})
		
			dict_keys = Object.keys(d[0])
			
			// For each row in the data
			$.each( d, function( i, row ) {
				
				// for each of the columns, push the elemtn 
				$.map(row,function(val,i){
					vallist[i].push(val)
				})

			})
			maxCols = 25
			vallist = $.each(vallist,function(key,val){
				vallist[key] = val.slice(0,maxCols)
			})

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
