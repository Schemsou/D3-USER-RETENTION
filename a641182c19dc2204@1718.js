// https://observablehq.com/@observablehq/cohort-grid@1718
import define1 from "./a2e58f97fd5e8d7c@754.js";

function _1(md){return(
md`# User Retention: Cohort Grid Component
<figcaption>Used in the [User Retention](https://observablehq.com/@observablehq/user-retention) and [User Retention with Segments](https://observablehq.com/@observablehq/user-retention-with-segments) templates</figcaption>`
)}

function _segment(Radio,segments){return(
Radio(["all"].concat(segments), {label: "Segment", value: "all"})
)}

function _3(CohortGrid,selectedSegment){return(
CohortGrid(selectedSegment)
)}

function _4(md){return(
md`This component (also known as an “impact plot” or “triangular heatmap”) expects to receive \`data\` in the form of an array of objects, with columns for \`cohort_date\`, \`period_date\`, \`period_number\`, \`users\`, and \`percentage\`. This can be produced from the \`processCohortData\` function, which preprocesses the simpler format explained in the [User Retention](/@observablehq/user-retention) notebook. It is assumed that the data has already been filtered (for example, by segment) for display in the grid.`
)}

function _CohortGrid(d3){return(
function(data, {
  gridWidth = 800,
  gridHeight = 600,
  lineChartWidth = 300,
  lineChartHeight = 200,
  dateFormat = d3.utcFormat("%b %d, %Y"),
  leftMargin = 140,
  maxCohorts = 15
} = {}) {
  
  const allCohorts = Array.from(new d3.InternSet(data.map(d => d.cohort_date))).sort(d3.descending);
  const visibleCohorts = new d3.InternMap(allCohorts.slice(0, maxCohorts + 1).map(d => [d, true]));
  const visibleData = data.filter(d => visibleCohorts.has(d.cohort_date));
  
  const userCounts = new d3.InternMap(visibleData.filter(d => d.period_number === 0).map(({cohort_date, users}) => [cohort_date, users]))
  const retentionCohorts = visibleData.filter(d => d.period_number > 0);
  
  const cohortDates = Array.from(new d3.InternSet(retentionCohorts.map(d => d.cohort_date))).sort(d3.ascending);
  const periodNumbers = Array.from(new Set(retentionCohorts.map(d => d.period_number))).sort(d3.ascending);
  
  const margin = {top: 20, right: 10, bottom: 0, left: leftMargin};
  
  const x = d3.scaleBand()
    .domain(periodNumbers)
    .rangeRound([margin.left, gridWidth - margin.right]);

  const y = d3.scaleBand()
    .domain(cohortDates)
    .rangeRound([margin.top, gridHeight - margin.bottom]);
  
  const color = d3.scaleSequential(d3.interpolateYlGnBu)
    .domain([0, d3.max(retentionCohorts, d => d.percentage)]);
  
  const label = d => d3.format(".1%")(d.percentage);

  const lineX = d3.scalePoint().domain(periodNumbers).range([5, lineChartWidth - 5]);
  
  const lineY = d3.scaleLinear()
    .domain([0, d3.max(retentionCohorts, d => d.percentage)])
    .range([lineChartHeight - 5, 5]);
  
  const line = d3.line()
    .x(d => lineX(d.period_number))
    .y(d => lineY(d.percentage));
  
  let clicked = null;
  
  // Put inside a div to enable horizontal scrolling on a small screen
  const div = d3.create("div")
    .style("overflow-x", "auto")
    .style("font-variant-numeric", "tabular-nums");
  
  const svg = div.append("svg")
    .attr("viewBox", [0, 0, gridWidth, gridHeight])
    .attr("width", gridWidth);

  // Background rect that you can click on to clear the selection
  svg.append("rect")
    .attr("width", gridWidth)
    .attr("height", gridHeight)
    .attr("fill", "white")
    .on("click", click);
  
  const element = div.node();
  element.value = null;
  
  const g = svg.append("g")
    .attr("shape-rendering", "crispEdges")
    .style("cursor", "default");
  
  const row = g.selectAll(".row")
    .data(d3.groups(retentionCohorts, d => d.cohort_date))
    .join("g")
    .attr("class", "row")
    .attr("transform", ([cohort_date, _]) => `translate(0,${y(cohort_date)})`)
    .on("mouseenter", rowEnter)
    .on("mouseleave", rowLeave);

  const cell = row.selectAll(".cell")
    .data(([ _, values]) => values)
    .join("g")
    .attr("class", "cell")
    .attr("transform", d => `translate(${x(d.period_number)},0)`)
    .on("mouseenter", cellEnter)
    .on("mouseleave", cellLeave)
    .on("click", click);
  
  cell.append("rect")
    .attr("fill", d => color(d.percentage))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth());
  
  cell.append("text")
    .text(label)
    .attr("fill", d => d3.lab(color(d.percentage)).l < 55 ? "white" : "black")
    .attr("x", x.bandwidth() - 5)
    .attr("y", y.bandwidth() / 2)
    .attr("text-anchor", "end")
    .attr("dy", "0.35em")
    .attr("font-size", "10px")
    .attr("font-family", "var(--sans-serif)");

  cell.append("title")
    .text(d => `${dateFormat(d.period_date)}`)
  
  svg.append("g")
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x))
    .call(g => g.selectAll(".domain, .tick line").remove())
    .call(g => g.selectAll("text").attr("font-family", "var(--sans-serif)"));
  
  // Background for row labels, to catch mouse events
  row.append("rect")
    .attr("width", x(1))
    .attr("height", y.bandwidth())
    .attr("fill", "white");
  
  const rowLabel = row.append("g")
    .attr("font-size", "10px")
    .attr("font-family", "var(--sans-serif)");
  
  rowLabel
    .append("text")
    .text(([cohort_date, _]) => dateFormat(cohort_date))
    .attr("x", 2)
    .attr("y", y.bandwidth() / 2)
    .attr("dy", "0.35em")

  rowLabel
    .append("text")
    .text(([cohort_date, _]) => d3.format(",")(userCounts.get(cohort_date)))
    .attr("x", margin.left - 7)
    .attr("y", y.bandwidth() / 2)
    .attr("text-anchor", "end")
    .attr("dy", "0.35em")
  
  const rowHighlight = g.append("rect")
    .style("display", "none")
    .attr("x", 0.5)
    .attr("height", y.bandwidth() - 0.5)
    .attr("stroke", "#bbb")
    .attr("fill", "none")
    .attr("pointer-events", "none");
  
  const cellHighlight = g.append("rect")
    .style("display", "none")
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("stroke-width", 2)
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr("pointer-events", "none");
  
  const lineChart = svg.append("g")
    .style("display", "none")
    .attr("transform",
      `translate(${gridWidth - lineChartWidth},${gridHeight - lineChartHeight})`);

  lineChart.append("rect")
    .attr("x", 0.5)
    .attr("width", lineChartWidth - 1.5)
    .attr("height", lineChartHeight - 1.5)
    .attr("stroke", "#ccc")
    .attr("fill", "none");
  
  lineChart.selectAll("path")
    .data(d3.groups(retentionCohorts, d => d.cohort_date).map(([ _, value]) => value))
    .join("path")
    .attr("d", d => line(d))
    .attr("stroke", "#ccc")
    .attr("fill", "none");

  const point = lineChart.append("circle")
    .attr("r", 3)
    .attr("stroke", "none")
    .attr("fill", "black");
  
  function highlightCell(datum) {
    cellHighlight
      .attr("x", x(datum.period_number))
      .attr("y", y(datum.cohort_date))
      .style("display", null);
    point
      .attr("cx", d => lineX(datum.period_number))
      .attr("cy", d => lineY(datum.percentage))
      .style("display", null);
    point.raise();    
  }

  function highlightRow(cohort) {
    rowHighlight
      .attr("y", d => y(cohort) + 0.5)
      .attr("width", d => x(d3.max(retentionCohorts.filter(d => +cohort === +d.cohort_date), d => d.period_number)) + x.bandwidth() - 0.5)
      .style("display", null);
    lineChart
      .selectAll("path")
      .attr("stroke", d => +cohort === +d[0].cohort_date ? "black" : "#ccc")
      .each(function(d) {
         if (+cohort === +d[0].cohort_date) {
           d3.select(this).raise();
         }
    });
    lineChart.style("display", null);
  }
  
  function rowEnter(_, datum) {
    if (clicked) return;
    highlightRow(datum[0]);
  }
  
  function rowLeave() {
    if (clicked) return;
    rowHighlight.style("display", "none");
    lineChart.style("display", "none");
    lineChart.selectAll("path").attr("stroke", "#aaa");
    cellLeave();
  }
  
  function cellEnter(_, datum) {
    if (clicked) return;
    highlightCell(datum);
    // element.value = datum;
    // element.dispatchEvent(new CustomEvent("input"));
  }

  function cellLeave() {
    if (clicked) return;
    cellHighlight.style("display", "none");
    point.style("display", "none");
    // element.value = null;
    // element.dispatchEvent(new CustomEvent("input"));
  } 
  
  function click(_, datum) {
    if (datum && !cellsMatch(clicked, datum)) {
      highlightCell(datum);
      highlightRow(datum.cohort_date);
      clicked = datum;
      element.value = datum;
    } else {
      clicked = null;
      rowLeave();
      cellLeave();
      element.value = null;
    }
    element.dispatchEvent(new CustomEvent("input"));
  }
  
  function cellsMatch(datum1, datum2) {
    return datum1 && datum2 &&
      +datum1.cohort_date === +datum2.cohort_date &&
      +datum1.period_date === +datum2.period_date;
  }
  
  return element;
}
)}

