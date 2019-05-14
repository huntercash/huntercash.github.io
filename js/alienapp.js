// Define Global Variables
var tableData = data;
var tbody = d3.select("tbody");
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
    Object.entries(datum).forEach(([index, value]) => {
      var cell = row.append("td").text(value);
    });
  });


  