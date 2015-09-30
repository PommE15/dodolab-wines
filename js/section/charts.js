/* section 2. charts */
import { barHorizontal, barVertical, barHorizontalGroup, barVerticalGroup, barHorizontalStack100, barHorizontalGroupStack, barHorizontalGroupStack100, pieChart, lineChart } from "js/component/createCharts";
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
    var width = (1024 + 30) / 4,
        opt = {
        width : width,
        height: Math.round(width * 2 * 10 / 3)/10,
        margin: 10, //border: 10,
        space : 40,  //margin*2 + border*2
    };
    
    lineChart(chartEl, [data.list[0]], opt);
    lineChart(chartEl, data.list, opt);
    
    barHorizontal(chartEl, data.list[0], opt);
    barVertical(chartEl, data.list[0], opt);
    //barHorizontalGroup(chartEl, data.list, [4]);
    //barVerticalGroup(chartEl, data.list, [5]);
    
    barHorizontalGroup(chartEl, data.list, opt);
    barVerticalGroup(chartEl, data.list, opt);
    barHorizontalGroupStack(chartEl, data.list, opt);
    barHorizontalGroupStack100(chartEl, data.list, opt);
    
    barHorizontalStack100(chartEl, data.list[0], opt);
    pieChart(chartEl, data.list[0], opt);
    
    // load panel 
    chartList.addEventListener("click", function(e) {
        var el = e.target;
        if (el instanceof SVGElement) { 
            sectionPanel(el, data); 
        }
    }, false);
}
