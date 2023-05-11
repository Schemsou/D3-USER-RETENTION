// https://observablehq.com/@observablehq/user-retention@2174
import define1 from "./a641182c19dc2204@1718.js";
import define2 from "./9783eabee68343f0@276.js";

function _1(md,toc,instructions){return(
md`#  
${toc(instructions)}



---`
)}


function _maxCohorts(Inputs,numCohorts){return(
Inputs.range(
  [1, numCohorts],
  {label: "Max # of cohorts", step: 1, value: 15}
)
)}

function _selection(CohortGrid,data,maxCohorts){return(
CohortGrid(data, {maxCohorts})
)}



function _8(legend,d3,lineChartData,selection){return(
legend({color: d3.scaleUtc().domain(d3.extent(lineChartData, d => d.cohort_date)).interpolate(() => selection === null ? d3.interpolateOrRd : d3.interpolate("#ccc", "#ccc")), title: "Cohort date"})
)}

function _10(selection,d3,cyclePlotData,md,dateFormat,pctFormat)
{
  const period_number = selection 
    ? selection.period_number 
    : d3.min(cyclePlotData.map(d => d.period_number));
  const series = cyclePlotData
    .filter(d => d.period_number === period_number)
    .sort((a, b) => d3.ascending(a.cohort_date, b.cohort_date));
  let selectedIndex = selection 
    && series.map(d => +d.cohort_date).indexOf(+selection.cohort_date);
  
  return md
}



function _csv(FileAttachment){return(
FileAttachment("cohorts.csv").csv({typed: true})
)}

function _data(processCohortData,csv){return(
processCohortData(csv)
)}

function _numCohorts(d3,data){return(
d3.max(data, d => d.period_number)
)}

function _lineChartData(data){return(
data.filter(d => d.period_number > 0)
)}

function _dateFormat(d3){return(
d3.utcFormat("%B %d, %Y")
)}

function _pctFormat(d3){return(
d3.format(".1%")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["cohorts.csv", {url: new URL("./files/412f6661ef5417077a9224bb75826ee889a1f43e7f60077bb2abfc7332e0808e4f1519afc3a8f6f263d57c635e9229d11acd3197925875d8a37a342246d72397.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("viewof maxCohorts")).define("viewof maxCohorts", ["Inputs","numCohorts"], _maxCohorts);
  main.variable(observer("maxCohorts")).define("maxCohorts", ["Generators", "viewof maxCohorts"], (G, _) => G.input(_));
  main.variable(observer("viewof selection")).define("viewof selection", ["CohortGrid","data","maxCohorts"], _selection);
  main.variable(observer("csv")).define("csv", ["FileAttachment"], _csv);
  main.variable(observer("data")).define("data", ["processCohortData","csv"], _data);
  main.variable(observer("numCohorts")).define("numCohorts", ["d3","data"], _numCohorts);
  const child1 = runtime.module(define1);
  main.import("CohortGrid", child1);
  main.import("processCohortData", child1);
  main.import("validationRules", child1);
  const child2 = runtime.module(define2);
  main.import("Table", child2);
  return main;
}
