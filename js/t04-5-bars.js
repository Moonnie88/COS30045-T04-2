// t04-5-bars.js
// Called by t04-4-load.js once the CSV has loaded: one <rect> per row of data
const createBarChart = (data) => {
  // SVG internal coordinate system used to position and size chart elements
  const viewW = 500;      // logical width available for the chart
  const viewH = 1600;     // logical height available for all bars
  // SVG rendered size displayed on the webpage
  const displayW = 640;   // visible width of the SVG
  const displayH = 420;   // visible height of the SVG

  const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", `0 0 ${viewW} ${viewH}`) // defines the internal coordinate system
    .attr("width", displayW)                  // sets the displayed width
    .attr("height", displayH)                 // sets the displayed height
    .style("border", "1px solid black");

  // X scale (numeric)
  const xMax = d3.max(data, d => d.count); // Find the largest count value in the dataset
  // Create a linear scale for the numerical x-axis
  const xScale = d3.scaleLinear()
    .domain([0, xMax])  // input: data values from 0 to the highest count
    .range([0, viewW]); // output: pixel positions from 0 to the SVG's logical width

  // Create a band scale for the categorical y-axis
  const yScale = d3.scaleBand()
    // Extract all brand names and use them as categories
    .domain(data.map(d => d.brand))
    // Distribute the categories from the top to the bottom of the SVG
    .range([0, viewH])
    // Add space between neighbouring bars
    .paddingInner(0.2)
    // Add space before the first bar and after the last bar
    .paddingOuter(0.1);

  // Bars
  svg.selectAll("rect")
    // connect the dataset to the rectangles
    .data(data)
    // Create rectangles for data and update existing rectangles
    .join("rect")
    // Assign a general class and a count-specific class to each bar
    .attr("class", d => `bar bar-${d.count}`)
    // Start every bar from the left edge of the SVG
    .attr("x", 0)
    // Position each bar vertically according to its brand
    .attr("y", d => yScale(d.brand))
    // Convert each count into a scaled bar width
    .attr("width", d => xScale(d.count))
    // Use the height calculated by the band scale
    .attr("height", yScale.bandwidth())
    // Set the colour of the bars
    .attr("fill", "steelblue");
};
