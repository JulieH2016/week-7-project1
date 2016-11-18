// initMap function is called first by the Google Maps object generated in index.html
function initMap() {

    // we want to begin when user has entered a location and clicks the Go button
    $("#goButton").on("click", function() {

        // For testing - log what the user entered for location
        console.log("in initMap function user entered #location as: " + $("#location").val());
        
        // First thing we want to do is convert the location the user entered into a latitude/longitude
        // This is accomplished by making an ajax call to the Google Maps Geocoding API
        
        // The information we need to send includes the location the user entered
        var location = $("#location").val();
        
        // We also need the venue type the user selected as we will later send it to 
        // the function that builds the map
        var venue = $("#venue").val();
        
        // We need our Google Developer Key to make the ajax call
        var YOUR_API_KEY = "AIzaSyDYF2GrpKe_zY-zNC4GrdGWhQ8cWahoKUU";

        // Now we have everything to build our requestURL
        var requestURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=" + YOUR_API_KEY;
        
        // For testing, let's log the requestURL
        console.log("requestURL generated in initMap function: " + requestURL);

        // Now make the ajax call to get the geo object so we can get lat/lng for location
        $.ajax({url: requestURL, method: "GET"}).done(function(response) {
                
                // Let's see what the call returned
                console.log("ajax call to geocoding API in initMap function returned: " + response);

                // If the location was valid, the returned object will have a .status of "OK"
                // Let's check for that to confirm location and set the latitude and longitude
                // If location was valid then set the lat/lng
                if (response.status === "OK") {

                    // Set the latitude and logitude by retreiving from the response object
                    var latitude = response.results[0].geometry.location.lat;
                    var longitude = response.results[0].geometry.location.lng;

                    // Let's log out the latitude and longitude for testing
                    console.log("From initMap function, latitude: " + latitude + " longitude: " + longitude);

                    // Now that we have the latitude and longitude and venue type
                    // Let's call the buildMap function so we can display a map
                    // Along with points of interestes of the venue type
                    // Do this by passing these three values to the buildMap function
                    buildMap(latitude, longitude, venue);

                } else {

                    // If the user didn't enter a valid location, let's catch that first
                    // by console logging it out
                    console.log("incorrect location");

                    // And also issuing an alert - which we can remove later in development
                    // and handle it in a nicer way
                    alert("Please use valid location");

                // End of the if/else
                }
        
        // End of the ajax call to the Google Maps Geocoding API       
        });

        // We also want to issue a return false so that the form doesn't instantly
        // refresh and expect more data
        return false;

    // End of the onClick for the Go button
    });

// End of the initMap function
}

// buildMap function builds and the map using the latitude,
// longitude, and venue type passed to it from the initMap function
function buildMap(latitude, longitude, venue) {

    // Google Maps Map API requires that it be fed an object
    // containing latitude and longitude. Create this
    // object and pass in the latitude and longitude this
    // function received
    var locationCenter = {lat: latitude, lng: longitude};

    // Create a new map in the #map div defined in index.html
    map = new google.maps.Map(document.getElementById('map'), {

        // Center the map on the locationCenter object containing
        // the latitude and longitude of the location the user entered
        // which was calculated in the initMap function using the Google
        // Maps Geocoding API and passed to this buildMap function
        center: locationCenter,

        // The map also requires a zoom level to be set. This was
        // determined by trial and error and level of 10 was found
        // to be acceptable for this app's needs.
        zoom: 10

    // End of the map declaration
    });

    // Much of the code below came from the Google API documents
    // but best as I understand it, infowindow is an infowindow
    // object that is a new instance of an InfoWindow defined in
    // the Google Maps Map API
    infowindow = new google.maps.InfoWindow();

    // Service appears to leverage the Google Maps Places (Web) Service
    // and creates a new instance of it on the previously declared map
    var service = new google.maps.places.PlacesService(map);

    // Service appears to have a nearbySearch function that requires that
    // it be fed the location latitude, longitude, venue type, and radius
    // to search from the location.
    service.nearbySearch({

        // location is once again going to be the previously determined location
        // object containing the latitude and longitude
        location: locationCenter,

        // radius is defined in meters in the Google Maps Places (Web) Service
        // and by trial and error 30,000m was found to be a good radius. This is
        // roughly 18.5 miles radius and seems to turn up a reasonable amount of
        // venues.
        radius: 30000,

        // type required refers to venue type, and this is provided as an object to
        // the Google Maps Places (Web) Service. Venue was selected by the user
        // from a drop down menu, passed to the initMaps function, which then passed it
        // to this buildMap function. Supported venue options are available at:
        // developers.google.com/places/supported_types
        type: [venue]

    // The nearbySearch function appears to get a callback function which much be run
    // and will be defined separately
    }, callback);

// End of the buildMap function    
}

// This is the callback function that was referenced in the service.nearbySearch function
// call that was made within the buildMap function. Again, this code was taken from the Google
// Maps Places (Web) Service. This function appears to receive results and status. Status
// confirms that the call was correctly made and executed, while results contains the 
// points of interest that were found.
function callback(results, status) {

    // Verify that the status was returned as "OK" 
    if (status === google.maps.places.PlacesServiceStatus.OK) {

        // If status is indeed okay, that means there are POIs available in result
        // so iterate over the arrays of points of interest being held within result
        for (var i = 0; i < results.length; i++) {

            // For each point of interest, create a marker on the map. createMarker
            // is a function that will be separately defined outside of this function.
            createMarker(results[i]);

        // End of the iteration loop
        }

    // End of the the if statement 
    }

// End of the callback function    
}