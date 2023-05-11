// https://observablehq.com/@observablehq/templates-table-of-instructions@55
function _1(toc,instructions,md){return(
md`# Templates: Table of Instructions

${toc(instructions)}

This sidebar goes at the top of a template to link to more detailed instructions below. It’s passed a DOM node that contains an \`<h2>\` tag representing the start of the instructional section. It lists the \`<h2>\`’s title in bold, followed by each \`<h3>\` until the next \`<h2>\` (often an Appendix). Finally, it has a “details…” link that assumes the instructional cell is named \`instructions\`.

You can see an example below.`
)}

function _instructions(md){return(
md`---
## How to add instructions
### 1. Import the function
### 2. Write your instructions
### 3. Call the function`
)}

function _3(md){return(
md`The table is hidden if the window is too narrow to contain both a standard 640px paragraph and the 200px sidebar.

This is not a general-purpose table of contents; it is an overfit solution for autogenerating a very specific design used on certain notebooks in Observable’s collection of first-party [Templates](https://observablehq.com/templates). For a more general solution, see Mike Bostock’s [TOC](https://observablehq.com/@mbostock/toc) or one of its forks.`
)}

function _4(md){return(
md`---
## Appendix`
)}

function _toc(width,htl){return(
instructions => {
  const tocWidth = 200;
  const paragraphWidth = 640;
  if (width < paragraphWidth + tocWidth) return "";
  const instructionsTitle = instructions.querySelector("h2").innerText;
  const headers = Array.from(document.querySelectorAll("h2, h3")).map(d => [d.tagName, d.innerText])
  const start = headers.indexOf(headers.find(d => d[1] === instructionsTitle))
  const end = headers.indexOf(headers.find((d, i) => d[0] === "H2" && i > start))
  const subheds = headers.slice(start + 1, end !== -1 ? end : undefined)
  return htl.html`<div style=${{
    width: `${tocWidth}px`, 
    float: "right", 
    fontFamily: "var(--sans-serif)", 
    fontSize: "12px", 
    marginTop: "12px"
  }}>






  
    <strong>${instructionsTitle}</strong>
    ${subheds.map(d => htl.html`<div>${d[1]}</div>`)}
    <div><a href="#instructions">details…</a></div>
  </div>`
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["toc","instructions","md"], _1);
  main.variable(observer("instructions")).define("instructions", ["md"], _instructions);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("toc")).define("toc", ["width","htl"], _toc);
  return main;
}
