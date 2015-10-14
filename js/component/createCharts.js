var color = d3.scale.ordinal()
    .range([
        "#4dc6dd", "#ff9b0b", "#bdbdbd", 
        "#fcdd03", "#ea6911", 
        "#aad801", "#808080", "#dfdfdf", "#005789" 
    ]);

function addChart(el, id, opt) {
    var chart = el
        .append("svg")
        .attr("id", id)
        .attr("width", opt.width)
        .attr("height", opt.height)
        .append("g")
        .style("fill", "#808080")
        .attr("transform", "translate(" + opt.margin + "," + opt.margin + ")");
        
    return chart;
}    

function addChartGroups(el, id, data, opt) { 
    var chart = addChart(el, id, opt)
    .selectAll(".group")
    .data(data)
    .enter().append("g")
    .attr("class", "group");
    
    return chart;
}


export function barHorizontal(chartEl, data, opt) {
    console.log(data);    
    var nColor = data.count.group,
        nChart = (nColor*2) - 1,
        nPanel = (nColor*4);
   
    var h, hRect, hGroup;
    if (opt.height) {
        hRect = (opt.height - opt.space) / nChart;
        h = hRect * 2;
    } else {
        hRect = 12; 
        h = 14 * 3;
        opt.height = nColor * h; 
    }
    
    var x = d3.scale.linear()
    .domain([0, d3.max(data.clist[0])])
    .range([0, opt.width - opt.space]);

    var chart = addChart(chartEl, "barH", opt);

    chart.selectAll("rect")
    .data(data.clist[0])
    .enter().append("rect")
    .attr("class", (d,i) => "c"+i)
    .attr("fill", (d, i) => color(i))
    .attr("y", (d, i) => i * h)
    .attr("height", hRect)
    .attr("width", d => x(d));
    
    if (opt.update) { barHText(chart, x, h, data.group); } 
}

export function barVertical(chartEl, data, opt) {
    if(!opt.height) { opt.height = opt.width/1.618; } 
    var w = (opt.width - opt.space + 5) / data.count.group,
        y = d3.scale.linear()
    .domain([0, d3.max(data.clist[0])])
    .range([opt.height - opt.space, 0]);
    
    var chart = addChart(chartEl, "barV", opt);

    chart.selectAll(".rect")
    .data(data.clist[0])
    .enter().append("rect")
    .attr("class", (d,i) => "c"+i)
    .attr("fill", (d, i) => color(i))
    .attr("x", (d, i) => i * w)
    .attr("width", w - 5)
    .attr("y", d => y(d))
    .attr("height", d => opt.height - y(d) - opt.space);
}

export function barHorizontalGroup(chartEl, data, opt) {
    
    var nColor = data.count.color,
        nGroup = data.count.group,
        nChart = nGroup * (nColor+1) - 1,
        nPanel = nGroup * (nColor+2); 
    
    var h, hRect, hGroup;
    if (opt.height) {
        h = (opt.height - opt.space) / nChart;
        hRect = h - 1;
        hGroup = (nColor+1) * h;
    } else {
        h = 14;
        hRect = 4; 
        opt.height = nPanel * h; 
        hGroup = (nColor+2) * h;
    }
 
    var max = d3.max(data.glist.map(arr => d3.max(arr)));
    /*var x = d3.scale.linear()
    .domain([0, max])
    .range([0, opt.width - opt.space]);
    */
    var chart = addChartGroups(chartEl, "barHG", data.tests, opt)
    .attr("transform", (d, i) => "translate(0," + Math.round(i*hGroup) + ")");
    
    chart.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .style("stroke", "transparent")
    .style("stroke-width", 15)
    .style("fill", (d, i) => color(i))
    .attr("class", (d,i) => "c"+i)
    .attr("y", (d, i) => Math.round(i * h))
    .attr("height", hRect)
    .attr("width", d => Math.round(d.val*100/max) + "%");
    
    // add text
    if (opt.state !== null) { 
        barHTextLabel(chart, max, opt.width, h, nColor); 
        barHTextGroup(chart, data.group); 
    }
}