function _6(md){return(
md`---`
)}

function _7(md){return(
md`## Imports and data for this instance`
)}

function _csv(FileAttachment){return(
FileAttachment("example_cohorts.csv").csv({typed: true})
)}

function _data(processCohortData,csv){return(
processCohortData(csv)
)}

function _rollupAllSegments(d3,csv){return(
d3.rollups(csv, v => d3.sum(v, d => d.users), d => d.cohort_date, d => d.period_date)
  .flatMap(([cohort_date, values]) =>
    values.flatMap(([period_date, users]) =>
      ({cohort_date, period_date, users})))
)}

function _selectedSegment(segment,processCohortData,rollupAllSegments,data){return(
segment === "all"
  ? processCohortData(rollupAllSegments)
  : data.filter(d => d.segment === segment)
)}

function _segments(data){return(
Array.from(new Set(data.map(d => d.segment)))
)}

function _14(md){return(
md`---
## Data validation and preprocessing

Used to prepare data for visualization with the cohort grid component.
`
)}

function _validationRules(dateMismatch){return(
{
  dataRules: [dateMismatch || "Dates in cohort_date and period_date columns should match"], 
  columnRules: {
    "cohort_date": d => d instanceof Date || "column should be of type Date, like YYYY-MM-DD",
    "period_date": d => d instanceof Date || "column should be of type Date, like YYYY-MM-DD",
    "users": d => typeof d === "number" || "should be a number"
  }
}
)}

