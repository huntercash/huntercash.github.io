// Step 1. 
// Set up SVG Template Area

const svgWidth = document.getElementById('scatter').clientWidth;
const svgHeight = svgWidth / 2.5 + 100;

const margin = {
  top: 100,
  right: 20,
  bottom: 80,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;


// Initial Parameters for X axis data.age
var chosenXAxis = "age";
// Initial Parameters for Y axis data.healthcare
var chosenYAxis = "healthcare";

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
      d3.max(censusData, d => d[chosenXAxis]) * 1.2]).range([0, width]);
  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
  let yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
          d3.max(censusData, d => d[chosenYAxis])*1.2]).range([height, 0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(600)
    .call(bottomAxis);
  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  return yAxis;
}

// Function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

// Function used for updated the text group with transition to new text
function renderStateText(stateTextGroup, newXScale, chosenXAxis, newYScale, chosenYAxis){
  stateTextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]) + 5);
  return stateTextGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  switch (chosenXAxis) {
    case "age":
      xlabel = "Age (Median):";
      break;
    case "poverty":
      xlabel = "Poverty (%):";
      break;
    case "income":
      xlabel = "Household Income (Median): $";
      break;
  }

  switch (chosenYAxis) {
    case "healthcare":
      ylabel = "Lacks Healthcare(%):";
      break;
    case "smokes":
      ylabel = "Smokes(%):";
      break;
    case "obesity":
      ylabel = "Obestiy(%)";
      break;
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-10, 0])
    .html(function(data) {return (`${data.state}<br>${xlabel} ${data[chosenXAxis]}<br>${ylabel} ${data[chosenYAxis]}`);});

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
// Using Version 5 so .then() to fix issues with promises..
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
  var yLinearScale = yScale(censusData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 14)
    .attr("opacity", ".8");

// append state text abbr labels
  var stateTextGroup = chartGroup.selectAll(".statetext")
      .data(censusData)
      .enter()
      .append("text")
      .attr("class", "stateText")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis])+ 5)
      .text(d => d.abbr);

  // Create group for 3 x- axis labels
  const xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  let ageMedianLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age (Median)");

  // Define Poverty Percentage Variable
  let povertyPercentageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive", true)
    .text("Is In Poverty (%)");

  let houseHoldIncomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

 // Create group for 3 y-axis 
  const ylabelsGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)");
  
  let healthCareLabel = ylabelsGroup.append("text")
    .attr("y", 20 - margin.left / 2)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare")
    .classed("axis-text", true)
    .classed("active", true)
    .text("Lacks Healthcare(%)");

  let smokesLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left / 2)
    .attr("x", -20 - (height / 2))
    .attr("value", "smokes")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Smokes (%)");


  let obeseLabel = ylabelsGroup.append("text")
    .attr("y", -20 - margin.left / 2)
    .attr("x", -20 - (height / 2))
    .attr("value", "obesity")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Obese (%)");

   // Define Changing Chart Title
  let chartTitle = chartGroup.append("text")
    .attr("id", "charttitle")
    .attr("class","text-center" )
    .attr("y", -30 - margin.top / 4)
    .attr("x", margin.left)
    .text(`Correlation of ${chosenYAxis.charAt(0).toUpperCase() + chosenYAxis.slice(1)} vs. ${chosenXAxis.charAt(0).toUpperCase() + chosenXAxis.slice(1)} in United States`);

  // updateToolTip function above csv import
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates state text abbr new x values
        stateTextGroup = renderStateText(stateTextGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

// changes classes to change bold text
// Comments on this statement aren't necessary. it looks like english.. 

      switch (chosenXAxis) {
        case "age":
        ageMedianLabel
          .classed("active", true)
          .classed("inactive", false);
        povertyPercentageLabel
          .classed("active", false)
          .classed("inactive", true);
        houseHoldIncomeLabel
          .classed("active", false)
          .classed("inactive", true)
        chartTitle
        .text(`Correlation of ${chosenYAxis.charAt(0).toUpperCase() + chosenYAxis.slice(1)} vs. ${chosenXAxis.charAt(0).toUpperCase() + chosenXAxis.slice(1)} in United States`);
          break;

        case "poverty":
        ageMedianLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyPercentageLabel
          .classed("active", true)
          .classed("inactive", false);
        houseHoldIncomeLabel
          .classed("active", false)
          .classed("inactive", true)
        chartTitle
        .text(`Correlation of ${chosenYAxis.charAt(0).toUpperCase() + chosenYAxis.slice(1)} vs. ${chosenXAxis.charAt(0).toUpperCase() + chosenXAxis.slice(1)} in United States`);
          break;

        case "income":
        ageMedianLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyPercentageLabel
          .classed("active", false)
          .classed("inactive", true);
        houseHoldIncomeLabel
          .classed("active", true)
          .classed("inactive", false)
        chartTitle
        .text(`Correlation of ${chosenYAxis.charAt(0).toUpperCase() + chosenYAxis.slice(1)} vs. ${chosenXAxis.charAt(0).toUpperCase() + chosenXAxis.slice(1)} in United States`);
          break;
        }
      }
    });
    
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates state text abbr new x values
        stateTextGroup = renderStateText(stateTextGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Switch Y Axis Information
        switch (chosenYAxis) {
          case "healthcare":
          healthCareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true)
          chartTitle
            .text(`Correlation of ${chosenYAxis.charAt(0).toUpperCase() + chosenYAxis.slice(1)} vs. ${chosenXAxis.charAt(0).toUpperCase() + chosenXAxis.slice(1)} in United States`);
            break;

          case "smokes":
          healthCareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true)
          chartTitle
          .text(`Correlation of ${chosenYAxis.charAt(0).toUpperCase() + chosenYAxis.slice(1)} vs. ${chosenXAxis.charAt(0).toUpperCase() + chosenXAxis.slice(1)} in United States`);
            break;
            
          case "obesity":
          healthCareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", true)
            .classed("inactive", false)
          chartTitle
            .text(`Correlation of ${chosenYAxis.charAt(0).toUpperCase() + chosenYAxis.slice(1)} vs. ${chosenXAxis.charAt(0).toUpperCase() + chosenXAxis.slice(1)} in United States`);
            break;
        }
      }
    });
});