export function barVerticalGroup(chartEl, data, opt) {
    if(!opt.height) { opt.height = opt.width/1.618; } 
    
    var nColor = data.count.color + 1,
        nTotal = data.count.group * nColor - 1;

    var w = (opt.width - opt.space) / nTotal,
        y = d3.scale.linear()
    .domain([0, d3.max(data.glist.map(arr => d3.max(arr)))])
    .range([opt.height - opt.space, 0]);
    
    var chart = addChartGroups(chartEl, "barVG", data.glist, opt)
    .attr("transform", (d, i) => "translate(" + i*nColor*w+ ",0)");
    
    chart.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .style("fill", (d, i) => color(i))
    .attr("x", (d, i) => i * w)
    .attr("width", w - 1)
    .attr("y", d => y(d))
    .attr("height", d => opt.height - y(d) - opt.space);
}

export function barHorizontalGroupStack(chartEl, data, opt) {
    // data remap for stack
    var list = data.glist.map(f => {
        return f.map((d, i) => {
            return {x: d3.sum(f.slice(0, i)), width: d};
        });
    });
    
    var nColor = data.count.group,
        nChart = (nColor*2) - 1,
        nPanel = (nColor*4);
   
    var h, hRect, hGroup;
    if (opt.height) {
        hRect = (opt.height - opt.space) / nChart;
        h = hRect * 2;
    } else {
        hRect = 12; 
        h = 14 * 3;
        opt.height = nColor * h; 
    }
    
    var x = d3.scale.linear()
    .domain([0, d3.max(data.glist.map(arr => d3.sum(arr)))])
    .range([0, opt.width - opt.space]);

    var chart = addChartGroups(chartEl, "barHGS", list, opt)
    .attr("transform", (d, i) => "translate(0," + i*h + ")");
    
    chart.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .style("fill", (d, i) => color(i))
    .attr("x", d => x(d.x))
    .attr("width", d => x(d.width))
    .attr("height", hRect);
    
    if (opt.update) { barHTextGroup(chart, x, h, data.group); } 
}

export function barVerticalGroupStack(chartEl, data, opt) {
    if(!opt.height) { opt.height = opt.width/1.618; } 
    
    // data remap for stack
    var list = data.glist.map(f => {
        return f.map((d, i) => {
            return {y: d3.sum(f.slice(0, i+1)), height: d};
        });
    });

    var nTotal = data.count.group;

    var w = (opt.width - opt.space + 5) / nTotal,
        y = d3.scale.linear()
    .domain([0, d3.max(data.glist.map(arr => d3.sum(arr)))])
    .range([opt.height - opt.space, 0]);

    var chart = addChartGroups(chartEl, "barVGS", list, opt)
    .attr("transform", (d, i) => "translate(" + i*w + ",0)");
    
    chart.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .style("fill", (d, i) => color(i))
    .attr("width", w - 5)
    .attr("y", d => y(d.y))
    .attr("height", d => opt.height - y(d.height) - opt.space);
}

export function barHorizontalGroupStack100(chartEl, data, opt) {
    // data remap for stack 100%
    var list = data.glist.map(f => {
        var sum = d3.sum(f);
        return f.map((d, i) => {
            var x = d3.sum(f.slice(0, i));
            return {x: x*100/sum, width: d*100/sum, txt: d};
        });
    });
         
    // view
    var nColor = data.count.group,
        nChart = (nColor*2) - 1,
        nPanel = (nColor*4);
   
    var h, hRect, hGroup;
    if (opt.height) {
        hRect = (opt.height - opt.space) / nChart;
        h = hRect * 2;
    } else {
        hRect = 12; 
        h = 14 * 3;
        opt.height = nColor * h; 
    }
    
    var x = d3.scale.linear()
    .domain([0, 100])
    .range([0, opt.width - opt.space]);
    
    var chart = addChartGroups(chartEl, "barHGS1", list, opt)
    .attr("transform", (d, i) => "translate(0," + i*h + ")");
    
    chart.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .style("fill", (d, i) => color(i))
    .attr("x", d => x(d.x))
    .attr("width", d => x(d.width))
    .attr("height", hRect);
    
    if (opt.update) { barHTextGroup(chart, x, h, data.group); } 
}

