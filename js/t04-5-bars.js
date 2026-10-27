// t04-5-bars.js
// Called by t04-4-load.js once the CSV has loaded: one bar + two labels per brand
const createBarChart = (data) => {
  // --- Layout (horizontal space inside the viewBox) ---
  // CHANGED from the exercise code: the exercise used labelX = 100 and an x range of [0, viewW],
  // so bars ended at 100 + 500 = 600, past the 500-wide viewBox, and KOGAN's "809" was cut off.
  // Here the space is split into: brand labels | bars | value labels, and the bars only get the middle part.
  const labelX = 170;      // brand labels end here and bars start here ("SAMSUNG ELECTRONICS" needs ~155)
  const valueSpace = 40;   // room after the longest bar for its value label

  // --- Sizes (logical vs. display) ---
  // CHANGED: the display size now has the same shape as the viewBox (1 unit = 1 pixel),
  // so the chart fills the box instead of being shrunk and centred (see T04-6 in the README).
  const viewW = 640;
  const viewH = Math.max(220, data.length * 28);
  const displayW = viewW;
  const displayH = viewH;

  // --- SVG root ---
  const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", `0 0 ${viewW} ${viewH}`)
    .attr("width", displayW)
    .attr("height", displayH);
  // Border, background and colours now come from css/styles.css (.responsive-svg-container)

  // --- Scales (from T04-6) ---
  const xMax = d3.max(data, d => d.count);
  const xScale = d3.scaleLinear()
    .domain([0, xMax])
    .range([0, viewW - labelX - valueSpace]); // CHANGED: was [0, viewW]; bars must fit between the labels

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, viewH])
    .paddingInner(0.2)
    .paddingOuter(0.1);

  // OLD rectangle-only drawing block from T04-6 (COMMENTED OUT for T04-7).
  /* svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", d => `bar bar-${d.count}`)
    .attr("x", 0)
    .attr("y", d => yScale(d.brand))
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");
  */

  // --- NEW in T04-7: group per row (bar + labels move together) ---
  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  // --- Bar rectangle inside the group ---
  // y is 0 because the group sets vertical position via transform.
  barAndLabel
    .append("rect")
    .attr("class", d => `bar bar-${d.count}`)
    .attr("x", labelX)                         // bars start where the brand labels end
    .attr("y", 0)
    .attr("width", d => xScale(d.count))       // scaled width fits the viewBox
    .attr("height", yScale.bandwidth());       // bar thickness from band scale
    // Bar colour is set in css/styles.css (.bar) to match the site's logo palette

  // CHANGED: both labels use the middle of the bar for y, with dominant-baseline "middle",
  // instead of fixed y values (15 and 12), so they line up with the bar and with each other.
  const labelY = yScale.bandwidth() / 2;

  // --- Category text (left of bar, right-aligned) ---
  barAndLabel
    .append("text")
    .text(d => d.brand)
    .attr("x", labelX - 6)                     // small gap before the bar
    .attr("y", labelY)
    .attr("text-anchor", "end")                // right-align so the text ends at the bar
    .attr("dominant-baseline", "middle")       // centre the text vertically on y
    .style("font-family", "sans-serif")
    .style("font-size", "13px");

  // --- Value text (at the end of each bar) ---
  barAndLabel
    .append("text")
    .text(d => d.count)
    .attr("x", d => labelX + xScale(d.count) + 4) // just past bar end
    .attr("y", labelY)
    .attr("dominant-baseline", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "13px");
};
