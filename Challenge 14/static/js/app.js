// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    console.log(metadata)
    console.log(metadata.id)
    // Filter the metadata for the object with the desired sample number
    let filteredData = metadata.filter(object => object.id ==sample)[0]; 
    console.log(filteredData)

    // Use d3 to select the panel with id of `#sample-metadata`
    let panelId = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panelId.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredData).forEach(([key, value]) => {
      panelId.append("h6").text(`${key}: ${value}`);
    })
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let result = samples.filter(object => object.id == sample)[0];
    console.log(result);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids= result.otu_ids;
    let otu_labels= result.otu_labels;
    let sample_values= result.sample_values;
    
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);

    // Build a Bubble Chart
    let bubbleTrace= {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode:'markers',
      marker: {
            size: sample_values,
            color: otu_ids,
        }
    };

    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bateria' }
  };

  let bubbleData = [bubbleTrace];

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [{
      type: 'bar',
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      orientation: 'h'
    }];
    
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: 'Number of Bateria' },
      margin: {
        l: 120,
        r: 100,
        t: 100,
        b: 100
      }
    }; 
    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropDown = d3.select("#selDataset");


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    names.forEach((sample) =>{
      dropDown.append("option").text(sample).property("value",sample)
    })


    // Get the first sample from the list
    let firstSample= names[0];
    console.log(firstSample);

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
};

// Initialize the dashboard
init();
