
	//var randomNumbers = ["abc","def","ghi","jkl","mno"]
	//var randomNumbers = ["bench-press","deadlift","squat"]
	var randomNumbers = []
	var pickedNumbers = []
	var numDropdowns = 3

    var gender = "men"
	var bodyWeight  = 110


  
  hideMap = new Map()  


  function anyEmpty(){
	  for (n=0; n<numDropdowns; n++){
			l = randomNumbers[$("#select"+n).val()]
			w = $("#text"+n).val()
			if (!(l&&w)) return true
	  }
	  return false
	  
  }


  //red if empty
  //check if any empty before populating
  function repopulateDataMap(){
	  
	  //TODO UNCOMMENT
	  //if (anyEmpty()) return
	  
	  //clear map
	  dataMap = {} 
	  
	  //loop through all selects
	  	for (n=0; n<numDropdowns; n++){
			l = randomNumbers[$("#select"+n).val()]
			w = $("#text"+n).val()
			//if dropdown or textbox empty, ignore
			if(!(l) || !(w)) {
				//console.log("ignore")
				continue
			}
			//console.log("recalc")
			//console.log(l + " : " + w)
			addLift(n,l)
			setWeight(l,w)
		}
		
		var lb = []
		var dp = []
		
		for (var d in dataMap){
			//console.log(d)
			dp.push(dataMap[d]["scale"])
			lb.push(d)
		}
		
		radarChart.data.datasets[0].data =  dp
		radarChart.data.labels = lb
		radarChart.update()

  }
  


  function removeAlreadySelected(){
		//foreach in hidemap
		hideMap.forEach(function(value,key){
			if (value){
				//for each option where that option has value from hideMap
				$('.abc > option[value='+value+']').each(function(s){
					//if is the source of that value as shown by hidemap ignore
					if (hideMap.get($(this).parent().attr("id")) === this.value){
						//console.log("ignore")
					}else{
						//console.log("hiding")
						$(this).hide()
					}
				})
			}
		})
  }

  //after json file is loaded, add to all dropdowns
  function addOptionToAllSelectBoxes(j,v){
	  for (let i=0; i<numDropdowns; i++){
		$("#select"+i).append($('<option>').val(j).text(v))
	  }
  }
  
  //when new box is added, need to populate options
   function addAllOptionsToSelectBox(i){
	  for (let j=0; j<randomNumbers.length; j++){
		$("#select"+i).append($('<option>').val(j).text(randomNumbers[j]))
	  }
  }
  

/*  {
	  'gender' : 'men',
	  'bodyWeight' : 120,
	  'lifts' : ['bench-press','shoulder-press','dumbbell-fly','deadlift'],
	  'weights' : [100,200,300,400]
  }*/
  function getPostData(){

  	$("#select0 option:selected").text()
  	$("#text0").val()
  	liftsList = []
  	weightsList = []

  	for (let i=0; i<numDropdowns; i++){
		liftsList.push($("#select"+i+" option:selected").text())
  		weightsList.push($("#text"+i).val())
	}

  	return {
  	 'gender' : $("#gender option:selected").text(),
  	 'bodyWeight' : $("#bodyweight option:selected").text(),
  	 'lifts' : liftsList,
  	 'weights' : weightsList
  	}
  	


  }


  function removeSelectBox(i){
	  $("#select"+i).remove()
	  $('#text'+i).remove()
	  $('#label'+i).remove()
	  repopulateDataMap()
  }

  function addSelectBox(i){
	  
	  var formrow = $('<div>')
	  var col1 = $('<div>')
	  var col2 = $('<div>')
	  
	  formrow.addClass("form-row")
	  
	  col1.addClass("col")
	  col2.addClass("col")
	  
	  col1.append($('<select>').addClass("abc form-control").attr("id","select"+i))  //<select class="abc form-control" id ="select0"> <option value=""></option></select>
	  col2.append($('<input>').attr("type","number").attr("id","text"+i).addClass("form-control"))
	  
	  formrow.append(col1)
	  formrow.append(col2)
	  $("#selectForm").append(formrow)
	  $("#select"+i).append($('<option>').attr("value",""))



	  
	  /*$("#selectForm").append($('<label>').attr("for","select"+i).text("Select"+i).attr("id","label"+i)) //<label for="select0">Select 0</label>
	  $("#selectForm").append($('<select>').addClass("abc form-control").attr("id","select"+i))  //<select class="abc form-control" id ="select0"> <option value=""></option></select>
      $("#select"+i).append($('<option>').attr("value",""))
	  
	  $("#selectForm").append($('<label>').attr("for","text"+i).text("Text"+i))
	  $("#selectForm").append($('<input>').attr("type","number").attr("id","text"+i).addClass("form-control"))*/
	  

	  //for (j=0; j<randomNumbers.length; j++){
	  //	$("#select"+i).append($('<option>').val(j).text(randomNumbers[j]))
	  //}
	  
	  	//onchange listener to disable selections in other selects
		$('#select'+i).change(function(event) {

			//set key=event.target, value=selected value
			hideMap.set($(event.target).attr('id'),$(event.target).val())

			$('.abc > option').show() //show all
			removeAlreadySelected()
			repopulateDataMap()
			
		});
		
		//onchange for textbox
		$('#text'+i).change(function(event) {
			//console.log("text change" + i)
			//console.log( randomNumbers[$("#select"+i).val()] + " : " + $(event.target).val())
			repopulateDataMap()
		});
			
  }



		$("#bodyweight").change(function(event) {
			console.log("bodyweight")
			bodyWeight = $("#bodyweight option:selected").text()
			repopulateDataMap()
		})


