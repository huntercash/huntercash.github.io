// Define Global Variables
var tableData = data;
var tbody = d3.select("tbody");
var submit = d3.select("#filter-btn");
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

// Create Filter Functionality for the Date

// Select the submit button
submit.on("click", function() {
    // Prevent Page from refreshing
    d3.event.preventDefault();
    // Select the input from the date element and get the raw input
    var inputElement = d3.select("#datetime");
    var dateValue = inputElement.property("value");
    // Check if the listening is working on submit click
    console.log(this);
    // console.log(dateValue);

    // Create a Filter Based on Users input for the Date
    var filteredDate = tableData.filter(tableData => tableData.datetime === dateValue);
    console.log(filteredDate);

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


// Create Dropdown Filter Functionality
