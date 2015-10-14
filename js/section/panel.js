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
    
    // section control
    editPanel.classList.remove("d-n");
    document.querySelector(".sec-code > div").classList.remove("d-n");
    
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
    // TODO: restructure and rename
    var width = editPanel.querySelector(".panel-chart").offsetWidth;
    var chart = d3.select("#editChart");
    var svg, config = {},
        opt = { width: width,
                height: null,
                margin: 0,
                space: 0,
                state: "new"
              };
    // new
    drawChart(chart, data, opt, el.id); 
    
    config.width = editPanel.querySelector(".js-width");
    config.width.textContent = width; 
    editPanel.querySelector(".js-height").textContent = editPanel.querySelector(".panel-chart").offsetHeight;
    
    svg = editPanel.querySelector("#editChart svg");
    if (svg.id.indexOf("barH") > -1) {
        chart.select("g").attr("transform", "translate(0, 20)");
    } else {
        svg.setAttribute("viewBox", "0 0 "+ svg.getAttribute("width") + " " + svg.getAttribute("height"));
        svg.setAttribute("perserveAspectRatio", "xMinYmin meet");
        svg.setAttribute("height", "100%");
    }
    svg.setAttribute("width", "100%");
    
    // update
    function resizeChart() {
        config.width = editPanel.querySelector(".panel-chart").offsetWidth;
        if (width === config.width) return; 
        updateChart(width);
        width = config.width;
    }
    function updateChart(width) {
        //svg.setAttribute("width", width); 
        config.width.textContent = width; 
    }
    window.addEventListener('resize', throttle(resizeChart, 500));
    
    var res = editPanel.querySelector(".pos-res");
    editPanel.querySelector(".js-responsive").addEventListener("click", (e)=> {
        var w = e.target.dataset.res;
        if (w) { 
            updateChart(w); 
            res.style.left = w + "px"; 
            editPanel.querySelector(".panel-chart").style.width = w + "px";
        }
        else { 
            console.log(res, e.offsetX + "px");
        } 
    });


    // load palette colors
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
                val = text.getAttribute("x"); 
                text.setAttribute("x", parseInt(val)-1); break;
            case 39: 
                val = text.getAttribute("x"); 
                text.setAttribute("x", parseInt(val)+1); break;
            case 38: 
                val = text.getAttribute("y"); 
                text.setAttribute("y", parseInt(val)-1); 
                e.preventDefault(); break; 
            case 40: 
                val = text.getAttribute("y"); 
                text.setAttribute("y", parseInt(val)+1); 
                e.preventDefault(); break;
            default: break;
        }
    }
    

    // load embed code
    sectionCode(editPanel);    
}
