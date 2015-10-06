/* section 2. charts */
import { barHorizontal, barVertical, barHorizontalGroup, barVerticalGroup, barHorizontalStack100, barHorizontalGroupStack, barVerticalGroupStack, barHorizontalGroupStack100, pieChart, lineChart } from "js/component/createCharts";
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
        space : 40  //margin*2 + border*2,
    };
    
    console.log("data chart:");
    console.log(data);
    console.log("======");
    
    if (data.group.length === 1) {
        //TODO: fix demo charts
        barHorizontalGroup(chartEl, data, opt);
        barVerticalGroup(chartEl, data, opt);
        barHorizontal(chartEl, data.clist, opt);
        barVertical(chartEl, data.clist, opt);
        //barHorizontalGroupStack(chartEl, data, opt);
    }
    else if (data.color.length === 1) {
        lineChart(chartEl, data.clist, opt);
        barHorizontalGroup(chartEl, data, opt);
        barVerticalGroup(chartEl, data, opt);
        barHorizontal(chartEl, data.clist[0], opt);
        barVertical(chartEl, data.clist[0], opt);
        barHorizontalStack100(chartEl, data.clist[0], opt);
        pieChart(chartEl, data.clist[0], opt);
    } else {
        lineChart(chartEl, data.clist, opt);
        barHorizontalGroup(chartEl, data, opt);
        barVerticalGroup(chartEl, data, opt);
        barHorizontalGroupStack100(chartEl, data, opt);
        barHorizontalGroupStack(chartEl, data, opt);
        barVerticalGroupStack(chartEl, data, opt);
        barHorizontalStack100(chartEl, data.clist[0], opt);
        pieChart(chartEl, data.clist[0], opt);
    }
    
    // load panel 
    chartList.addEventListener("click", function(e) {
        var el = e.target;
        if (el instanceof SVGElement) { 
            sectionPanel(el, data); 
        }
    }, false);
}
