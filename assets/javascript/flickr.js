// Set up two global variables that will be used in multiple functions
// globalName will hold the name of the particular point of interest
// that the user clicked on, while globalVicinity will hold its address
var globalName;
var globalVicinity;

// set up two global location related variables for use in multiple functions
// they hold the latitude and longitude returned by the Google Maps geocoding API
var globalLatitude = 0;
var globalLongitude = 0;

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
		
	// define userInput as the location being passed into the function
	var userInput = locationClick;

	// set up the Flickr API key
	var apiKey = '8f7799f4500510037138500c6216fecd';

	// generate the Flickr ajax call url
	var apiUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + apiKey + '&tags=' + userInput + '&privacy_filter=1&safe_search=1&content_type=1&extras=url_q%2C+url_z&per_page=100&format=json&nojsoncallback=1';

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
			$('#image1').html(imgDisplay);
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

	// create a listener for the 6 images we just drew
	$(".myShowImage").on("click", function() {

		// for testing lets make sure url attributes are available
		console.log($(this).attr("data-thumbnail"));
		console.log($(this).attr("data-fullsize"));

		// display the modal
		// first enter the name and address in the title
		$('#myModalLabel').text(globalName + ", " + globalVicinity);

		// populate the content area with the larger version of the image
		$("#myModalPOIImage").html('<img src="' + $(this).attr("data-fullsize") + '" class="img-responsive" id="largerPOIimage" alt="localtion image">');

		// Now add in the miniMap built with the Google Static Maps API
		// first the Google APIs key
		var YOUR_API_KEY = "AIzaSyDYF2GrpKe_zY-zNC4GrdGWhQ8cWahoKUU";
	    // location needs to be url escaped for calls
	    var urlEscapedLocation = encodeURIComponent(globalVicinity);
	    console.log("urlEscapedLocation is: " + urlEscapedLocation);
	    // name needs to be url escaped for calls
	    var urlEscapedName = encodeURIComponent(globalName);
	    console.log("urlEscapedName is: " + urlEscapedName);
	    // build the marker location as "name,address"
	    var marker = urlEscapedName + "," + urlEscapedLocation;
	    // Now build the URL for the API call
	    var miniMapURL1 = "https://maps.googleapis.com/maps/api/staticmap?scale=2&maptype=roadmap&size=400x400&markers=" + marker + "&key="+YOUR_API_KEY;
	    // and let's place the map in the modal
	    $("#myModalMapImage").html("<img id='miniMapImage' src=" + miniMapURL1 + " class='img-responsive' alt='mini map'>");

	    // display the weather image
	    $("#myModalWeatherInfo").html("Weather or Social Media goes here");

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

// getWeather function makes call to Weather Underground API
// and fills in information on the modal that appears when a photo
// is clicked. Doing it this way minimizes calls to the API, which
// permits no more than 10 calls per minute, 500 calls per day
// Weather info is only needed after user has seen photos because
// that is the determining factor on whether they wish to visit that location
function getWeather() {

	// Define the Weather Underground API Key
	var APIKey = "cd425eda92edbd2d";

	// Here we are building the URL we need to query the API for the forecast
	var queryURL = "https://api.wunderground.com/api/cd425eda92edbd2d/forecast/q/" + globalLatitude + "," + globalLongitude + ".json";


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

				// $("#fc" + n).html(parsed_json.forecast.txt_forecast.forecastday[n].title + " " + parsed_json.forecast.txt_forecast.forecastday[n].fcttext + " " + "<img src='" + parsed_json.forecast.txt_forecast.forecastday[n].icon_url + "' alt='icon'>");
				$("#iconPeriod" + n).html("<img src='" + finalIconURL + "' alt='icon'>");
				$("#textPeriod" + n).html("<strong>" + parsed_json.forecast.txt_forecast.forecastday[n].title + "</strong><br>" + parsed_json.forecast.txt_forecast.forecastday[n].fcttext);
			}
  		}
  	});

}