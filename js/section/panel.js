import editPanelHTML from "html/editPanel.html!text";
import {drawPanel} from "js/component/createCharts";

var color = d3.scale.ordinal()
    .range([
        "#4dc6dd", "#ff9b0b", "#bdbdbd", 
        "#fcdd03", "#ea6911", 
        "#aad801", "#808080", "#dfdfdf", "#005789" 
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
    .style("color", (d, i) => data.count.color!==1 ? color(i):"#808080")
    .style("border-right", (d, i) => i<(data.count.color-1) ? "2px solid #bdbdbd":"none")
    .style("margin-right", "5px")
    .style("padding-right", "5px")
    .attr("contentEditable", true)
    .text(d => data.count.color!==1 ? d:"Key or second line here if needed");
    
    // load svg chart to the panel
    var width = 620;
    var chart = d3.select("#editChart");
    
    drawPanel(chart, data, {
        width: width,
        height: null,
        margin: 0,
        space: 0,
        update: true
        }, el.id);
    
    var svgId = document.querySelector("#editChart svg").id;
    if (svgId.indexOf("barH") > -1) {
        chart.select("g").attr("transform", "translate(0, 20)");
    }
    
    // load palette colors
    var config = {};
    d3.select(".palette")
    .selectAll("li")
    .data(color.range()).enter()
    .append("li")
    .style("background-color", d => d)
    .on("click", d => config.color = d);

    // edit panel
    var rects = chart.selectAll("rect")
    .on("click", (d, i) => {
        var self = rects[0][i],
            parent = self.parentNode,
            cn = self.classList[0];
        self.style.fill = config.color;
        parent.querySelector("text."+cn).style.fill = config.color;
    }); 
    console.log(rects);

    // load embed code
    // TODO: svgContent, svg with x,y,viewbox
    var svg = document.querySelector("#editChart svg");

    var XMLS = new XMLSerializer(),
        code = XMLS.serializeToString(svg); 
    document.querySelector("#embedCode").textContent = code;
}
