// https://observablehq.com/@observablehq/table-validator@276
function _1(md){return(
md`# Table Validator

Wraps the standard Table input to flag invalid cells and provide a summary of warnings at the bottom, using two new Table options: 

- \`dataRules\`: array of functions that will be called with data and should return either \`true\` or a warning string
- \`columnRules\`: object of functions (with column names as keys) that will be called with cell values and should return either \`true\` or a warning string`
)}

function _data(FileAttachment){return(
FileAttachment("targets-1.csv").csv({typed: true})
)}

function _validator(Table,data){return(
Table(data, {
  dataRules: [data => data.length <= 5 || "Data cannot have more than 5 rows"], 
  columnRules: {actual: d => d !== 0 || "Cannot be zero"}
})
)}

function _4(md){return(
md`It’s a view, and the standard Table’s checkboxes still work:`
)}

function _5(validator){return(
validator
)}

function _6(md){return(
md`This is a fairly thin wrapper; you can also just 

1. Use \`getWarningFormatter\` to pass a formatter to the standard Table and
2. Use \`renderWarnings\` and \`getColumnWarnings\` summarize the warnings:`
)}

function _columnRules(){return(
{actual: d => d !== 0 || "Cannot be zero"}
)}

function _8(Inputs,data,getWarningFormatter,columnRules){return(
Inputs.table(data, {format: getWarningFormatter(columnRules)})
)}

function _9(renderWarnings,getColumnWarnings,columnRules,data){return(
renderWarnings(getColumnWarnings(columnRules, data))
)}

function _10(md){return(
md`---
## Implementation`
)}

function _Table(getDataWarnings,getColumnWarnings,getWarningFormatter,Inputs,htl,renderWarnings){return(
(data, {dataRules = [], columnRules = {}, ...options} = {}) => {
  const dataWarnings = getDataWarnings(dataRules, data);
  const columnWarnings = getColumnWarnings(columnRules, data)
  const format = getWarningFormatter(columnRules)
  const tableNode = Inputs.table(data, {...options, format});
  const node = htl.html`
    ${tableNode}
    ${renderWarnings([...dataWarnings, ...columnWarnings])}
  `
  node.value = data;
  tableNode.addEventListener("input", e => {
    console.log(e)
    node.value = e.currentTarget.value
  });
  return node;
}
)}

function _renderWarnings(htl,warningStyle,badge){return(
warnings => htl.html`${warnings.map(warning => htl.html`<div style=${warningStyle}>
  ${badge()} ${warning}
</div>`)}`
)}

function _getWarningFormatter(htl,reddish,formatAuto){return(
columnRules => Object.fromEntries(Object.keys(columnRules).map(
  col => [
    col, 
    d => columnRules[col](d) !== true 
      ? htl.html`<div style=${{background: reddish}}>${formatAuto(d)}</div>`
      : formatAuto(d)
  ]))
)}

function _getDataWarnings(){return(
(dataRules, data) => dataRules.map(rule => rule(data)).filter(d => d)
)}

function _getColumnWarnings(htl){return(
(columnRules, data) => Object.keys(columnRules).map(
      col => {
        const warnings = data.map(row => columnRules[col](row[col])).filter(d => d !== true)
        return warnings.length 
          && htl.html`<code style=${{fontSize: "inherit"}}>${col}</code>: ${warnings[0]} ${warnings.length > 1 ? `(${warnings.length})` : ""}`
      }).filter(d => d)
)}

function _badge(htl,reddish){return(
() => htl.html`<div style=${{
  display: "inline-block",
  textTransform: "uppercase",
  font: "10px var(--sans-serif)",
  borderRadius: "3px",
  padding: "2px 5px",
  fontSize: "10px",
  fontWeight: "bold",
  background: reddish
}}>
  !
</div>`
)}

function _warningStyle(){return(
{
  font: "12px var(--sans-serif)",
  padding: "3px 0"
}
)}

function _reddish(){return(
"rgba(255, 165, 0, 0.15)"
)}

function _formatAuto()
{
  function stringify(x) {
    return x == null ? "" : x + "";
  }
  
  function formatAuto(value) {
    return value == null ? ""
      : typeof value === "number" ? formatNumber(value)
      : value instanceof Date ? formatDate(value)
      : value + "";
  }
  
  function formatNumber(value) {
    return value === 0 ? "0" : value.toLocaleString("en"); // handle negative zero
  }
  
  function formatDate(date) {
    var hours = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds(),
        milliseconds = date.getUTCMilliseconds();
    return isNaN(date) ? "Invalid Date"
        : formatYear(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
        + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
        : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
        : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
        : "");
  }
  
  function formatYear(year) {
    return year < 0 ? "-" + pad(-year, 6) : year > 9999 ? "+" + pad(year, 6) : pad(year, 4);
  }
  
  function pad(value, width) {
    return (value + "").padStart(width, "0");
  }

  return formatAuto;
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["targets-1.csv", {url: new URL("./files/c2a61cc0354ee791571922d79246a74bc75ccc575efe6ebf1369dcf412f97bfdb01c11cc4b999efc4ec5cce301676c665a1d394ca7b5465e8cbc045a2b764681.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("viewof validator")).define("viewof validator", ["Table","data"], _validator);
  main.variable(observer("validator")).define("validator", ["Generators", "viewof validator"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["validator"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("columnRules")).define("columnRules", _columnRules);
  main.variable(observer()).define(["Inputs","data","getWarningFormatter","columnRules"], _8);
  main.variable(observer()).define(["renderWarnings","getColumnWarnings","columnRules","data"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("Table")).define("Table", ["getDataWarnings","getColumnWarnings","getWarningFormatter","Inputs","htl","renderWarnings"], _Table);
  main.variable(observer("renderWarnings")).define("renderWarnings", ["htl","warningStyle","badge"], _renderWarnings);
  main.variable(observer("getWarningFormatter")).define("getWarningFormatter", ["htl","reddish","formatAuto"], _getWarningFormatter);
  main.variable(observer("getDataWarnings")).define("getDataWarnings", _getDataWarnings);
  main.variable(observer("getColumnWarnings")).define("getColumnWarnings", ["htl"], _getColumnWarnings);
  main.variable(observer("badge")).define("badge", ["htl","reddish"], _badge);
  main.variable(observer("warningStyle")).define("warningStyle", _warningStyle);
  main.variable(observer("reddish")).define("reddish", _reddish);
  main.variable(observer("formatAuto")).define("formatAuto", _formatAuto);
  return main;
}