startingInfo = 
  {
	  'gender' : 'men',
	  'bodyWeight' : 120,
	  'lifts' : ['bench-press','shoulder-press','dumbbell-fly','deadlift'],
	  'weights' : [100,200,300,400]
  }

    //onload
	$( document ).ready(function() {
		console.log( "ready!" );
		//generate select boxes
		numDropdowns = startingInfo["lifts"].length
		
		for (let i=0; i<numDropdowns; i++){
			addSelectBox(i)
		}	
		

		
		
		$.getJSON('./js/merge.json', function(jd) {
			
			scales = jd
			
			var k = 0
			Object.keys(jd).forEach(function(key){
			  randomNumbers.push(key)
			  addOptionToAllSelectBoxes(k,key)
			  k+=1
			})
			
			for (let i=0; i<numDropdowns; i++){
				$("#select"+i).val($.inArray(startingInfo["lifts"][i],randomNumbers)).change() //initialize, change to trigger event like it was manually changed
				$("#text"+i).val(startingInfo["weights"][i]).change() //initialize, change to trigger event like it was manually changed
			}	
	
			//set gender and repopulate weight list
			$("#gender").change(function(event) {
				$("#bodyweight").empty()
				if ($(event.target).val() == 0){ //men
					gender="men"
					sorted = Object.keys(scales[randomNumbers[0]]["men"]).map(Number).sort(function(a,b){return a < b})
					for (key in sorted){
						$("#bodyweight").append($('<option>').val(key).text(sorted[key]))
					}	
				}else{
					gender="women"
					sorted = Object.keys(scales[randomNumbers[0]]["women"]).map(Number).sort(function(a,b){return a < b})
					for (key in sorted){
						$("#bodyweight").append($('<option>').val(key).text(sorted[key]))
					}	
				}		
				repopulateDataMap()
			})
			
		$("#gender").change() //to force populate bodyweight list
		bodyWeightIndex = $('#bodyweight option').filter(function () { return $(this).html() == startingInfo["bodyWeight"]; }).val()
		$('#bodyweight').val(bodyWeightIndex).change()
		repopulateDataMap()	
		});

		
		


		
	});
	
	
	//blue button click 
	$("#btn1").click(function(event){
		console.log("click")
		addSelectBox(numDropdowns)
		numDropdowns += 1
		addAllOptionsToSelectBox(numDropdowns-1)
		removeAlreadySelected()
		
	})
	
	//red button click 
	$("#btn2").click(function(event){
		removeSelectBox(numDropdowns-1)
		hideMap.set("select" + (numDropdowns-1),"")
		//if removing a box that had something selected, need to refresh other dropdowns
		$('.abc > option').show() //show all
		removeAlreadySelected()
		numDropdowns -=1
	})
	

	//green button click 
	$("#btn3").click(function(event){
		var request = $.ajax({
		  url: "save",
		  type: "POST",
		  data: getPostData(),
		  //dataType: "html"
		});

		request.done(function(msg) {
		  $("#log").html( msg );
		});
	})


	function doScale(standards, yours){
	
		i = 0
		if (yours < standards[0]){return "-1"}
		//if (yours > standards[standards.length-1]){return "-2"}
		if (yours > standards[standards.length-1]){return "5"}
		
		for (i=0; i<standards.length-1; i++){
			if( yours >= standards[i] && yours < standards[i+1]){
				return i+(yours-standards[i])/(standards[i+1]-standards[i]);
			}
		}
		return i
	}

	
	scales = {}
	
	tiers = ["None","Beginner","Novice","Intermediate","Advanced","Elite"]


