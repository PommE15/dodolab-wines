var width = (1024 + 30) / 4,
    height = 240;

export function barHorizontal(chartList, data, barField) {

    var margin = 10,
        border = 10,
        barHeight = (height - margin*2 - border*2) / data.length;

    var x = d3.scale.linear()
    .domain([0, d3.max(data, d => d[barField])])
    .range([0, width - margin*2 - border*3]);

    var chart = chartList
    .append("svg")
    .attr("class", "chart-bar")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (margin+1) + "," + (margin+1) + ")");

    chart.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("y", (d, i) => i * barHeight)
    .attr("height", barHeight - 1)
    .attr("width", d => x(d[barField]));
}

export function barVertical(chartList, data, barField) {
    
    var margin = 10,
        border = 10,
        barWidth = (width - margin*2 - border*2) / data.length;

    var y = d3.scale.linear()
    .domain([0, d3.max(data, d => d[barField])])
    .range([height - margin*2 - border*3, 0]);

    var chart = chartList
    .append("svg")
    .attr("class", "chart-bar")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");
    
    chart.selectAll(".rect")
    .data(data)
    .enter().append("rect")
    .attr("x", (d, i) => i * barWidth)
    .attr("width", barWidth - 1)
    .attr("y", d => y(d[barField]))
    .attr("height", d => {
        var h = height - y(d[barField]) - margin*2 - border*2;
        return h;
    });
}
