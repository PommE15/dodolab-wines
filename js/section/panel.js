import editPanelHTML from "html/editPanel.html!text";
import {drawChart} from "js/component/createCharts";

var color = d3.scale.ordinal()
    .range([
        "#4dc6dd", "#005789", 
        "#ff9b0b", "#fcdd03", "#ea6911", "#808080", 
        "#aad801"/*, "#bdbdbd", "#767676"*/ 
    ]);

export default function(el, data, cols) {
    // load edit panel
    var editPanel;
    editPanel = document.querySelector("#editPanel");
    editPanel.innerHTML = editPanelHTML;
    
    // load chart keys
    var colorKeys = data.color;//data.keys.slice(1, data.keys.length);
    d3.select(".js-keys")
    .selectAll("span")
    .data(colorKeys).enter()
    .append("span")
    .style("color", (d, i) => color(i))
    .style("border-right", (d, i) => i<(data.count.color-1) ? "2px solid #bdbdbd":"none")
    .style("margin-right", "5px")
    .style("padding-right", "5px")
    .attr("contentEditable", true)
    .text(d => d);
    
    // load svg chart to the panel
    var width = 620,
        units = (data.clist.length + 1.25)*data.group.length,
        height = Math.round(14*units);
        //height = Math.round(width*2/3);
    
    var chart = d3.select("#editChart");
    drawChart(chart, data, {
        width: width,
        height: height,
        margin: 0,
        space: 0,
        update: true
        }, el.id);
 
    chart.select("g")
    .attr("transform", "translate(0, 15)");
    
    // load embed code
    // TODO: svgContent, svg with x,y,viewbox
    var svg = document.querySelector("#editChart svg");

    var XMLS = new XMLSerializer(),
        code = XMLS.serializeToString(svg); 
    document.querySelector("#embedCode").textContent = code;
}
