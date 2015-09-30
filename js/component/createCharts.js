var color = d3.scale.ordinal()
    .range([
        "#4dc6dd", "#005789", 
        "#ff9b0b", "#fcdd03", "#ea6911", "#808080", 
        "#aad801"/*, "#bdbdbd", "#767676"*/ 
    ]);

function getData(data) {
    //data = data.filter((d, i) => cols.indexOf(i) !== -1);
    return data[0].map((d3, i) => data.map(d1 => d1[i]));
}

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
    // data
    //data = data[0];

    // view
    var h = (opt.height - opt.space + 1) / data.length,
        x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, opt.width - opt.space]);

    var chart = addChart(chartEl, "barH", opt);

    chart.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("fill", color(0))
    .attr("y", (d, i) => i * h)
    .attr("height", h - 1)
    .attr("width", d => x(d));
    
    //if (opt.update) { barHText(chart, groups, x, h); }
}

export function barVertical(chartEl, data, opt) {
    // data
    //data = data[0];

    // view
    var w = (opt.width - opt.space) / data.length,
        y = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([opt.height - opt.space, 0]);
    
    var chart = addChart(chartEl, "barV", opt);

    chart.selectAll(".rect")
    .data(data)
    // enter
    .enter().append("rect")
    .attr("fill", (d, i) => color(i))
    .attr("x", (d, i) => i * w)
    .attr("width", w - 1)
    .attr("y", d => y(d))
    .attr("height", d => opt.height - y(d) - opt.space)
    // update
    .attr("x", (d, i) => i * w)
    .attr("width", w - 1)
    .attr("y", d => y(d))
    .attr("height", d => opt.height - y(d) - opt.space)
    .on("click", d => console.log("change color of", d));
}

export function barHorizontalGroup(chartEl, data, opt, groups) {
    // data
    data = getData(data);
    
    // view
    var nGroups = data.length,
        nColors = data[0].length + 1.25;
    
    var h = (opt.height - opt.space) / (nGroups*nColors),
        x = d3.scale.linear()
    .domain([0, d3.max(data.map(arr => d3.max(arr)))])
    .range([0, opt.width - opt.space]);
    
    var chart = addChartGroups(chartEl, "barHG", data, opt)
    .attr("transform", (d, i) => "translate(0," + Math.round(i*nColors*h) + ")");
    
    chart.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .style("fill", (d, i) => color(i))
    .attr("y", (d, i) => Math.round(i * h))
    .attr("height", Math.round(h - 2))
    .attr("width", d => Math.round(x(d)));
    
    if (opt.update) { 
        barHTextLabel(chart, x, h); 
        barHTextGroup(chart, x, h, groups); 
    }
}

export function barVerticalGroup(chartEl, data, opt) {
    // data
    data = getData(data);
    
    // view
    var nGroups = data.length,
        nColors = data[0].length + 1;

    var w = (opt.width - opt.space) / (nGroups*nColors - 1),

        y = d3.scale.linear()
    .domain([0, d3.max(data.map(arr => d3.max(arr)))])
    .range([opt.height - opt.space, 0]);
    
    var chart = addChartGroups(chartEl, "barVG", data, opt)
    .attr("transform", (d, i) => "translate(" + i*nColors*w+ ",0)");
    
    chart.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .style("fill", (d, i) => color(i))
    .attr("x", (d, i) => i * w)
    .attr("width", w)
    .attr("y", d => y(d))
    .attr("height", d => opt.height - y(d) - opt.space);
}

export function barHorizontalGroupStack(chartEl, data, opt, groups) {
    // data
    data = getData(data);
        
    // view
    var nGroups = data.length * 2;
    
    var h = (opt.height - opt.space + 1) / nGroups,
        x = d3.scale.linear()
    .domain([0, d3.max(data.map(arr => d3.sum(arr)))])
    .range([0, opt.width - opt.space]);
    
    // data remap for stack
    data = data.map(f => {
        return f.map((d, i) => {
            return {x: d3.sum(f.slice(0, i)), width: d};
        });
    });

    var chart = addChartGroups(chartEl, "barHGS", data, opt)
    .attr("transform", (d, i) => "translate(0," + i*h*2 + ")");
    
    chart.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .style("fill", (d, i) => color(i))
    .attr("x", d => x(d.x))
    .attr("width", d => x(d.width))
    .attr("height", h - 1);
    
    //if (opt.update) { barHText(chart, groups, x, h, true); }
}

export function barHorizontalGroupStack100(chartEl, data, opt, groups) {
    // data
    data = getData(data);
    // data remap for stack 100%
    data = data.map(f => {
        var sum = d3.sum(f);
        return f.map((d, i) => {
            var x = d3.sum(f.slice(0, i));
            return {x: x*100/sum, width: d*100/sum, txt: d};
        });
    });
         
    // view
    var h = (opt.height - opt.space) / (data.length*2),
        x = d3.scale.linear()
    .domain([0, 100])
    .range([0, opt.width - opt.space]);
    
    var chart = addChartGroups(chartEl, "barHGS1", data, opt)
    .attr("transform", (d, i) => "translate(0," + i*h*2 + ")");
    
    chart.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .style("fill", (d, i) => color(i))
    .attr("x", d => x(d.x))
    .attr("width", d => x(d.width))
    .attr("height", h - 1);
    
    //if (opt.update) { barHText(chart, groups, x, h, true); }
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
    // data
    //data = data.filter((d, i) => cols.indexOf(i) !== -1);
    
    // view
    var w = (opt.width - opt.margin) / data[0].length,
        y = d3.scale.linear()
    .domain([0, d3.max(data.map(arr => d3.max(arr)))])
    .range([opt.height - opt.space, 0]);
    
    var line = d3.svg.line()
    .x((d, i) => Math.round(i*w*10)/10)
    .y(d => Math.round(y(d)*10)/10);
        
    var cn = (data.length===1) ? "line" : "lines";
    var chart = addChart(chartEl, cn, opt);
    
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
    var groups = data.groups,
        colors = data.keys;
    data = data.list;

    // view
    switch(type) {
        case "line":    lineChart(chart, [data[0]], opt); break; 
        case "barH":    barHorizontal(chart, data[0], opt, groups); break;
        case "barV":    barVertical(chart, data[0], opt); break;
        case "barHS1":  barHorizontalStack100(chart, data[0], opt); break;
        case "pie":     pieChart(chart, data[0], opt); break;
        case "lines":   lineChart(chart, data, opt); break; 
        case "barHG":   barHorizontalGroup(chart, data, opt, groups); break;
        case "barVG":   barVerticalGroup(chart, data, opt); break;
        case "barHGS":  barHorizontalGroupStack(chart, data, opt, groups); break;
        case "barHGS1": barHorizontalGroupStack100(chart, data, opt, groups); break;
        default: console.log("need a new chart!?");
    }
}

function barHTextLabel(chart, x, h) {
    chart.selectAll("text")
    .data(d => d)
    .enter().append("text")
    .style("fill", (d, i) => color(i))
    .attr("x", d => Math.round(x(d) + h/2))
    .attr("y", (d, i) => Math.round((i+1)*h) - 2)
    .text(d => d.toLocaleString()); //TODO: remove temp toLocale*
}

function barHTextGroup(chart, x, h, groups) {  
    chart
    .data(groups)
    .append("text")
    .attr("y", "-3")
    .text(d => d); 
}
