/* section 2. charts */
import {drawCharts} from "js/component/createCharts";
import sectionPanel from "js/section/panel"; 

export default function(data) {
    
    var chartId = "#chartList",
        chartList = document.querySelector(chartId),
        chartEl = d3.select(chartId);
    
    // load charts
    chartList.classList.remove("d-n");
    // remove all childnodes
    while(chartList.firstChild) {
        chartList.removeChild(chartList.firstChild);
    }
    
    // draw charts
    // TODO: responsive on resize
    var num = 6,
        width = (1024 + (num-1)*10) / num,
        opt = {
        width : width,
        height: Math.round(width * 2 * 10 / 3)/10,
        margin: 10, //border: 10,
        space : 40, //margin*2 + border*2,
        state : null
    };
    
    console.log("data chart:");
    console.log(data);
    console.log("======");
    
    drawCharts(chartEl, data, opt);

    // load panel 
    chartList.addEventListener("click", function(e) {
        var el = e.target;
        if (el instanceof SVGElement) { 
            sectionPanel(el, data); 
            window.location.hash = ""; // hack!?
            window.location.hash = "#sec3b";
        }
    }, false);
}