export function barHorizontalStack100(chartEl, data, opt) {
    // data
    // data remap for stacked 100%
    var sum = d3.sum(data);
    data = data.map((f, i) => {
        var x = d3.sum(data.slice(0, i));
        return {x: x*100/sum, width: f*100/sum};
    });
   
    // view
    if(!opt.height) { opt.height = opt.width/1.618; } 
    var h = (opt.height - opt.space) / 3,
        x = d3.scale.linear()
    .domain([0, 100])
    .range([0, opt.width - opt.space]);
    
    var chart = addChart(chartEl, "barS1", opt)
    .attr("transform", "translate(" + opt.margin + "," + (opt.height/3-3) + ")");
    
    chart.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .style("fill", (d, i) => color(i))
    .attr("x", d => x(d.x))
    .attr("width", d => x(d.width))
    .attr("height", h);
}

export function pieChart(chartEl, data, opt) {
    if(!opt.height) { opt.height = opt.width/1.618; } 
    
    var radius = Math.min(opt.width, opt.height) / 2;
    
    var pie = d3.layout.pie().sort(null),
        arc = d3.svg.arc()
    .outerRadius(radius - opt.margin*2)
    .innerRadius(radius - radius*2/3);

    var chart = addChart(chartEl, "pie", opt)
    .attr("transform", "translate(" + (opt.width/2-opt.margin) + "," + (opt.height/2-opt.margin) + ")");
    
    chart
    .selectAll("path")
    .data(pie(data))
    .enter().append("path")
    .style("fill", (d, i) => color(i))
    .attr("d", arc);
}

export function treeMap(chartEl, data, opt) {
    // data remap for treemap
    var root = [];
    if (data.count.color === 1) {
        root = [{
            children: data.glist.map((d, i) => {
                return {"color": color(i), "size": d};
        })}];
    } else {
        root = [{
            children: data.clist.map((c, i) => {
                return {
                    children: c.map(d => {
                        return {"color": color(i), "size": d};
        })};})}];
    }
    // view
    if(!opt.height) { opt.height = opt.width/1.618; } 
    var treemap = d3.layout.treemap()
    .size([opt.width - opt.space + 2, opt.height - opt.space + 2])
    .sticky(true)
    .value(d => d.size);

    var chart = addChart(chartEl, "treemap", opt)
    .data(root)
    .selectAll("g") 
    .data(treemap.nodes)
    .enter().append("g")
    .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

    chart
    .append("rect")
    .style("fill", d => d.color)
    .style("stroke", "white")
    .style("stroke-width", 1)
    .attr("width", d => d.dx)
    .attr("height", d => d.dy);
}

export function lineChart(chartEl, data, opt) {
    if(!opt.height) { opt.height = opt.width/1.618; } 
    
    var w = (opt.width - opt.margin) / data[0].length,
        y = d3.scale.linear()
    .domain([0, d3.max(data.map(arr => d3.max(arr)))])
    .range([opt.height - opt.space, 0]);
    
    var line = d3.svg.line()
    .x((d, i) => Math.round(i*w*10)/10)
    .y(d => Math.round(y(d)*10)/10);
        
    var chart = addChart(chartEl, "line", opt);
    
    chart.selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke", (d, i) => color(i))
    .attr("stroke-width", 2)
    .attr("d", line);
}

export function dotsChart(chartEl, data, opt) {
    if(!opt.height) { opt.height = opt.width/1.618; } 
    
    var nGroup = data.count.group;

    var w = (opt.width - opt.margin) / nGroup,
        y = d3.scale.linear()
    .domain([0, d3.max(data.clist.map(arr => d3.max(arr)))])
    .range([opt.height - opt.space, 0]);
    
    var chart = addChartGroups(chartEl, "dots", data.clist, opt)
    .attr("fill", (d, i) => color(i));
    
    chart.selectAll("circle")
    .data(d => d)
    .enter().append("circle")
    .attr("cx", (d, i) => w*i)
    .attr("cy", d => y(d))
    .attr("r", 3);
}

