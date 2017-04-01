//=================================================
//=================================================
// WORK IN PROGRESS SHIT!!!!!!
//=================================================
//=================================================
// pick your task: put your name next to a function that needs work
// Front End -- Meg/Rose
// event listener -- Hoang/Lauren
// debugging everything -- Hoang/Lauren
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
//various variables
//holds variables for brewery object, beers object, beer type, zip code
//=================================================
var output = {
	brewery: {},
	confirmedBrewery: null,
	beers: {},
	beerType: "",
	zip : 92110
};




//=================================================
// event listener
// listens to click event from the big div with all the beer types
// dynamically generates the "menu" style thing at the bottom
//=================================================
$("#beers").on("click", "#dark", function(){
	onClick("dark");
	});

$("#beers").on("click", "#medium", function(){
	onClick("medium");
	});

$("#beers").on("click", "#light", function(){
	onClick("light");
	});

$("#beers").on("click", "#weird", function(){
	onClick("weird");
	});

$("#beers").on("click", "#cider", function(){
	onClick("cider");
	});




function onClick(beerType){
    output.beerType = beerType;

    // zip handler
    output.zip = parseZip();
    if(output.zip==false){
        //error message
    }
    
    //deferred function shit, find yo brewery/beers
    map.findBreweries(output.zip).then(function(){
    	breweryDB.confirmBrewery().then(function(){
	    	var useIndex = (output.confirmedBrewery == null) ? 0 : output.confirmedBrewery;
		    // brewerydb beer finder
		    breweryDB.beerLookup(output.brewery.name[useIndex], output.beerType, function(){
		    	//display beer
		    	$("#brewery").empty();
		    	$("#brewery").html(output.brewery.name[useIndex]);
		    	$("#beer").empty();
		    	$("#beer").html(output.beers[0].name);
		    	$("#description").empty();
		    	$("#description").html(output.beers[0].style.description);
		    	$("#description").append("<br>");
		    	$("#description").append("Rating: " + output.brewery.rating[0]);
		    	$("#abv").empty();
		    	$("#abv").html("abv: " + output.beers[0].abv + "%");
		    	$("#ibu").empty();
		    	$("#ibu").html("ibu: " + output.beers[0].style.ibuMax);
		    	$("#beerType").empty();
		    	$("#beerType").html("Type: " + output.beers[0].style.category.name);
		    	$("#details").empty();
		    	$("#details").html(output.beers[0].description);
		    	$("#address").empty();
		    	$("#address").append(output.brewery.address[useIndex]);
		    	// map display (location obj)
				map.displayMap(output.brewery.address[useIndex]);
			});
	    });
    });
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
    if(zip.length != 5 || isNaN(zip)){
        return false;
    }
    zip = parseInt(zip);
    // return zip
    return zip;
}


//=================================================
// breweryDB obj
// BreweryDB API Key:  8a2157f57773e1804749e5370a40a584
// This calls the BreweryDB API with the parameters set by the user (light, med,
//	or dark)
// Returns an array of three beers from nearby brewery that are suitable for the
//	type the user specifies (light, med, or dark)
//=================================================

