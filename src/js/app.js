import axios from 'axios'
import { selection, select, selectAll } from 'd3-selection'
import * as d3 from 'd3-shape'
//import * as d3time from 'd3-time'
import * as d3time from 'd3-time-format'
import * as d3scale from 'd3-scale'
import * as d3request from 'd3-request'
import * as d3array from 'd3-array'
import * as d3axis from 'd3-axis'
import config from './../../config.json'

var dataurl = config.docDataUrl;

function drawlinechart(data, selector, ticks, zeroy, interval, destination, chartType, numberOfDataSeries) {

    var destinationdiv = window.parent.document.querySelector('figure[data-alt="' + destination + '"]');
    if (destinationdiv != null) {
        var destwidth = destinationdiv.clientWidth;
    }

    var svg = select("svg" + selector), margin = { top: 20, right: 20, bottom: 20, left: 40 },
        // width = +svg.attr("width") - margin.left - margin.right,
        // height = +svg.attr("height") - margin.top - margin.bottom,
        outerwidth = destwidth ? destwidth : 500,
        outerheight = destwidth ? destwidth * 0.61 : 500 * 0.61,
        innerheight = outerheight - margin.top - margin.bottom,
        innerwidth = outerwidth - margin.left - margin.right,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.attr("width", outerwidth).attr("height", outerheight);

    // if (selector == ".borrowing") {
    //     var parseTime = d3time.timeParse("%b");
    // } else 
    if (interval == "month") {
        var parseTime = d3time.timeParse("%b %Y");
    } else if (interval == "day") {
        var parseTime = d3time.timeParse('%e-%b-%Y')
    }

    if (chartType == "line") {
        var x = d3scale.scaleTime()
            .rangeRound([0, innerwidth]);
    } else if (chartType == "bar") {
        var x = d3scale.scaleBand().rangeRound([0, innerwidth]).padding(0.1)
    }

    var y = d3scale.scaleLinear()
        .rangeRound([innerheight, 0]);

    var line = d3.line()
        .x(function (d) {
            return x(d.Date);
        })
        .y(function (d) {
            return y(d.Value);
        });

    if (numberOfDataSeries > 1) {
        var line2 = d3.line()
            .x(function (d) {
                return x(d.Date);
            })
            .y(function (d) {
                return y(d.Value2);
            });

    }

    if (numberOfDataSeries > 2) {
        var line3 = d3.line()
            .x(function (d) {
                if (d.Value3){
                    return x(d.Date);
                }
            })
            .y(function (d) {
                if (d.Value3) {
                    return y(d.Value3);
                }
            });

    }




    data.map(function (d) {
        d.Date = parseTime(d.Date);
        d.Value = parseFloat(d.Value);
        if (numberOfDataSeries > 1) {
            d.Value2 = parseFloat(d.Value2);
        }
        if (numberOfDataSeries > 2) {
            if (!isNaN(parseFloat(d.Value3))) {
                d.Value3 = parseFloat(d.Value3);
            }
            else {
                delete d.Value3;
            }
        }

    })


    // var junes = data.filter(function (d) {
    //     return d.Date.getMonth() == 5;
    // })

    if (interval == "month") {
        var june2016 = data.filter(function (d) {
            return d.Date.getMonth() == 5 && d.Date.getFullYear() == 2016;
        })
    } else if (interval == "day") {
        var june2016 = data.filter(function (d) {
            return d.Date.getMonth() == 5 && d.Date.getFullYear() == 2016 && d.Date.getDate() == 23;
        })
    }

    if (interval == "month") {
        var june2017 = data.filter(function (d) {
            return d.Date.getMonth() == 5 && d.Date.getFullYear() == 2017;
        })
    } else if (interval == "day") {
        var june2017 = data.filter(function (d) {
            return d.Date.getMonth() == 5 && d.Date.getFullYear() == 2017 && d.Date.getDate() == 23;
        })
    }

    if (chartType == "line") {
        x.domain(d3array.extent(data, function (d) { return d.Date; }));
    } else if (chartType == "bar") {
        x.domain(data.map(function (d) { return d.Date; }));
    }

    if (zeroy == true) {
        y.domain([0, d3array.max(data, function (d) { return d.Value; })]);
    } else {
        if (numberOfDataSeries == 1) {
            y.domain(d3array.extent(data, function (d) { return d.Value; }));
        }
        else if (numberOfDataSeries == 2) {
            var combineddata = data.map(function (d) {
                return d.Value;
            }).concat(data.map(function (d) { return d.Value2 }));
            y.domain(d3array.extent(combineddata), function (d) { return d })
        }

    }


    if (selector != ".borrowing") {

        g.append("g")
            .attr("class", "gv-brexit-tick")
            .attr("transform", "translate(0," + innerheight + ")")
            .call(d3axis.axisBottom(x)
                .tickValues(june2016.map(function (d) {
                    return d.Date;
                })).
                tickFormat(d3time.timeFormat('%b %Y'))
                .tickSize(-innerheight))
        // .select(".domain")
        //   .remove();


        g.append("g")
            .attr("transform", "translate(0," + innerheight + ")")
            .call(d3axis.axisBottom(x)
                .tickValues(june2017.map(function (d) {
                    return d.Date;
                }))
                .tickFormat(d3time.timeFormat('%b %Y')))
    }

    g.append("g")
        .attr("class", "gv-horizontal-grid")
        .attr("transform", "translate(-40,0)")
        .call(d3axis.axisLeft(y)
            .ticks(ticks)
            .tickSize(
                (-innerwidth) - 40
            ))

    g.append("g")
        .attr("class", "gv-zero-line")
        .attr("transform", "translate(-40,0)")
        .call(d3axis.axisLeft(y)
            .tickValues([0])
            .tickSize(
                (-innerwidth) - 40
            )
            .tickFormat(""))

    if (selector == '.borrowing') {

        g.append("g")
            .attr("transform", "translate(0," + innerheight + ")")
            .call(d3axis.axisBottom(x)
            .ticks(5)
            .tickFormat(d3time.timeFormat('%b')))

    }


    if (chartType == "line") {
        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", function() { 
                if (selector == ".borrowing") {
                    return "grey";
                } else {return "#cc0a11" }  
            })
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2)
            .attr("d", line);
    }
    else if (chartType == "bar") {
        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.Date); })
            .attr("y", function (d) { return y(d.Value); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return innerheight - y(d.Value); })
            .attr("fill", function (d) {
                if (d.Date.getMonth() == 5 && d.Date.getFullYear() == 2016) {
                    return "#b3b3b4";
                } else { return "#cc0a11" }
            });
    }
    if (numberOfDataSeries > 1) {
        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#056da1")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2)
            .attr("d", line2);
    }

    if (numberOfDataSeries > 2) {

        var thirdyear = data.filter(function(d) {
            return d.Value3;
        })
        g.append("path")
            .datum(thirdyear)
            .attr("fill", "none")
            .attr("stroke", "#cc0a11")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2)
            .attr("d", line3);
    }


    var graphdiv = document.querySelector(".gv-interactive" + selector);
    if (destinationdiv != null) {
        destinationdiv.appendChild(graphdiv);
        graphdiv.classList.add('placed')
    }
}

d3request.json(dataurl, function (d) {
    var alldata = d.sheets;
    drawlinechart(alldata.sterling, ".sterling", 5, false, "day", "sterling", "line", 2);
    drawlinechart(alldata.ftse100, ".ftse100", 5, false, "day", "ftse100", "line", 1);
    drawlinechart(alldata.ftse250, ".ftse250", 5, false, "day", "ftse250", "line", 1);
    drawlinechart(alldata.cpi, ".cpi", 3, true, "month", "cpi", "line", 1);
    drawlinechart(alldata.retail, ".retail", 5, false, "month", "retail", "line", 1);
    drawlinechart(alldata.rics, ".rics", 3, false, "month", "rics", "line", 1);
    drawlinechart(alldata.pmi, ".pmi", 5, false, "month", "pmi", "line", 1);
    drawlinechart(alldata.trade, ".trade", 5, false, "month", "trade", "line", 1);
    drawlinechart(alldata.unemployment, ".unemployment", 5, true, "month", "unemployment", "bar", 1);
    drawlinechart(alldata.wages, ".wages", 5, true, "month", "wages", "bar", 1);
    drawlinechart(alldata.borrowing, ".borrowing", 5, true, "month", "borrowing", "line", 3);
});