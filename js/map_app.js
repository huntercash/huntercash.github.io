  // Create tile map layers to add to tool tip 
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

// initialize all of the layer groups based on magnitude
var layers = {
  zeroOne: new L.LayerGroup(),
  oneTwo: new L.LayerGroup(),
  twoThree: new L.LayerGroup(),
  threeFour: new L.LayerGroup(),
  fourFive: new L.LayerGroup(),
  fivePlus: new L.LayerGroup()
};

var time = new Date();

// Create the map object with options
var map = L.map("map-id", {
  center: [38.114793, -113.487747],
  zoom: 4,
  layers: [
          layers.zeroOne,
          layers.oneTwo,
          layers.twoThree,
          layers.threeFour,
          layers.fourFive,
          layers.fivePlus
        ]
});

// Add darkmap layer to the map
darkmap.addTo(map);

// Create an overlayMaps object to hold the earthquakes layer
var overlayMaps = {
  "0-0.9": layers.zeroOne,
  "1-1.9": layers.oneTwo,
  "2-2.9": layers.twoThree,
  "3-3.9": layers.threeFour,
  "4-4.9": layers.fourFive,
  "5+": layers.fivePlus 
};

// Create a baseMaps object to hold the dark map layer, light, and satellite
var baseMaps = {
  "Dark Map": darkmap,
  "Light Map": lightmap,
  "Satellite Map": satmap
};

// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);

// Create Legend
var info = L.control({position: "bottomright"});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// create colors and 
var circleIcons = {
  zeroOne:{
    color: "#90EE90",
    fillOpacity: 1,
    stroke: false
  },
  oneTwo: {
    color: "#006400",
    fillOpacity: 1,
    stroke: false
  },
  twoThree: {
    color: "#FFFF00",
    fillOpacity: 1,
    stroke: false
  },
  threeFour:{
    color: "#FFA500",
    fillOpacity: 1,
    stroke: false
  },
  fourFive: {
    color: "#FF4500",
    fillOpacity: 1,
    stroke: false
  },
  fivePlus: {
    color: "#FF0000",
    fillOpacity: 1,
    stroke: false
  }
};

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(response) {
  
  // Pull the "features from the geo json"
  var quakes = response.features; 
  
  // Initialize an array to hold markers for earthquakes
  var earthQuakeCount = {
    zeroOne: 0,
    oneTwo: 0,
    twoThree: 0,
    threeFour: 0,
    fourFive: 0,
    fivePlus: 0
  };
  
  // Create variable used as key to access layers and magnitude
  var  earthQuakeMagnitude;

  // Loop through the earthquakes array
  for (var index = 0; index < quakes.length; index++) {
  
    // create a new earth quake based on magnitude
    var quake = Object.assign({}, quakes[index]);
    var mag = quake.properties.mag

    if (mag >= 5) {
      earthQuakeMagnitude = "fivePlus";
    }

    else if (mag >= 4 && mag < 5) {
      earthQuakeMagnitude = "fourFive";
    }

    else if (mag >= 3 && mag < 4) {
      earthQuakeMagnitude = "threeFour";
    }

    else if (mag >= 2 && mag < 3) {
      earthQuakeMagnitude = "twoThree";
    }

    else if (mag >= 1 && mag < 2) {
      earthQuakeMagnitude = "oneTwo"; 
    }

    else {
      earthQuakeMagnitude = "zeroOne";
    }

    //update the earthquake count
    earthQuakeCount[earthQuakeMagnitude]++;

    // Create a new marker with the appropriate icon and coordinates
    var newMarker = L.circleMarker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], 
      {color: circleIcons[earthQuakeMagnitude].color,
       fillOpacity: circleIcons[earthQuakeMagnitude].fillColor,
       stroke: circleIcons[earthQuakeMagnitude].stroke,
       radius: mag * 4})

    newMarker.addTo(layers[earthQuakeMagnitude]);

    newMarker.bindPopup(`<h5> Name: ${quake.properties.title}<hr>
                         <h5> Magnitude: ${quake.properties.mag}<br>
                         <h5> Time: ${new Date(quake.properties.time).toLocaleDateString()}`
    )};
    // Call the updateLegend function                     
    updateLegend(quakes, earthQuakeCount);
  });



  function updateLegend(self, earthQuakeCount) {
    document.querySelector(".legend").innerHTML = [`Earthquake Magnitude:<hr>
      <p class="zeroOne">Mag 0-0.9: ${earthQuakeCount.zeroOne}</p>
      <p class="oneTwo">Mag 1-1.9: ${earthQuakeCount.oneTwo}</p>
      <p class="twoThree">Mag 2-2.9: ${earthQuakeCount.twoThree}</p>
      <p class="threeFour">Mag 3-3.9: ${earthQuakeCount.threeFour}</p>
      <p class="fourFive">Mag 4-4.9: ${earthQuakeCount.fourFive}</p>
      <p class="fivePlus">Mag 5+: ${earthQuakeCount.fivePlus}</p>`].join("");
    };
