// Define Global Variables
var tableData = data;
var tbody = d3.select("tbody");
var submit = d3.select("#filter-btn");
// for use in selecting cities
var citySelector = d3.select("#filter-city")
// for use in selecting states
var stateSelector = d3.select("#filter-state")
var countrySelector = d3.select("#filter-country")
var shapeSelector = d3.select("#filter-shape")





// Extra Data that needs to be added to the dataset. 
var secondEntry = {
    datetime: "1/28/1996",
    city: "dallas",
    state: "tx",
    country: "us",
    shape: "star",
    durationMinutes: "5 mins.",
    comments: "Cowboys win a superbowl, that's alien!."
    };

// Add the SecondEntry to the tableData Array
tableData.push(secondEntry);
// Grab the Data and make it appear in the javascript.html page
tableData.forEach((datum) => {
    // Function to append a table row
    var row = tbody.append("tr");
    // Function to append the data to the row
    Object.entries(datum).forEach(([key, value]) => {
      var cell = row.append("td").text(value);
    });
  });





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create Filter Functionality for the Date

// Select the submit button
submit.on("click", function() {
    // Prevent Page from refreshing
    d3.event.preventDefault();
    // Select the input from the date element and get the raw input
    var inputElement = d3.select("#datetime");
    var dateValue = inputElement.property("value");
    // Check if the listening is working on submit click
    // console.log(this);
    // console.log(dateValue);

    // Create a Filter Based on Users input for the Date
    var filteredDate = tableData.filter(tableData => tableData.datetime === dateValue);
    // console.log(filteredDate);

    //Clear Current Table
    tbody.selectAll("tr").text("")
    
    // Display New Data
    filteredDate.forEach((datum) => {
        // Function to append a table row
        var row = tbody.append("tr");
        // Function to append the data to the row
        Object.entries(datum).forEach(([key, value]) => {
          var cell = row.append("td").text(value);
        });
      });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create Filter Functionality for the city

// Select the submit button
citySelector.on("click", function() {
    // Prevent Page from refreshing
    d3.event.preventDefault();
    // Select the input from the date element and get the raw input
    var inputElement = d3.select("#selectcity");
    var cityValue = inputElement.property("value");
    var filteredCity = tableData.filter(tableData => tableData.city === cityValue);
    tbody.selectAll("tr").text("")
    filteredCity.forEach((datum) => {
        // Function to append a table row
        var row = tbody.append("tr");
        // Function to append the data to the row
        Object.entries(datum).forEach(([key, value]) => {
          var cell = row.append("td").text(value);
        });
      });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create Filter Functionality for the state

// Select the submit button
stateSelector.on("click", function() {
    // Prevent Page from refreshing
    d3.event.preventDefault();
    // Select the input from the date element and get the raw input
    var inputElement = d3.select("#selectstate");
    var stateValue = inputElement.property("value");
    var filteredCity = tableData.filter(tableData => tableData.state === stateValue);
    tbody.selectAll("tr").text("")
    filteredCity.forEach((datum) => {
        // Function to append a table row
        var row = tbody.append("tr");
        // Function to append the data to the row
        Object.entries(datum).forEach(([key, value]) => {
          var cell = row.append("td").text(value);
        });
      });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Create Filter Functionality for the country

// Select the submit button
countrySelector.on("click", function() {
    // Prevent Page from refreshing
    d3.event.preventDefault();
    // Select the input from the date element and get the raw input
    var inputElement = d3.select("#selectcountry");
    var countryValue = inputElement.property("value");
    var filteredCountry = tableData.filter(tableData => tableData.country === countryValue);
    tbody.selectAll("tr").text("")
    filteredCountry.forEach((datum) => {
        // Function to append a table row
        var row = tbody.append("tr");
        // Function to append the data to the row
        Object.entries(datum).forEach(([key, value]) => {
          var cell = row.append("td").text(value);
        });
      });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create Filter Functionality for the shape

// Select the submit button
shapeSelector.on("click", function() {
    // Prevent Page from refreshing
    d3.event.preventDefault();
    // Select the input from the date element and get the raw input
    var inputElement = d3.select("#selectshape");
    var shapeValue = inputElement.property("value");
    var filteredShape = tableData.filter(tableData => tableData.shape === shapeValue);
    tbody.selectAll("tr").text("")
    filteredShape.forEach((datum) => {
        // Function to append a table row
        var row = tbody.append("tr");
        // Function to append the data to the row
        Object.entries(datum).forEach(([key, value]) => {
          var cell = row.append("td").text(value);
        });
      });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create Dropdown Filter Functionality


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Display Unique Cities to put into filter dropdown
// var citiesList = tableData.map(function(entry){
//     return entry.city;
// });
// // returns a new list of UNIQUE cities to be used in the creation of the dropdown menu
// var citiesListUnique = d3.set(citiesList).values();
// var citiesAlphabetical = citiesListUnique.sort();
// // Display Unique Cities List as the Dropdown
// var i = 0;
// citiesAlphabetical.forEach((datum) => {
//     // Function to append a table row
//     var item = citySelector.append("a").attr("class", "dropdown-item").attr("id", "cities").text(citiesAlphabetical[i++]);
//   });


// citySelector.on("click", function() {
// // Prevent Page from refreshing
//     d3.event.preventDefault();
//     // Select the input from the date element and get the raw input
//     var inputElement = d3.select("#cities");
//     var cityValue = inputElement.property("text");
//     console.log(cityValue);
//     // Create a Filter Based on Users input for the Date
//     var filteredCity = tableData.filter(tableData => tableData.city === cityValue);

    
//     //Clear Current Table
//     tbody.selectAll("tr").text("")

//     // Display New Data
//         filteredCity.forEach((datum) => {
//         // Function to append a table row
//         var row = tbody.append("tr");
//         // Function to append the data to the row
//         Object.entries(datum).forEach(([key, value]) => {
//             var cell = row.append("td").text(value);
//         });
//     });
// });



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Display Unique States to put into filter dropdown
// var stateList = tableData.map(function(entry){
//     return entry.state;
// });
// // returns a new list of UNIQUE States to be used in the creation of the dropdown menu
// var stateListUnique = d3.set(stateList).values();
// var stateAlphabetical = stateListUnique.sort();
// // Display Unique States List as the Dropdown
// var g = 0;
// stateAlphabetical.forEach((datum) => {
//     // Function to append a table row
//     var item = stateSelector.append("a").attr("class", "dropdown-item").attr("id", "state").text(stateAlphabetical[g++]);
//   });
// stateSelector.on("click", function() {
//     // Prevent Page from refreshing
//     d3.event.preventDefault();
//     // Select the input from the date element and get the raw input
//     var inputElement = d3.select("#state");
//     var stateValue = inputElement.property("text");
//     console.log(stateValue)
//     // Create a Filter Based on Users input for the Date
//     var filteredState = tableData.filter(tableData => tableData.state === stateValue);
//     //Clear Current Table
//     tbody.selectAll("tr").text("")
    
//     // Display New Data
//     filteredState.forEach((datum) => {
//         // Function to append a table row
//         var row = tbody.append("tr");
//         // Function to append the data to the row
//         Object.entries(datum).forEach(([key, value]) => {
//           var cell = row.append("td").text(value);
//         });
//       });
// });