function containsLift(lift){
	for (var key in dataMap){
	  if (key == lift) return true
	}
	return false
}

function getWeightAtIndex(index){
	for (var key in dataMap){
	  if (dataMap[key]["index"] == index) return dataMap[key]["weight"]
	}
	return null
}

function getLiftAtIndex(index){
	for (var key in dataMap){
	  if (dataMap[key]["index"] == index) return key
	}
	return null
}


function addLift(index,lift){
   dataMap[lift] = {}
   dataMap[lift]["index"] = index
   
}

function removeLift(lift){
  currentIndex = getIndex(lift)
  delete dataMap[lift]
}

function setWeight(lift, weight){
   dataMap[lift]["weight"] = weight
   dataMap[lift]["scale"] = doScale(scales[lift][gender][bodyWeight],weight)
}

function setIndex(lift, index){
   dataMap[lift]["index"] = index
}

function getIndex(lift){
   return dataMap[lift]["index"]
}

function setScale(lift, scale){
   dataMap[lift]["scale"] = scale
}

function getScale(lift){
   return dataMap[lift]["scale"]
}

function roundUp(val){
	if (val == 5) return 5
	return Math.floor(val)+ 1
}

function roundDown(val){
	//if (val == 0) return 0
	//return Math.ceil(val)-1
	//if(val==5) return 5
	return roundUp(val)-1
}



var dataMap = {}






//CHART STUFF


var marksCanvas = document.getElementById("marksChart");

Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;

var marksData = {
  labels: [],
  datasets: [{
    label: [],
    data: [],
	backgroundColor: 'rgb(255, 99, 132,.2)',
    borderColor: 'rgb(255, 99, 132)',
    pointBackgroundColor: 'rgb(255, 99, 132)',
  },]
};

var chartOptions = {
	tooltips: {
      callbacks: {
		title: function(tooltipItem, data) {
		  index = tooltipItem[0]["index"]
		  scaledValue = data['datasets'][0]['data'][index]
		  thisTier = tiers[roundDown(scaledValue)]
		  //console.log(scaledValue)
		  //console.log(thisTier)
		  if (scaledValue == 5) return tiers[5]
		  return thisTier + " + " +((scaledValue%1)*100).toFixed(2) + "%"
        },
        label: function(tooltipItem, data) {
		  //console.log(tooltipItem)
		  //console.log(data)
          return getWeightAtIndex(tooltipItem["index"]);
        },
		afterLabel: function(tooltipItem, data) {

		  index = tooltipItem["index"]
		  scaledValue = data['datasets'][0]['data'][tooltipItem["index"]]
		  up = roundUp(scaledValue)
		  down = roundDown(scaledValue)
		  if (scaledValue == 5) return tiers[5] +" " +scales[getLiftAtIndex(index)][gender][bodyWeight][5]
          return tiers[down] +" " +scales[getLiftAtIndex(index)][gender][bodyWeight][down] + "\n" + tiers[up] +" " + scales[getLiftAtIndex(index)][gender][bodyWeight][up];
        },
	  }
	},
  scale: {
    ticks: {
      beginAtZero: true,
      min: 0,
      max: 5,
      stepSize: 1
    },
    pointLabels: {
      fontSize: 18
    }
  },
  legend: {
    display: false
  },
  
};

var radarChart = new Chart(marksCanvas, {
  type: 'radar',
  data: marksData,
  options: chartOptions
});





















