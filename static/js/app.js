function buildMetadata(year) {
  d3.json(`/top_complaints/${year}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });

  });
}

function buildCharts(year) {
  d3.json(`/top_complaints/${year}`).then((data) => {

  var trace1 = {
    x: data[0],
    y: data[1],
    type: "bar"
  };

  var data = [trace1];

  var layout = {
    title: "'Bar' Chart",
    xaxis: { title: "Type of Complaint"},
    yaxis: { title: "Number of Times Filed"}
  };

  Plotly.newPlot("plot", data, layout);
  });
}

function buildPieChart(year){
  d3.json(`/by_ward/${year}`).then((data) => {

    const wards = data[0];
    const counts = data[1];

    // Build a Pie Chart
    var pieData = [
      {
        values: counts,
        labels: wards,
        hovertext: counts,
        hoverinfo: "hovertext",
        type: "pie"
      }
    ];

    var pieLayout = {
      margin: { t: 0, l: 0 }
    };

    Plotly.plot("pie", pieData, pieLayout);

  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/years").then((yearArray) => {
    yearArray.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = yearArray[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildPieChart(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildPieChart(newSample);
}

// Initialize the dashboard
init();
