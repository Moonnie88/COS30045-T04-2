// t04-5-bars.js
// Called by t04-4-load.js once the CSV has loaded: one <rect> per row of data
const createBarChart = (data) => {
  const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 1200 400") // temporary; we'll adjust layout soon
    .style("border", "1px solid black"); // dev-only border so we see the canvas

  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", d => `bar bar-${d.count}`) // e.g. "bar bar-809"
    .attr("width", d => d.count) // uses your numeric column directly
    .attr("height", 16); // constant bar height

  // No x/y yet, so every bar sits at (0, 0) on top of the others.
  // Spacing the bars (y based on each bar's position in the data) comes in T04-6.
};
