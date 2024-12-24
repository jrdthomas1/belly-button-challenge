// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Full Data:", data);


    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.find(obj => obj.id === parseInt(sample));
    console.log("Filtered Metadata for Sample:", result);

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.find(obj => obj.id === sample);
    console.log("Sample Data for Charts:", result);

    // Get the otu_ids, otu_labels, and sample_values
    const { otu_ids, otu_labels, sample_values } = result;
    console.log("OTU IDs:", otu_ids);
    console.log("Sample Values:", sample_values);
    console.log("OTU Labels:", otu_labels);

    // Build a Bubble Chart
    const bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 30, l: 50 },
      xaxis: { title: "OTU ID" },
      hovermode: "closest"
    };

    console.log("Bubble Chart Data:", bubbleData);

    // Render the Bubble Chart

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
const barData = [{
  x: sample_values.slice(0, 10).reverse(),
  y: yticks,
  text: otu_labels.slice(0, 10).reverse(),
  type: "bar",
  orientation: "h"
}];

const barLayout = {
  title: "Top 10 Bacteria Cultures Found",
  margin: { t: 30, l: 150 }
};
console.log("Bar Chart Data:", barData);
    // Render the Bar Chart

Plotly.newPlot("bar", barData, barLayout);
});
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;
    console.log("Sample Names:", sampleNames);
    // Use d3 to select the dropdown with id of `#selDataset`
    const selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      console.log("Adding Sample to Dropdown:", sample);
      selector.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