var breweryDB = {
    breweryKey: "7f075813ee83da31d58608f5b808f31d",
    brewQueryURL: "https://api.brewerydb.com/v2/search?&format=json&",
    
    
    beerLookup: function(googleResult, beerType, cb) {
        // googleResult = data from zip code search + brewerydb brewery search
        // beerType needs to be light, medium, or dark
        // cb is a function that accepts one argument; cb is called with an array of top three beers
            // if there is an error, cb is called with false instead of an array
        var queryURL = this.brewQueryURL + $.param({ 
            key: this.breweryKey, 
            q: googleResult, 
            type: "beer", 
        });
	    //googleResult is the var that holds result that comes back from Google search/BreweryDB location search
	    // below is weird ajax call Peter drummed up for me
	    var self = this;
        $.ajax({
        	 method: "POST",
			  dataType: "json",
			  url: "https://proxy-cbc.herokuapp.com/proxy",
			  data: {
			  	url: queryURL
			  },
            success: function (response) {
                var brewResults = response;
                var userSearch = brewResults.data.data;
                
                if (self.beerTypes.hasOwnProperty(beerType)) {
                    // empty array to hold top three results
                    var indexArray = [];
                	// looping through results to return data specified by user
                    for (var i = 0; i < userSearch.length; i++) {
                        if (typeof userSearch[i].style == "object" && userSearch[i].style.hasOwnProperty('name')) {
                            indexArray.push(userSearch[i]);   
                            if (indexArray.length >= 3) {
                                break;

                            }
                        }
                    }
                    output.beers = indexArray;
                    cb(indexArray);
                }

            },
            error: function(e) {
               cb(false);
            }
        });
    },
    beerTypes: {
        light: ["Belgian-Style Blonde Ale", "Belgian-Style Tripel", "Belgian-Style Pale Ale", "Belgian-Style Pale Strong Ale", "Belgian-Style White (or Wit) / Belgian-Style Wheat", "French & Belgian-Style Saison", "Classic English-Style Pale Ale", "English-Style India Pale Ale", "English-Style Summer Ale", "Contemporary Gose", "German-Style Kölsch / Köln-Style Kölsch", "Berliner-Style Weisse (Wheat)", "Leipzig-Style Gose", "South German-Style Hefeweizen / Hefeweissbier", "South German-Style Kristall Weizen / Kristall Weissbier", "German-Style Leichtes Weizen / Weissbier", "Kellerbier (Cellar beer) or Zwickelbier - Ale", "American-Style Pale Ale", "Fresh 'Wet' Hop Ale", "Pale American-Belgo-Style Ale", "Golden or Blonde Ale", "American-Style Sour Ale", "Session India Pale Ale", "German-Style Pilsener", "Bohemian-Style Pilsener", "German-Style Leichtbier", "Münchner (Munich)-Style Helles", "Dortmunder / European-Style Export", "Vienna-Style Lager", "Kellerbier (Cellar beer) or Zwickelbier - Lager", "American-Style Cream Ale or Lager", "Session Beer", "Light American Wheat Ale or Lager with Yeast", "Light American Wheat Ale or Lager without Yeast", "Fruit Wheat Ale or Lager with or without Yeast", "Ginjo Beer or Sake-Yeast Beer", "International-Style Pilsener", "Dry Lager", "American-Style Lager", "American-Style Light (Low Calorie) Lager", "American-Style Low-Carbohydrate Light Lager", "American-Style Pilsener", "American-Style Premium Lager", "American-Style Ice Lager", "Australasian, Latin American or Tropical-Style Light Lager"],
        medium: ["Belgian-Style Flanders Oud Bruin or Oud Red Ales", "Belgian-Style Dubbel", "Belgian-Style Quadrupel", "Belgian-Style Dark Strong Ale", "Belgian-Style Table Beer", "Other Belgian-Style Ales", "French-Style Bière de Garde", "English-Style India Pale Ale", "Ordinary Bitter", "Special Bitter or Best Bitter", "Extra Special Bitter", "Scottish-Style Heavy Ale", "English-Style Brown Ale", "Scottish-Style Light Ale", "Scottish-Style Export Ale", "English-Style Pale Mild Ale", "Old Ale", "Strong Ale", "British-Style Barley Wine Ale", "Double Red Ale", "South German-Style Bernsteinfarbenes Weizen / Weissbier", "South German-Style Weizenbock / Weissbock", "German-Style Altbier", "Adambier", "International-Style Pale Ale", "Australian-Style Pale Ale", "Irish-Style Red Ale", "Dark American-Belgo-Style Ale", "American-Style Strong Pale Ale", "American-Style India Pale Ale", "Imperial or Double India Pale Ale", "American-Style Amber/Red Ale", "Imperial Red Ale", "American-Style Barley Wine Ale", "American-Style Wheat Wine Ale", "American-Style Brown Ale", "Bohemian-Style Pilsener", "German-Style Märzen", "German-Style Oktoberfest / Wiesen (Meadow)", "Bamberg-Style Märzen Rauchbier", "Bamberg-Style Helles Rauchbier", "Bamberg-Style Bock Rauchbier", "Traditional German-Style Bock", "German-Style Heller Bock/Maibock", "German-Style Doppelbock", "California Common Beer", "Rye Ale or Lager with or without Yeast", "German-Style Rye Ale (Roggenbier) with or without Yeast", "Pumpkin Beer", "Wood- and Barrel-Aged Pale to Amber Beer", "Wood- and Barrel-Aged Strong Beer", "Wood- and Barrel-Aged Beer", "Aged Beer (Ale or Lager)", "Other Strong Ale or Lager", "American-Style Malt Liquor", "American-Style Amber Lager", "American-Style Märzen / Oktoberfest", "Grodziskie", "Dutch-Style Kuit, Kuyt or Koyt"],
        dark: ["British-Style Imperial Stout", "Brown Porter", "Robust Porter", "Sweet or Cream Stout", "Oatmeal Stout", "South German-Style Dunkel Weizen / Dunkel Weissbier", "Bamberg-Style Weiss (Smoke) Rauchbier (Dunkel or Helles)", "Classic Irish-Style Dry Stout", "Foreign (Export)-Style Stout", "Smoke Porter", "American-Style Black Ale", "American-Style Stout", "American-Style Imperial Stout", "Specialty Stouts", "American-Style Imperial Porter", "European-Style Dark / Münchner Dunkel", "German-Style Schwarzbier", "German-Style Eisbock", "Dark American Wheat Ale or Lager with Yeast", "Dark American Wheat Ale or Lager without Yeast", "Chocolate / Cocoa-Flavored Beer", "Coffee-Flavored Beer", "Smoke Beer (Lager or Ale)", "Wood- and Barrel-Aged Dark Beer", "American-Style Dark Lager", "Baltic-Style Porter"],
        weird: ["Brett Beer", "Fruit Wheat Ale or Lager with or without Yeast", "Fruit Beer", "Field Beer", "Herb and Spice Beer", "Specialty Beer", "Specialty Honey Lager or Ale", "Gluten-Free Beer", "Indigenous Beer (Lager or Ale)", "Experimental Beer (Lager or Ale)", "Historical Beer", "Wood- and Barrel-Aged Sour Beer", "Non-Alcoholic (Beer) Malt Beverages", "Belgian-style Fruit Beer", "Chili Pepper Beer", "Mixed Culture Brett Beer", "Wild Beer", "Flavored Malt Beverage", "Energy Enhanced Malt Beverage", "Belgian-Style Lambic", "Belgian-Style Gueuze Lambic", "Belgian-Style Fruit Lambic", "Braggot", "Metheglin", "Pyment (Grape Melomel)", "Other Fruit Melomel", "Sweet Mead", "Semi-Sweet Mead", "Dry Mead6"],
        cider:["Common Cider", "English Cider", "French Cider", "New England Cider", "Fruit Cider", "Apple Wine", "Common Perry", "Traditional Perry", "Other Specialty Cider or Perry", "Cyser (Apple Melomel)"]
    },
    
//=================================================
// breweryDB brewery confirm
// takes obj from callMap function
// object type taken = { address:[string], name:[string], rating:[string]}
// returns object with brewery name as String, brewery address as String, brewery rating as float and index of brewery
// return format obj = { Name: name, address: address, rating: #.#, index: #}
//=================================================
confirmBrewery: function(){
//search BreweryDB API for breweries matching top rated
	return $.ajax({
		method: "POST",
		dataType: "json",
		url: "https://proxy-cbc.herokuapp.com/proxy",
		data: {
	   		url: "http://api.brewerydb.com/v2/locations?key=7f075813ee83da31d58608f5b808f31d&postalCode=" + output.zip
	  	}
	})
		.done(function(response){
			//loop through breweries in response data
			for(var i = 0; i<response.data.data.length; i++){
				//loop through breweries in input data
				for(var j = 0; j < output.brewery.name.length ; j++){
					//if response.name == breweries.name[i]
					if(response.data.data[i].name == output.brewery.name[j]){
						//build out return obj
						var ret = { name: output.brewery.name[j],
									address: output.brewery.address[j],
									rating: output.brewery.rating[i],
									index:i
						};
						//return
						output.confirmedBrewery = j;
						return true;
					}
					else{
						return false;
					}
				}
			}
			if(output.confirmedBrewery == undefined){
				output.confirmedBrewery = {
					name: "Unable to Find a brewery",
					address: "Unable to Find a brewery",
					rating: 0,
					index:0
				}
			}
		});
	}
}