function _dateMismatch(d3){return(
function(data) {
  const cohortDates = new d3.InternSet(data.map(d => d.cohort_date));
  const periodDates = new d3.InternSet(data.map(d => d.period_date));
  return !(cohortDates.size === periodDates.size && Array.from(cohortDates).every(d => periodDates.has(d)));
}
)}

function _processCohortData(processSegment){return(
function(data) {
  if (data[0].segment) {
    const segments = Array.from(new Set(data.map(d => d.segment)));
    return segments.flatMap(segment => processSegment(data.filter(d => d.segment === segment)).map(d => ({...d, segment})));
  } else {
    return processSegment(data);
  }
}
)}

function _processSegment(d3){return(
function(segmentData) {
  const selectedSegment = segmentData.sort((a, b) => d3.ascending(a.cohort_date, b.cohort_date) || d3.ascending(a.period_date, b.period_date));
  const userCounts = d3.rollup(selectedSegment, ([{users}]) => users, d => d.cohort_date);
  const cohortDates = new d3.InternSet(selectedSegment.map(d => d.cohort_date));
  const periodDates = new d3.InternSet(selectedSegment.map(d => d.period_date));
  const cohortDatesArray = Array.from(cohortDates).map(d => +d);
  
  // Make sure we have a user count for every combination of cohort date and period date, and calculate
  // period numbers and percentages for each entry.
  const cross = d3.cross(cohortDates, periodDates, (cohort_date, period_date) => ({cohort_date, period_date}))
    .filter(({cohort_date, period_date}) => cohort_date <= period_date);
  const rollup = d3.rollup(selectedSegment, ([{users}]) => users, d => d.cohort_date, d => d.period_date);
  const data = cross.map(({cohort_date, period_date}) => {
    const period_number = cohortDatesArray.indexOf(+period_date) - cohortDatesArray.indexOf(+cohort_date);
    const users = (rollup.has(cohort_date) && rollup.get(cohort_date).has(period_date))
      ? rollup.get(cohort_date).get(period_date)
      : 0;
    const percentage = users / userCounts.get(cohort_date);
    return {cohort_date, period_date, period_number, users, percentage};
  }).filter(d => d.period_number >= 0);
  return data.sort((a, b) => d3.ascending(a.cohort_date, b.cohort_date) || d3.ascending(a.period_date, b.period_date));
}
)}

function _19(md){return(
md`---`
)}

function _20(md){return(
md`## Imports for the component itself`
)}

function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["example_cohorts.csv", {url: new URL("./files/0fad8177b01c0f822c5608a4951ca22dd0da3a60e7682c39ba1aa187a436b13fc76e79ce22fb87595f8830ab3ddab0c1aa3899965eb9d830d7d99653e0831f3b.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof segment")).define("viewof segment", ["Radio","segments"], _segment);
  main.variable(observer("segment")).define("segment", ["Generators", "viewof segment"], (G, _) => G.input(_));
  main.variable(observer()).define(["CohortGrid","selectedSegment"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("CohortGrid")).define("CohortGrid", ["d3"], _CohortGrid);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("csv")).define("csv", ["FileAttachment"], _csv);
  main.variable(observer("data")).define("data", ["processCohortData","csv"], _data);
  main.variable(observer("rollupAllSegments")).define("rollupAllSegments", ["d3","csv"], _rollupAllSegments);
  main.variable(observer("selectedSegment")).define("selectedSegment", ["segment","processCohortData","rollupAllSegments","data"], _selectedSegment);
  main.variable(observer("segments")).define("segments", ["data"], _segments);
  const child1 = runtime.module(define1);
  main.import("Radio", child1);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("validationRules")).define("validationRules", ["dateMismatch"], _validationRules);
  main.variable(observer("dateMismatch")).define("dateMismatch", ["d3"], _dateMismatch);
  main.variable(observer("processCohortData")).define("processCohortData", ["processSegment"], _processCohortData);
  main.variable(observer("processSegment")).define("processSegment", ["d3"], _processSegment);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
