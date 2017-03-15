//=================================================
//=================================================
// WORK IN PROGRESS SHIT!!!!!!
//=================================================
//=================================================
// pick your task: put your name next to a function that needs work
// Front End -- Megan
// event listener -- Hoang
// debugging hoang's shit -- Hoang
// breweryDB handler -- Lauren
// display text -- Rose/Meg
// gmaps handler -- Lauren
// 
// 
// 
// 
// 
//=================================================
//=================================================
// OPTIONAL SHIT!!!!!!
//=================================================
//=================================================
// 
// Features to add:
// animations! (bubbles and hover effects)
//      on hover event for beer type divs
//      fade in the display menu
// beer description (beerspot)
// beer specs and taste (breweryDB(database algorithm?))
// search for another beer button
// timer-based "fuck me up fam" button
// temporary DOM filler for while the API is loading
// more cool design elements:
//      shading and shadows
// moments.js - if after midnight, have a bunch of divs fade in
//              and ask them if they're sure about what they're
//              about to be doing
// easter eggs: certain bubbles from above animation be clickable with random 
//              beer facts, random facts about the developers (us!)
// uber link? button? thingy (contact lyft/uber for a free ride code for users)
//=================================================







//=================================================
// event listener
// listens to click event from the big div with all the beer types
// dynamically generates the "menu" style thing at the bottom
//=================================================
$("#beer").on("click", "#dark", onClick("light"));
$("#beer").on("click", "#medium", onClick("medium"));
$("#beer").on("click", "#light", onClick("light"));



function onClick(beerType){
    
    // zip handler
    var zip = parseZip();
    if(zip==false){
        //error message
    }

    // google caller (zip code)
    var locations = callMap(zip);
    
    // brewerydb confirm (location obj, beer type)
    var brewery = confirmBrewery(locations);
    
    // brewerydb beer finder
    var beers = findBrew( brewery.name, beerType);

    // display shit (location obj, beer name)
    displayInfo(brewery,beers);

    // map display (location obj)
	displayMap(brewery.address[brewery.index]);
}







//=================================================
// zip handler
// takes input from event listener
// returns an int containing the zip code
// optional: empty input pulls location of device
//=================================================

function parseZip(){
    // take zip code
    var zip = $("#ex3").val();
    // check if a legit zip code
    if(zip.length != 5 || !isNaN(zip)){
        return false;
    }
    zip = parseInt(zip);
    // return zip
    return zip;
}
    


    
//=================================================
// google places caller
// takes a 5-digit int or string, must be valid zip code
// returns an obj containing name and address of highest-rated nearby breweries
// return obj = { name : [String], address : [String], rate : [String]}
// api key:AIzaSyDwJEzk5FbNL1fwKBxifUONzQMvDdYShqs
// //=================================================

function callMap(zip){
var longitude;
var latitude;
var ret;

//get location data
$.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?address="+ zip
    +"&key=AIzaSyDwJEzk5FbNL1fwKBxifUONzQMvDdYShqs",
    method: "GET"
	}).done(function(response){
	    //get latitude/longitude points from zip code
		latitude = response.results[0].geometry.location.lat;
		longitude = response.results[0].geometry.location.lng;
		
		//set up google map for query
		var loc = new google.maps.LatLng(latitude, longitude);
		var map = google.maps.Map(document.getElementById('map'), {
		    center: loc,
		    zoom: 4
		  });
		  
		//query specs : location: based on zip, radius: 5km, term: brewery
		var request = {
		    location: loc,
		    radius: '5000',
			query: 'brewery',
			type: 'brewery'
		};

		//google places library call
		var service = new google.maps.places.PlacesService(map);
		service.textSearch(request, function(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				var rate = [0,0,0];
				var theSpot = ["","",""];
				var address = ["","",""];
				//find highest rated brewery
			    for (var i = 0; i < results.length; i++) {
			    	//check rating
		    		for(var j=0; j<3; j++){
			    		if(rate[j]<results[i].rating){
			    			//last check
			    			if(j==2){
			    			rate[j] = results[i].rating;
							address[j] = results[i].formatted_address;
							theSpot[j] = results[i].name;
			    			}
			    			//middle check
			    			else if( j==1){
				    			rate[j+1] = rate[j];
				    			address[j+1] = address[j];
				    			theSpot[j+1] = theSpot [j];
				    			rate[j] = results[i].rating;
								address[j] = results[i].formatted_address;
								theSpot[j] = results[i].name;
							}
							//highest rated!!
							else{
								rate[j+2] = rate[j+1];
				    			address[j+2] = address[j+1];
				    			theSpot[j+2] = theSpot [j+1];
				    			rate[j+1] = rate[j];
				    			address[j+1] = address[j];
				    			theSpot[j+1] = theSpot [j];
				    			rate[j] = results[i].rating;
								address[j] = results[i].formatted_address;
								theSpot[j] = results[i].name;									
							}
							break;
			    		}
			    	}
			    }
			    //build out return obj
			    ret = { name: theSpot, address: address, rating: rate };
			    return ret;
			  }
		});

	});

}







//=================================================
// breweryDB brewery confirm
// takes obj from callMap function
// object type taken = { address:[string], name:[string], rating:[string]}
// returns object with brewery name as String, brewery address as String, brewery rating as float and index of brewery
// return format obj = { Name: name, address: address, rating: #.#, index: #}
// BreweryDB API Key:  8a2157f57773e1804749e5370a40a584
//=================================================
function confirmBrewery(breweries){
//search BreweryDB API for breweries matching top rated
$.ajax({
    url: "http://api.brewerydb.com/v2/locations?key='8a2157f57773e1804749e5370a40a584'&postalCode=" + zip,
    method: "GET",
    crossDomain: true,
    dataType: 'json',
	success: function(response){
		//loop through breweries in response data
		for(var i = 0; i<response.data.length; i++){
			//loop through breweries in input data
			for(var j = 0; j < breweries.name.length ; j++){
				//if response.name == breweries.name[i]
				if(response.data[i].name == breweries.name[j]){
					//build out return obj
					var ret = { name: breweries.name[j], address: breweries.address[j], rating: breweries.rating[i], index:i};
					//return
					return ret;
				}
			}
		}
	},
	//error msg
	error: function (error) {
               console.log(error);
    }
});
}















//=================================================
// breweryDB handler
// takes brewery name in string form
// returns beer name
// BreweryDB API Key:  8a2157f57773e1804749e5370a40a584
//=================================================

    // ajax call to beerspot
        //get a beer of the type we want










//=================================================
// display shit
// takes brewery obj from yelp and beer name from beerspot
// no return, displays stuff on the DOM
// future features: beer description, specs + taste
//=================================================
function displayInfo(){
    //display beer name
    //display brewery name
    //display address
    //uber button
        // optional: passes address data from yelp obj
}
    
    
    
    
//=================================================
// display map
// takes address
// no return, displays map on the DOM
// Google Maps API Key: AIzaSyBiS9ErA4DRXHTheds5mVXS45lyf5lpbcs
//=================================================

function displayMap(address){
	var place = encodeURI(address);
	var latlong = {
        	lat: response.results[0].geometry.location.lat,
			lng : response.results[0].geometry.location.lng
        };
	var map = google.maps.Map(document.getElementById('map'), {
		    center: latlong,
		    zoom: 4
		  });
	var marker = new google.maps.Marker({
          position: latlong,
          map: map
        });
}


