-----------------------------------------
# Oh, The Places You Will Go!

#### Week 7 / Project 1
#### UCF Coding Boot Camp - November/December 2016

#### Team:
Alberto Alvarez, Julie Hoffman, Shivam Parekh, Ali Zaidi
-----------------------------------------

#### Deployed:
https://fierce-coast-58198.herokuapp.com/

#### Presentation Video:
Coming soon...

#### Pre-research Notes:
https://drive.google.com/open?id=1dlJ3GmrWDRWC7EmW3RzTrSD3K-IosCGNKTLzS_Ao840

#### GitHub Repository:
https://github.com/realzaidiguy/week-7-project1

-----------------------------------------

#### Concept
An app to get ideas for things to do around a city, or any specific location. User can “shop” images of POIs around a location, and if something strikes their interest they can then get further information on location, and a weather forecast, to aid in decision whether to visit.

#### Detail Walkthrough
Initial page displays a clean interface asking the user to enter a destination, and select a venue type of: Amusement Park, Art Gallery, Museum, Park or Zoo. Upon entry, the app calls the **Google Maps JavaScript API** (which can take a fairly loosely constructed string location) to generate a map object (centered around the location the user entered) that is then displayed. Next, a call is made to the **Google Maps Geocoding API** to get the latitude and longitude of the location the user had entered, for later use. A call is then made to the **Google Places API Web Service** (which requires latitude and longitude as input) to get points of interest of the venue type the user had selected, centered around the latitude and longitude that was determined earlier. These POIs are then populated onto the map as clickable markers. The user can then click on any marker and a small info window will show the name of the POI, and at the same time a call is made to the **Flickr API** to retrieve relevant images and display them as thumbnails below the map. A button is generated that allows the user to request additional thumbnails. Clicking on the thumbnail brings up a modal window that displays a larger version of the thumbnail. Also a call is made to the **Google Static Maps API** to generate a small map image showing the POI, which is also displayed. Finally a call is made to the **Weather Underground API** (using the earlier determined latitude and longitude) to get the forecast for 3 days, and that too is displayed within the modal. Finally, the **FourSquare API** is checked to see if information exists in their database for the POI, and if it does then the name of the POI at the top of the modal is turned into a link to the FourSquare page for that POI.

#### Project Requirements and Goals Met
**At least 2 APIs:** 7 APIs used

**Use AJAX to pull data:** Completed

**Use technology not discussed in class:** All 7 APIs, RegEx for search/replace

**Polished front end / UI:** Completed, in team’s humble opinion

**Good quality coding / indents, scoping, naming:** Completed, in team’s humble opinion

**Do not use alerts / confirms / prompts:** Avoided

**Use of repeating element:** POI thumbnails generated via loop, weather forecast data populated via loop

**User Input Validation:** If user enters “nonsense” location string, or requests POIs without entering location, a modal prompts the user to correct their choice

**CSS Framework:** Bootstrap

**Deployed:** Heroku

**Extras:** Local Data Storage used for recalling last few user location searches, mobile responsive with Bootstrap use

#### Additional Unused Research
**Facebook API, Pinterest API, Twitter API:** Team decided against using any of these as they didn’t really align with the concept of the app.

**Leaflet:** JavaScript Library for mobile maps. Decided not to use because it didn’t have sufficient functionality that we could get via the various Google APIs instead

**Google Maps Direction Service:** Used this to research getting directions. Successfully managed to pull directions and draw them to a map, but service didn’t allow for looking for POIs along route over extended distances.

**RouteBoxer Library:** Researched trying to use this library to break route up into small chunks, then look for POIs within those areas, but free usage level of Google APIs didn’t permit the quantity of calls we would need to make to be successful with that approach.

**OpenWeatherMap API:** Researched, but API only permits one weather call every 10 minutes. Insufficient. We wanted user to be able to switch locations and then get new weather info within a much smaller span of time.

**Yelp API:** Abandoned due to lack of sufficient JS documentation, and OAUTH complications.

####Issues
**1.Google APIs** do not function as you would expect. The Google Maps JavaScript API takes in location as a descriptive string and provides a map object centered around that location. However, the Google Places API Web Service and Google Static Maps API both require location to be passed as latitude/longitude. For this reason you have to make a separate call to the Google Maps Geocoding API to get the latitude/longitude of the location that the Google Maps JavaScript API already returned. It’s not intuitive, and took some research to figure out.

**2. Weather Underground API** permits up to 10 calls per minute, which averages to one call every six seconds. In order to minimize the number of calls, we pull the weather data just one time when a user selects a new location, and populate the modal with the forecast even though it’s hidden in the beginning. When the user clicks on a thumbnail to bring up the modal, the forecast is already there and doesn’t need to be pulled again. The only time we get a new pull is when the location is changed, which hopefully is less than once every six seconds.

**3. Heroku deployment** caused problems with the weather icons that were being displayed. The URL of the weather icons comes from the Weather Underground API returned forecast object, and is in http (unsecure) format. We had to learn about regular expressions to match ‘http’ and replace with ‘https’ in order to generate icons with a src call that was Heroku compliant.

**4. For location**, a user can technically enter vast size locations too if they want to - such as a country name, and that will work and bring up a map and show POIs based on whatever point in the location that Google’s APIs internally evaluate it as. The problem is that if the user enters a location larger than a city then that will cause a problem getting a weather forecast. I.e., you can’t get a single location forecast for a country. The team thought about restricting user input to just a city/state format, but the downside of that would be that a user could no longer enter a spot they planned to visit (such as Kennedy Space Center) and get POIs and weather around that. In the end we decided to leave the user location entry unrestricted, and just have a form default placeholder asking for a specific destination. A very large location selection causes forecast to not be displayed.

**5. Flickr API** doesn’t have a hard limit listed for free level API usage, but their dashboard starts to show a redline if we get to about 25 requests per hour. Each of our requests is for up to 100 objects/images (if available), so those 25 requests can stretch pretty far because each call is not per image, or even per “reload” of images, but rather per POI selected.

**6. Flickr** doesn’t always provide photos for any given POI returned by the Google Places API Web Service, sometimes due to lack of geotagging and sometimes due to lack of availability. When photos are not available, we display an image informing the user that images are not available. However, that “no photos” image is still clickable to retrieve weather info and local map, and FourSquare page link (if available).

**7. Regarding GitHub**, team members had already written most of their code for different functions by the time we received training on how to properly use GitHub for collaboration, and at that point they just committed their final code. After we received the GitHub collaboration training, the main thing we had left to do was to consolidate all the functions, which was done by one team member. For this reason the GitHub commit history does not accurately portray the amount of work done by different team members.

####Future Development
Try to find source for, and integrate additional photos (Google Photos?). Provide mechanism for user to save the POIs that interest them, and retrieve them later.