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
    
    var svg = document.querySelector("#editChart svg");
    if (svg.id.indexOf("barH") > -1) {
        chart.select("g").attr("transform", "translate(0, 20)");
    }
    
    // load palette colors
    var config = {}; 
    d3.select(".palette")
    .selectAll("li")
    .data(color.range()).enter()
    .append("li")
    .style("background-color", d => d)
    .on("click", (d, i) => config.color = d);

    // edit colors
    var rects = chart.selectAll("rect")
    .on("click", (d, i) => {
        var self = rects[0][i],
            parent = self.parentNode,
            cn = self.classList[0];
        self.style.fill = config.color;
        parent.querySelector("text."+cn).style.fill = config.color;
    }); 
    
    // edit position
    var text = null;
    /*var inline = editPanel.querySelector(".js-inlinedit");
    svg.addEventListener("click", (e) => {
        if (text) { text.setAttribute("stroke", "transparent"); }
        document.removeEventListener("keydown", moveText, false);
        if (e.target.classList.contains("axis")) {
            inline.classList.remove("d-n");                
            text = e.target;
            inline.textContent = text.textContent;
            inline.style.top = text.offsetTop + "px";
            inline.style.left = text.offsetLeft + "px";
            inline.focus();
            console.log(text.getBoundingClientRect(), e); 
            //TODO: debug position
        }
    }, false);*/
    svg.addEventListener("dblclick", (e) => {
        if (e.target.classList.contains("axis")) {
            text = e.target;
            text.setAttribute("stroke", "#333");
            document.addEventListener("keydown", moveText, false);
        }
    }, false);
    function moveText(e) {
        var key = e.keyCode,
            val = 0; 
        switch(key) {
            case 37: val = text.getAttribute("x"); text.setAttribute("x", parseInt(val)-1); break;
            case 39: val = text.getAttribute("x"); text.setAttribute("x", parseInt(val)+1); break;
            case 38: val = text.getAttribute("y"); text.setAttribute("y", parseInt(val)-1); e.preventDefault(); break; 
            case 40: val = text.getAttribute("y"); text.setAttribute("y", parseInt(val)+1); e.preventDefault(); break;
            default: break;
        }
    }
    

    // load embed code
    // TODO: svgContent, svg with x,y,viewbox

    var XMLS = new XMLSerializer(),
        code = XMLS.serializeToString(svg); 
    document.querySelector("#embedCode").textContent = code;
}
