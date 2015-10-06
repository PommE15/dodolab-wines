var color = d3.scale.ordinal()
    .range([
        "#4dc6dd", "#005789", 
        "#ff9b0b", "#fcdd03", "#ea6911", "#808080", 
        "#aad801"/*, "#bdbdbd", "#767676"*/ 
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
    .attr("class", "g");
    
    return chart;
}


export function barHorizontal(chartEl, data, opt, groups) {
    
    var h = (opt.height - opt.space) / (data.length*2 - 1),
        x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, opt.width - opt.space]);

    var chart = addChart(chartEl, "barH", opt);

    chart.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("fill", (d, i) => color(i))
    .attr("y", (d, i) => i * h * 2)
    .attr("height", h)
    .attr("width", d => x(d));
}

export function barVertical(chartEl, data, opt) {
    
    var w = (opt.width - opt.space + 5) / (data.length),
        y = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([opt.height - opt.space, 0]);
    
    var chart = addChart(chartEl, "barV", opt);

    chart.selectAll(".rect")
    .data(data)
    .enter().append("rect")
    .attr("fill", (d, i) => color(i))
    .attr("x", (d, i) => i * w)
    .attr("width", w - 5)
    .attr("y", d => y(d))
    .attr("height", d => opt.height - y(d) - opt.space);
}

export function barHorizontalGroup(chartEl, data, opt) {
    
    var nColor = data.count.color + 1,
        nTotal = data.count.group * nColor - 1; 

    var h = (opt.height - opt.space) / nTotal,
        x = d3.scale.linear()
    .domain([0, d3.max(data.glist.map(arr => d3.max(arr)))])
    .range([0, opt.width - opt.space]);
    
    var chart = addChartGroups(chartEl, "barHG", data.glist, opt)
    .attr("transform", (d, i) => "translate(0," + Math.round(i*nColor*h) + ")");
    
    chart.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .style("fill", (d, i) => color(i))
    .attr("y", (d, i) => Math.round(i * h))
    .attr("height", h - 1)
    .attr("width", d => Math.round(x(d)));
    
    if (opt.update) { 
        barHTextLabel(chart, x, h); 
        barHTextGroup(chart, x, h, data.group); 
    }
}

export function barVerticalGroup(chartEl, data, opt) {
    
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
    
    var nTotal = data.count.group * 2 - 1;
    
    var h = (opt.height - opt.space) / nTotal,
        x = d3.scale.linear()
    .domain([0, d3.max(data.glist.map(arr => d3.sum(arr)))])
    .range([0, opt.width - opt.space]);

    var chart = addChartGroups(chartEl, "barHGS", list, opt)
    .attr("transform", (d, i) => "translate(0," + i*h*2 + ")");
    
    chart.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .style("fill", (d, i) => color(i))
    .attr("x", d => x(d.x))
    .attr("width", d => x(d.width))
    .attr("height", h);
    
    if (opt.update) { barHTextGroup(chart, x, h, data.group); } 
}

export function barVerticalGroupStack(chartEl, data, opt) {
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
    var nTotal = data.count.group * 2 - 1;
    
    var h = (opt.height - opt.space) / nTotal,
        x = d3.scale.linear()
    .domain([0, 100])
    .range([0, opt.width - opt.space]);
    
    var chart = addChartGroups(chartEl, "barHGS1", list, opt)
    .attr("transform", (d, i) => "translate(0," + i*h*2 + ")");
    
    chart.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .style("fill", (d, i) => color(i))
    .attr("x", d => x(d.x))
    .attr("width", d => x(d.width))
    .attr("height", h);
    
    if (opt.update) { barHTextGroup(chart, x, h, data.group); } 
}

export function barHorizontalStack100(chartEl, data, opt, groups) {
    // data
    // data remap for stacked 100%
    var sum = d3.sum(data);
    data = data.map((f, i) => {
        var x = d3.sum(data.slice(0, i));
        return {x: x*100/sum, width: f*100/sum};
    });
   
    // view
    var h = (opt.height - opt.space) / 3,
        x = d3.scale.linear()
    .domain([0, 100])
    .range([0, opt.width - opt.space]);
    
    var chart = addChart(chartEl, "barHS1", opt)
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
    // data
    data = data
    .filter((d, i) => i<7); //TODO: remove after
    
    // view
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

export function lineChart(chartEl, data, opt) {
    
    var w = (opt.width - opt.margin) / data[0].length,
        y = d3.scale.linear()
    .domain([0, d3.max(data.map(arr => d3.max(arr)))])
    .range([opt.height - opt.space, 0]);
    
    var line = d3.svg.line()
    .x((d, i) => Math.round(i*w*10)/10)
    .y(d => Math.round(y(d)*10)/10);
        
    //var cn = (data.length===1) ? "line" : "lines";
    var chart = addChart(chartEl, "lines", opt);
    
    chart.selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke", (d, i) => color(i))
    .attr("stroke-width", 2)
    .attr("d", line);
}

export function drawChart(chart, data, opt, type) {
    // data
    
    // view
    switch(type) {
        //case "line":    lineChart(chart, [data[0]], opt); break; 
        case "barH":    barHorizontal(chart, data.clist[0], opt); break;
        case "barV":    barVertical(chart, data.clist[0], opt); break;
        case "barHS1":  barHorizontalStack100(chart, data.clist[0], opt); break;
        case "pie":     pieChart(chart, data.clist[0], opt); break;
        case "lines":   lineChart(chart, data.clist, opt); break; 
        case "barHG":   barHorizontalGroup(chart, data, opt); break;
        case "barVG":   barVerticalGroup(chart, data, opt); break;
        case "barHGS":  barHorizontalGroupStack(chart, data, opt); break;
        case "barVGS":  barVerticalGroupStack(chart, data, opt); break;
        case "barHGS1": barHorizontalGroupStack100(chart, data, opt); break;
        default: console.log("need a new chart!?");
    }
}

function barHTextLabel(chart, x, h) {
    chart.selectAll("text")
    .data(d => d)
    .enter().append("text")
    .attr("x", d => {
        var posX = x(d);
        return (posX > 600 ? 100 : Math.round((posX+h/2)/0.62)/10) + "%";
    })
    .attr("y", (d, i) => {
        var posX = x(d),
            idx = posX > 600 ? i : i+1;
        return Math.round((idx)*h) - 2;
    })
    .style("fill", (d, i) => color(i))
    .style("text-anchor", d => {
        var posX = x(d);
        return (posX > 600) ? "end" : "start";
    })
    .text(d => d.toLocaleString()); 
    //TODO: remove temp toLocale*
}

function barHTextGroup(chart, x, h, groups) {  
    chart
    .data(groups)
    .append("text")
    .attr("y", "-3")
    .text(d => d); 
}
