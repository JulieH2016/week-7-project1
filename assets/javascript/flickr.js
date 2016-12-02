// Set up two global variables that will be used in multiple functions
// globalName will hold the name of the particular point of interest
// that the user clicked on, while globalVicinity will hold its address
var globalName;
var globalVicinity;

// set up two global location related variables for use in weather functions
// they hold the latitude and longitude returned by the Google Maps geocoding API
// for the overal city or location
var globalLatitude = 0;
var globalLongitude = 0;

// set up two global locations related to the specific POI clicked by user
var globalPOILatitude = 0;
var globalPOILongitude = 0;

// function to save valid user locations
function saveLocation(receivedLocation) {

	// if we have no prior stored locations, then begin by pre-defining 5 locations
	if (localStorage.getItem("project1location1") === null) {
		localStorage.setItem("project1location5", "Orlando, FL");
		localStorage.setItem("project1location4", "New York, NY");
		localStorage.setItem("project1location3", "Los Angeles, CA");
		localStorage.setItem("project1location2", "Washington, DC");
		localStorage.setItem("project1location1", "Toronto, Ontario");
	} 

	// if the location passed in isn't already stored, then store it
	if ((receivedLocation !== localStorage.getItem("project1location1")) && (receivedLocation !== localStorage.getItem("project1location2")) && (receivedLocation !== localStorage.getItem("project1location3")) && (receivedLocation !== localStorage.getItem("project1location4")) && (receivedLocation !== localStorage.getItem("project1location5")) ) {
			// move stored position 4 to 5, 3 to 4, 2 to 3, 1 to 2, and new location in 1
			localStorage.setItem("project1location5", localStorage.getItem("project1location4"));
			localStorage.setItem("project1location4", localStorage.getItem("project1location3"));
			localStorage.setItem("project1location3", localStorage.getItem("project1location2"));
			localStorage.setItem("project1location2", localStorage.getItem("project1location1"));
			localStorage.setItem("project1location1", receivedLocation);
	}

    $("#savedLocations").html('<option value="' + localStorage.getItem("project1location1") + '">' + '<option value="' + localStorage.getItem("project1location2") + '">' + '<option value="' + localStorage.getItem("project1location3") + '">' + '<option value="' + localStorage.getItem("project1location4") + '">' + '<option value="' + localStorage.getItem("project1location5") + '">');

}

// run the saveLocation function once to establish some local storage locations
saveLocation("Orlando, FL");

// for testing, line below allows clearing out local storage. Uncomment and re-run if needed.
// localStorage.clear();