export function drawCharts(chartEl, data, opt) {
     if (data.group.length === 1) {
        treeMap(chartEl, data, opt);
        // remap data to alter chart 
        data.clist = data.glist;
        data.count.group = data.count.color;
        pieChart(chartEl, data.clist[0], opt);
        barHorizontal(chartEl, data, opt);
        barVertical(chartEl, data, opt);
        barHorizontalStack100(chartEl, data.clist[0], opt);
        lineChart(chartEl, data.clist, opt);
    }
    else if (data.color.length === 1) {
        lineChart(chartEl, data.clist, opt);
        barHorizontalGroup(chartEl, data, opt);
        barVerticalGroup(chartEl, data, opt);
        barHorizontal(chartEl, data, opt);
        barVertical(chartEl, data, opt);
        barHorizontalStack100(chartEl, data.clist[0], opt);
        pieChart(chartEl, data.clist[0], opt);
        treeMap(chartEl, data, opt);
    } else {
        lineChart(chartEl, data.clist, opt);
        dotsChart(chartEl, data, opt);
        barHorizontalGroup(chartEl, data, opt);
        barVerticalGroup(chartEl, data, opt);
        barHorizontalGroupStack(chartEl, data, opt);
        barVerticalGroupStack(chartEl, data, opt);
        barHorizontalGroupStack100(chartEl, data, opt);
        treeMap(chartEl, data, opt);
    }
} 
export function drawChart(chart, data, opt, type) {
    switch(type) {
        case "barH":    barHorizontal(chart, data, opt); break;
        case "barV":    barVertical(chart, data, opt); break;
        case "barS1":   barHorizontalStack100(chart, data.clist[0], opt); break;
        case "pie":     pieChart(chart, data.clist[0], opt); break;
        case "treemap": treeMap(chart, data, opt); break; 
        case "line":    lineChart(chart, data.clist, opt); break; 
        case "dots":    dotsChart(chart, data, opt); break; 
        case "barHG":   barHorizontalGroup(chart, data, opt); break;
        case "barVG":   barVerticalGroup(chart, data, opt); break;
        case "barHGS":  barHorizontalGroupStack(chart, data, opt); break;
        case "barVGS":  barVerticalGroupStack(chart, data, opt); break;
        case "barHGS1": barHorizontalGroupStack100(chart, data, opt); break;
        default: console.log("need a new chart!?");
    }
}

function barHTextLabel(chart, max, w, h, n) {
    var isTooLong = false;    
    chart.selectAll(".x")
    .data(d => d)
    .enter().append("text")
    .attr("class", (d,i) => "axis x c"+i)
    .attr("x", d => {
        isTooLong = ((d.val+30)>max || n===1) ? true:false;
        return Math.round(d.val*100/max) + (isTooLong ? 0:1) + "%";
    })
    .attr("y", (d, i) => {
        isTooLong = ((d.val+30)>max || n===1) ? true:false;
        var shiftX = isTooLong ? (-8) : 8;
        return Math.round(i*h) + shiftX;
    })
    .style("fill", (d, i) => color(i))
    .style("text-anchor", d => {
        isTooLong = ((d.val+30)>max || n===1) ? true:false;
        return isTooLong ? "end" : "start";
    })
    .text(d => d.val.toLocaleString()); 
    //TODO: remove temp toLocale*
}

function barHTextGroup(chart, groups) {  
    chart
    .data(groups)
    .append("text")
    .attr("class", "axis y")
    .attr("x", 0)
    .attr("y", "-8")
    .text((d, i) => d); 
}

function barHText(chart, x, h, groups) {  
    chart
    .selectAll(".axis-y")
    .data(groups).enter()
    .append("text")
    .attr("class", "axis-y")
    .attr("x", 0)
    .attr("y", (d, i) => i*h - 8)
    .text(d => d); 
}
