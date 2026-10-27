// My CSV comes from my KNIME workspace (GroupBy on brand, top 10), so its headers are
// "Brand_Reg" and "Count(Model_No)" instead of "brand" and "count".
// "Count(Model_No)" has brackets in it, so it must be read with d["..."], not d.Count(Model_No).

// createBarChart(data) is defined in t04-5-bars.js (the T04-4 stub has been removed)

/* Load CSV, Convert Type, Quick Check */
d3.csv("data/tvBrandCount.csv", d => ({
  brand: d.Brand_Reg,
  count: +d["Count(Model_No)"] // '+' converts string to number
})).then(data => {
  // Quick check
  console.log(data); // whole array
  console.log("rows:", data.length);
  console.log("max:", d3.max(data, d => d.count));
  console.log("min:", d3.min(data, d => d.count));
  console.log("extent:", d3.extent(data, d => d.count)); // [min, max]

  // Optional: sort for easier reading (descending by count)
  data.sort((a, b) => d3.descending(a.count, b.count));

  // Hand off to the chart builder (in t04-5-bars.js)
  createBarChart(data);
});