// Function to generate thumbnails of images at a location
// makes ajax call to Flickr API
function grabThumbnails (locationClick){

	// first clear out the thumbnails area
	clearThumbnailsArea();

	// then load a temporary loading animated gif in position 1
	loadingImage();
		
	// define userInput as the location being passed into the function
	var userInput = locationClick;

	// set up the Flickr API key
	var apiKey = 'e2ec4b363741a8dfb51716ed6e0322c5';

	// generate the Flickr ajax call url
	var apiUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + apiKey + '&tags=' + userInput + '&privacy_filter=1&safe_search=1&content_type=1&lat=' + globalPOILatitude +'&lon='+ globalPOILongitude +'&accuracy=16&extras=url_q%2C+url_z&per_page=100&format=json&nojsoncallback=1';

	// now that we have the url generated, let's make the ajax call
	$.ajax({url: apiUrl, method: 'GET'}).done(function(response){

		// let's log the response for testing purposes
		console.log("flickr API call returns:");
		console.log(response);

		// the call returns an object of 100 images. We want to randomly
		// pick 6 of them. To do this, we need a start location. For that
		// lets begin by picking a random number between 0 and the number
		// of returned images - 6. Returned images are stored in an array
		// at response.photos.photo[]. 

		// set up a variable that is the number of available images
		imagesAvailable = response.photos.photo.length;

		// we only want to display thumbnails if there are at least 6 images available
		// and the location wasn't "None". Google's API sometimes returns false positive
		// of "None" which will then generate unrelated flickr images
		if (imagesAvailable>6 && locationClick!="None") {

			// begin by clearing the thumbnails area
			clearThumbnailsArea();

			// and bring up the #photosDiv so we can show thumbnails
			$("#photosDiv").show();

			// load loading image gif until thumbnails load in all 6 thumbnail divs
			loading6Image();

			// display a reload images button first by generating its HTML
			var reloadButtonHTML = '<button type="submit" class="btn btn-danger" id="reloadButton">SHOW ME MORE!</button>'
			
			// then placing it within the reloadButtonDiv
			$("#reloadButtonDiv").html(reloadButtonHTML);

			// create an listener on the reload button
			$("#reloadButton").on("click", function() {

				// when reload button is pressed, reload thumbnail images
				displaySixThumbnails(imagesAvailable, response);

			});

			// display the 6 thumbnails
			displaySixThumbnails(imagesAvailable, response);

		// end of the if imagesAvailable >6 loop
		} else {

			// but if there aren't 6 images available, instead display a
			// no images available thumbnail
			clearThumbnailsArea();
			var imgDisplay = $('<img>');
			imgDisplay.attr('src', "assets/images/NoImageThumbnail.jpg");
			imgDisplay.addClass("myShowImage");
			$('#image1').html(imgDisplay);

			// make the #photosDiv visible so we can show the no photos image
			$("#photosDiv").show();

			// clear prior listeners
			$(".myShowImage").off("click");

			// create a listener for the "no photos" thumbnail we just drew
			$(".myShowImage").on("click", function() {

				// display the modal
				// first enter the name and address in the title after clearing the div
				$('#myModalLabel').empty();
				$('#myModalLabel').text(globalName + ", " + globalVicinity);

				// then link the title to the foursquare page if one exists
				foursquareCheck();

				// populate the content area with the larger version of the image
				$("#myModalPOIImage").html('<img src="assets/images/NoImageThumbnail.jpg" class="img-responsive" id="largerPOIimage" alt="location image">');

				// Now add in the miniMap built with the Google Static Maps API
				// first the Google APIs key
				var YOUR_API_KEY = "AIzaSyD4gTlyrAaD5wN9zit_lSKLiNIGWhgKtwc";

			    // location needs to be url escaped for calls
			    var urlEscapedLocation = encodeURIComponent(globalVicinity);
			    console.log("urlEscapedLocation is: " + urlEscapedLocation);

			    // name needs to be url escaped for calls
			    var urlEscapedName = encodeURIComponent(globalName);
			    console.log("urlEscapedName is: " + urlEscapedName);

			    // build the marker location as "latitude,longitude" of POI
			    var marker = globalPOILatitude + "," + globalPOILongitude;
			    
			    // Now build the URL for the API call
			    var miniMapURL1 = "https://maps.googleapis.com/maps/api/staticmap?scale=2&maptype=roadmap&size=400x400&markers=" + marker + "&key="+YOUR_API_KEY;
			    
			    // and let's place the map in the modal
			    $("#myModalMapImage").html("<img id='miniMapImage' src=" + miniMapURL1 + " class='img-responsive' alt='mini map'>");

				// finally make the modal visible
				$('#myModal').modal('show');

			// end of the listener on the thumbnails
			});
			
		}

	// end of the ajax call
	}); 

// end of the grabThumbnails function
};

function displaySixThumbnails(imagesAvailable, response) {
	// for our random starting point in the array of images returned 
	// by the flickr API, select a ranom number between 0 and images
	// available - 7. We subtract by 7 instead of 6 to account for index #
	var number = Math.floor((Math.random() * (imagesAvailable-7)) + 0);   	

	// run a loop starting from index number of the first image and
	// continue for 6 iterations, using the i index. Additionally,
	// have a j index variable that will be used to generate the
	// ID of the div we will target to display the image. The divs
	// have IDs of #image1, #image2, .... #image6
	for (var i=number, j=1; i<number+6; i++, j++) {

		// define the image type using the jquery call to the img tag
		var imgDisplay = $('<img>');

		// Give the image a data attribute of the thumbnail size image url
		imgDisplay.attr('data-thumbnail', response.photos.photo[i].url_q);

		// Give the image a data attribute of the full size image url
		imgDisplay.attr('data-fullsize', response.photos.photo[i].url_z);

		// Give the image a src attribute pulled from the API object
		imgDisplay.attr('src', response.photos.photo[i].url_q);

		// Give the image a common class that can be used for the onClick function
		imgDisplay.addClass("myShowImage");

		// display the thumbnail image into the div by targeting the div's ID
		$('#image'+j).html(imgDisplay);

	// end of the for loop
	};

	// clear prior listeners
	$(".myShowImage").off("click");

	// create a listener for the 6 images we just drew
	$(".myShowImage").on("click", function() {

		// for testing lets make sure url attributes are available
		console.log($(this).attr("data-thumbnail"));
		console.log($(this).attr("data-fullsize"));

		// display the modal
		// first enter the name and address in the title after clearing the div
		$('#myModalLabel').empty();
		$('#myModalLabel').text(globalName + ", " + globalVicinity);

		// then link the title to the foursquare page if one exists
		foursquareCheck();

		// populate the content area with the larger version of the image
		$("#myModalPOIImage").html('<img src="' + $(this).attr("data-fullsize") + '" class="img-responsive" id="largerPOIimage" alt="location image">');

		// Now add in the miniMap built with the Google Static Maps API
		// first the Google APIs key
		var YOUR_API_KEY = "AIzaSyD4gTlyrAaD5wN9zit_lSKLiNIGWhgKtwc";
	    
	    // location needs to be url escaped for calls
	    var urlEscapedLocation = encodeURIComponent(globalVicinity);
	    console.log("urlEscapedLocation is: " + urlEscapedLocation);
	    
	    // name needs to be url escaped for calls
	    var urlEscapedName = encodeURIComponent(globalName);
	    console.log("urlEscapedName is: " + urlEscapedName);
	    
	    // build the marker location as "latitude,longitude" of POI
	    var marker = globalPOILatitude + "," + globalPOILongitude;

	    // Now build the URL for the API call
	    var miniMapURL1 = "https://maps.googleapis.com/maps/api/staticmap?scale=2&maptype=roadmap&size=400x400&markers=" + marker + "&key="+YOUR_API_KEY;
	    
	    // and let's place the map in the modal
	    $("#myModalMapImage").html("<img id='miniMapImage' src=" + miniMapURL1 + " class='img-responsive' alt='mini map'>");

		// finally make the modal visible
		$('#myModal').modal('show');

	// end of the listener on the thumbnails
	});

// end of the displaySixThumbnails function			
}

