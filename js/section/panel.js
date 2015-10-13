import editPanelHTML from "html/editPanel.html!text";
import {drawChart} from "js/component/createCharts";
import sectionCode from "js/section/code"; 
import {throttle} from "js/lib/underscore-lite";

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
    
    // load svg and text to the panel
    var width = editPanel.querySelector(".panel-chart").offsetWidth;
    var chart = d3.select("#editChart");
    var svg,
        opt = { width: width,
                height: null,
                margin: 0,
                space: 0,
                state: "new"
              };
    // new
    drawChart(chart, data, opt, el.id); 
    svg = document.querySelector("#editChart svg");
    if (svg.id.indexOf("barH") > -1) {
        chart.select("g").attr("transform", "translate(0, 20)");
    }
    // update
    function updateChart() {
        opt.width = editPanel.querySelector(".panel-chart").offsetWidth;
        if (width === opt.width) return; 
        
        svg.setAttribute("width", width); 
        width = opt.width;
    }
    window.addEventListener('resize', throttle(updateChart, 500));
    /*console.log(data);
    chart.append("div")
    .selectAll(".y")
    .data(data.group).enter()
    .append("div")
    .style("position", "absolute")
    .style("left", 0)
    .style("top", (d, i) => i*42-1+"px")
    .attr("contenteditable", "true")
    .text(d => d);
    */

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
    
    svg.addEventListener("click", (e) => {
        if (text) { text.setAttribute("stroke", "transparent"); }
        document.removeEventListener("keydown", moveText, false);
    }, false);
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
            case 37: 
                val = text.getAttribute("x"); text.setAttribute("x", parseInt(val)-1); break;
            case 39: 
                val = text.getAttribute("x"); text.setAttribute("x", parseInt(val)+1); break;
            case 38: 
                val = text.getAttribute("y"); text.setAttribute("y", parseInt(val)-1); 
                e.preventDefault(); break; 
            case 40: 
                val = text.getAttribute("y"); text.setAttribute("y", parseInt(val)+1); 
                e.preventDefault(); break;
            default: break;
        }
    }
    

    // load embed code
    sectionCode(editPanel);    
}
