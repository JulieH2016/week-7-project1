
function grabThumbnails (locationClick){

		 var userInput = locationClick;

		 var apiKey = 'f7d55bffd8b0ca3e7df8269a986d2d1d';

		 var apiUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + apiKey + '&tags=' + userInput + '&privacy_filter=1&safe_search=1&content_type=1&extras=url_q%2C+url_z&per_page=100&format=json&nojsoncallback=1';

		$.ajax({url: apiUrl, method: 'GET'})

		.done(function(response){

		    $('#random-img').on('click', function(){
				        	
		        	var number = Math.floor((Math.random() * 93) + 0);   	


		 	        for (var i = number, j = 1; i < number+6; i++, j++){
		 	        	
					        
							var imgDisplay = $('<img>');
							imgDisplay.attr('src', response.photos.photo[i].url_q);
							console.log('images ' + imgDisplay);



							$('#image'+j).html(imgDisplay);
		                    
							

			        }; 
		    
		    });

		}); 

};
