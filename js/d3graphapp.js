// Step 1. 
// Set up SVG Template Area

const svgWidth = document.getElementById('scatter').clientWidth - 100;
const svgHeight = svgWidth / 2.5 + 100;

const margin = {
  top: 100,
  right: 20,
  bottom: 80,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Initial Parameters for X axis data.poverty
let chosenXAxis = "age";
// Initial Parameters for Y axis data.healthcare
let chosenYAxis = "healthcare";

// Step 2.
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Function used for updating x-scale var upon click on axis label 
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(600)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  return circlesGroup;
}

// Function used for updated the text group with transition to new text

function renderStateText(stateTextGroup, newXScale, chosenXAxis){
  stateTextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
  return stateTextGroup;
};


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "age") {
    var label = "Age (Median)";
  }
  else {
    var label = "Poverty (%)";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-10, 0])
    .html(function(data) {
      return (`${data.state}<br>${label} ${data[chosenXAxis]}<br>
      ${data.healthcare}% Lacks Healthcare`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
  // onmouseout event
  .on("mouseout", function(data) {
    toolTip.hide(data);
  });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
// Using Version 5 so .then()


d3.csv('data/data.csv').then(censusData => {

  // parse data
  censusData.forEach(data => {
    data.id = +data.id;
    data.state = data.state;
    data.abbr = data.abbr;
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.ageMoe = +data.ageMoe;
    data.income = +data.income;
    data.incomeMoe = +data.incomeMoe;
    data.healthcare = +data.healthcare;
    data.healthcareLow = +data.healthcareLow;
    data.healthcareHigh = +data.healthcareHigh;
    data.obesity = +data.obesity;
    data.obesityLow = +data.obesityLow;
    data.healthcareHigh = +data.healthcareHigh;
    data.smokes = +data.smokes;
    data.smokesLow = +data.smokesLow;
    data.smokesHigh = +data.smokesHigh;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .attr("opacity", ".8");

// append state text abbr labels
  var stateTextGroup = chartGroup.selectAll(".statetext")
      .data(censusData)
      .enter()
      .append("text")
      .attr("class", "stateText")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d.healthcare)+ 5)
      .text(d => d.abbr);



  // Create group for 2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ageMedianLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age (Median)");

  // Define Changing Chart Title
  var chartTitle = chartGroup.append("text")
    .attr("id", "charttitle")
    .attr("class","text-center" )
    .attr("y", -30 - margin.top / 4)
    .attr("x", margin.left)
    .text(`Correlation of Health Care Coverage vs. ${chosenXAxis} in United States`);
    
  // Define Poverty Percentage Variable
  var povertyPercentageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive", true)
    .text("Is In Poverty (%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left / 2)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .classed("active", true)
    .text("Lacks Healthcare(%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup ,xLinearScale, chosenXAxis);

        // updates state text abbr new x values
        stateTextGroup = renderStateText(stateTextGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageMedianLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyPercentageLabel
            .classed("active", false)
            .classed("inactive", true);
          chartTitle
            .text(`Correlation of Health Care Coverage vs. ${chosenXAxis} in United States`);
        }
        else {
          ageMedianLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyPercentageLabel
            .classed("active", true)
            .classed("inactive", false);
          chartTitle
            .text(`Correlation of Health Care Coverage vs. ${chosenXAxis} in United States`);
        }
      }
    });
});