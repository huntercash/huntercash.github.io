function createMap(earthQuakes) {

  // Create the tile layer that will be the background of our map
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 9,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 9,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 9,
    id: "mapbox.satmap",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the dark map layer
  var baseMaps = {
    "Dark Map": darkmap,
    "Light Map": lightmap,
    "Satellite Map": satmap
  };

  // Create an overlayMaps object to hold the earthquakes layer
  var overlayMaps = {
    "Earthquakes": earthQuakes
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [38.2321223, -97.3245531], //kansas.. haha
    zoom: 3,
    layers: [darkmap, earthQuakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response) {
  
  // Pull the "features from the geo jason"
  var quakes = response.features;

  // Initialize an array to hold bike markers
  var earthQuakeMarkers = [];

  // Loop through the stations array
  for (var index = 0; index < quakes.length; index++) {
    var quake = quakes[index];

    // For each station, create a marker and bind a popup with the station's name
    var quakeMarker = L.marker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]])
      .bindPopup(`<h5> Name: ${quake.properties.title}<hr>
                  <h5> Magnitude: ${quake.properties.mag}<br>
                  <h5> Time: ${new Date(quake.properties.time).toLocaleDateString()}`);

    // Add the marker to the bikeMarkers array
    earthQuakeMarkers.push(quakeMarker);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(earthQuakeMarkers));
}


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMarkers);
