// Define Global Variables
var tableData = data;
var tbody = d3.select("tbody");
var submit = d3.select("#filter-btn");
// for use in selecting cities
var citySelector = d3.select("#filter-city");
// for use in selecting states
var stateSelector = d3.select("#filter-state");
var countrySelector = d3.select("#filter-country");
var shapeSelector = d3.select("#filter-shape");



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
    var inputCity = d3.select("#selectcity");
    var inputState= d3.select("#selectstate");
    var inputCountry = d3.select("#selectcountry");
    var inputShape = d3.select("#selectshape");

    var dateValue = inputElement.property("value");
    var cityValue = inputCity.property("value");
    var stateValue = inputState.property("value");
    var countryValue = inputCountry.property("value");
    var shapeValue = inputShape.property("value");

    // Create a Filter Based on Users input for the Date]
    


  var filteredData = tableData.filter(tableData => ((tableData.datetime === dateValue)) || tableData.city === cityValue || tableData.state === stateValue || tableData.country === countryValue || tableData.shape === shapeValue);
    
    // WORK IN PROGRESS multi variable filter.. very complicated.. 
// if (shapeValue || countryValue || stateValue || cityValue !== tableData.shape || tableData.country || tableData.state || tableData.city) {
//   var filteredData = tableData.filter(tableData => tableData.datetime === dateValue);
//   console.log("mainIf")
// }
// else if (dateValue === tableData.datetime || cityValue === tableData.city) {
//   console.log("ElseIf1")
//   var filteredData = tableData.filter(tableData.datetime === dateValue && tableData.city === cityValue);
// }
// else {
//   console.log("else")
//   var filteredData = tableData.filter(tableData => ((tableData.datetime === dateValue)) || tableData.city === cityValue || tableData.state === stateValue || tableData.country === countryValue || tableData.shape === shapeValue);
// };
    
    // console.log(filteredDate);


    //Clear Current Table
    tbody.selectAll("tr").text("")
    
    // Display New Data
    filteredData.forEach((datum) => {
        // Function to append a table row
        var row = tbody.append("tr");
        // Function to append the data to the row
        Object.entries(datum).forEach(([key, value]) => {
          var cell = row.append("td").text(value);
        });
      });
});


