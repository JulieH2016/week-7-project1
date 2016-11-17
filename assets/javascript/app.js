// This function is called first by the Google Maps object generated in index.html
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
                }
                
        });

        // We also want to issue a return false so that the form doesn't instantly
        // refresh and expect more data
        return false;

    });
}