// function that clears out the Thumbnails area
function clearThumbnailsArea() {

	// empty out all 6 div spots where images go as well as reloadButtonDiv
	$("#image1").empty();
	$("#image2").empty();
	$("#image3").empty();
	$("#image4").empty();
	$("#image5").empty();
	$("#image6").empty();
	$("#reloadButtonDiv").empty();
}

// function to load a temporary loading gif in image1 div until thumbnail loads
function loadingImage() {
	// place a loading animated gif in thumbnail 1 div
	$("#image1").html('<img src="assets/images/loading150x150.gif" alt="loading">');
}

// function to load a temporary loading gif in image1-image6 thumbnail divs
function loading6Image() {
	for (var x=1; x<7; x++) {
		$("#image"+x).html('<img src="assets/images/loading150x150.gif" alt="loading">');
	}
}

// getWeather function makes call to Weather Underground API
// and fills in information on the modal that appears when a photo
// is clicked. Doing it this way minimizes calls to the API, which
// permits no more than 10 calls per minute, 500 calls per day
// Weather info is only needed after user has seen photos because
// that is the determining factor on whether they wish to visit that location
function getWeather() {

	// Define the Weather Underground API Key
	var APIKey = "cac9c2020e49c7f8";

	// Here we are building the URL we need to query the API for the forecast
	var queryURL = "https://api.wunderground.com/api/" + APIKey + "/forecast/q/" + globalLatitude + "," + globalLongitude + ".json";

	$.ajax({
  		url : queryURL,
		dataType : "jsonp",
		success : function(parsed_json) {
			console.log(parsed_json);
			for (var n = 0; n < 6; n++) {
				// icon url is returned by the object as an http request but heroku
				// requires http. Let's conver it. First, save the icon URL in a temp var
				var tempIconURL = parsed_json.forecast.txt_forecast.forecastday[n].icon_url;

				// then convert the http portion to https
				var finalIconURL = tempIconURL.replace(/^http:\/\//i, 'https://');

				// Extract the forecast overview icon for the period and place that
				$("#iconPeriod" + n).html("<img src='" + finalIconURL + "' alt='icon'>");

				// Extract the text forecast for the priod and place that
				$("#textPeriod" + n).html("<strong>" + parsed_json.forecast.txt_forecast.forecastday[n].title + "</strong><br>" + parsed_json.forecast.txt_forecast.forecastday[n].fcttext);
			}
  		}
  	});

}

// This function checks to see if a page exists on Foursquare.com for the POI
// and if it does, then it replaces the modal title to with a title that is
// linked to that page instead
function foursquareCheck() {
	// make foursquare ajax call by first setting up the keys
	var client_id = "YZOSJSSBJMVE2MKWJY51YHKMUEW3C4KBKSWGVTWOQMGPJBLC";
	var client_secret = "KO4UFOOJ1V3CTJWIYPT1CTABD5GZRW11DASM1JG0RKLWOXAX";

	// next set up the keywords (POI name) and latitude / longitude
	var keywords = encodeURIComponent(globalName);
	var lat = globalPOILatitude;
	var lon = globalPOILongitude;

	// build the ajax query URL
	var queryURL = "https://api.foursquare.com/v2/venues/search?radius=100&v=20161125&limit=1&client_id=" + client_id + "&client_secret=" + client_secret + "&ll=" + lat + "," + lon + "&query=" + keywords;

	// make the ajax query
	$.ajax({url: queryURL, method: "GET"}).done(function(foursqResponse) {

		console.log(foursqResponse);

		// if a foursquare page exists for the POI then link it within modal address title
		if (typeof foursqResponse.response.venues[0].id !== "undefined") {

			// built the URL by extracting page ID from the response object
			var foursquareURL = "https://foursquare.com/v/" + foursqResponse.response.venues[0].id;

			// clear out previous address and updated it with the linked address instead
			$('#myModalLabel').empty();
			$('#myModalLabel').html('<a target="_blank" href="' + foursquareURL + '">' + globalName + ", " + globalVicinity + '</a>');
		}

	});
}