//=================================================
// google maps obj
// has 3 functions: initialize the map, search for breweries and display the results map
// has 1 property: theMap -- map obj for google API
//=================================================
var map = {

	theMap: new google.maps.Map(document.getElementById('map'), {
		  zoom: 15,
		  //default map - locates 92110
		  center: {lat: 32.7657, lng: -117.2}
		}),
	pos: {lat: 32.7657, lng: -117.2},
	marker: new google.maps.Marker({
		          position: this.pos,
		          map: this.theMap
		        }),
//=================================================
// initialize map
// generates default map view
// no return, displays map on the DOM
//=================================================	
	initMap: function() {
		//pull geolocation data from device;
		if (navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(function(position) {
		    map.pos = {
		      lat: position.coords.latitude,
		      lng: position.coords.longitude
		    };
			map.theMap.setCenter(map.pos);
		  }, function() {
		    handleLocationError(true, infoWindow, map.theMap.getCenter());
		  });
		}
	},
	
//=================================================
// display map
// takes address
// no return, displays map on the DOM
// Google Maps API Key: AIzaSyBiS9ErA4DRXHTheds5mVXS45lyf5lpbcs
//=================================================

	displayMap: function (address){
		var place = encodeURI(address);
		$.ajax({
		    url: "https://maps.googleapis.com/maps/api/geocode/json?address="+ place
		    +"&key=AIzaSyDwJEzk5FbNL1fwKBxifUONzQMvDdYShqs",
		    method: "GET"
		}).done(function(response){
		    //get latitude/longitude points from zip code
			var latlong = {
				lat: response.results[0].geometry.location.lat,
				lng: response.results[0].geometry.location.lng
			};
			
			//google maps shenanigams - display new marker
			this.theMap.setCenter( latlong.lat, latlong.lng);
			var marker1 = new google.maps.Marker({
		          position: latlong,
		          map: map.theMap
		        });
		});
	},

//=================================================
// google places caller
// takes a 5-digit int or string, must be valid zip code
// returns an obj containing name and address of highest-rated nearby breweries
// return obj = { name : [String], address : [String], rate : [String]}
// api key:AIzaSyDwJEzk5FbNL1fwKBxifUONzQMvDdYShqs
// //=================================================
	
	findBreweries: function(zip){
		var longitude;
		var latitude;
		var ret;
		
		//get location data
		return $.ajax({
		    url: "https://maps.googleapis.com/maps/api/geocode/json?address="+ zip
		    +"&key=AIzaSyDwJEzk5FbNL1fwKBxifUONzQMvDdYShqs",
		    method: "GET"
			}).done(function(response){
			    //get latitude/longitude points from zip code
				latitude = response.results[0].geometry.location.lat;
				longitude = response.results[0].geometry.location.lng;
				
				//set up google map for query
				var loc = new google.maps.LatLng(latitude, longitude);
				this.theMap = new google.maps.Map(document.getElementById('map'), {
				    center: loc,
				    zoom: 15
				  });
				  
				//query specs : location: based on zip, radius: 5km, term: brewery
				var request = {
				    location: loc,
				    radius: '5000',
					query: 'brewery',
					type: 'brewery'
				};
		
				//google places library call
				var service = new google.maps.places.PlacesService(map.theMap);
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
					    output.brewery = { name: theSpot, address: address, rating: rate };
					    return true;
						}
				});
			});
	}
}

var initMap = map.initMap();