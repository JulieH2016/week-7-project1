// Function to generate thumbnails of images at a location
// makes ajax call to Flickr API
function grabThumbnails (locationClick){
		
	// define userInput as the location being passed into the function
	var userInput = locationClick;

	// set up the Flickr API key
	var apiKey = 'f7d55bffd8b0ca3e7df8269a986d2d1d';

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

			// Give the image a src attribute pulled from the API object
			imgDisplay.attr('src', response.photos.photo[i].url_q);

			// display the thumbnail image into the div by targeting the div's ID
			$('#image'+j).html(imgDisplay);

		// end of the for loop
		};

	// end of the ajax call
	}); 

// end of the grabThumbnails function
};
