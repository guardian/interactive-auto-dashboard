import axios from 'axios'
import { selection, select, selectAll } from 'd3-selection'
import * as d3 from 'd3-shape'
//import * as d3time from 'd3-time'
import * as d3time from 'd3-time-format'
import * as d3scale from 'd3-scale'
import * as d3request from 'd3-request'
import * as d3array from 'd3-array'
import * as d3axis from 'd3-axis'


var dataurl = "https://interactive.guim.co.uk/docsdata-test/1mm9nd1wnyE-YOiOk26cN-jhxqUuRWb1eFOrnnKqte14.json";



function drawlinechart(data, selector, ticks, zeroy, interval, destination) {

    var svgselector = ("svg" + selector);

    var svg = select(svgselector), margin = { top: 20, right: 20, bottom: 30, left: 10 },
        // width = +svg.attr("width") - margin.left - margin.right,
        // height = +svg.attr("height") - margin.top - margin.bottom,
        width = 500,
        height = 300,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (interval == "month"){
        var parseTime = d3time.timeParse("%b %Y");
    } else if (interval == "day") {
        var parseTime = d3time.timeParse('%e-%b-%Y')
    }

    var x = d3scale.scaleTime()
        .rangeRound([0, width]);

    var y = d3scale.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function (d) {
            return x(d.Date);
        })
        .y(function (d) {
            return y(d.Value);
        });


    data.map(function (d) {
        d.Date = parseTime(d.Date);
        d.Value = parseFloat(d.Value);
    })

    var junes = data.filter(function (d) {
        return d.Date.getMonth() == 5;
    })

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


    x.domain(d3array.extent(data, function (d) { return d.Date; }));
    if (zeroy == true) {
        y.domain([0, d3array.max(data, function (d) { return d.Value; })]);
    } else {
        y.domain(d3array.extent(data, function (d) { return d.Value; }));

    }



    g.append("g")
        .attr("class", "gv-brexit-tick")
        .attr("transform", "translate(0,300)")
        .call(d3axis.axisBottom(x)
            .tickValues(june2016.map(function (d) {
                return d.Date;
            })).
            tickFormat(d3time.timeFormat('%b %Y'))
            .tickSize(-height))
    // .select(".domain")
    //   .remove();


    g.append("g")
        .attr("transform", "translate(0,300)")
        .call(d3axis.axisBottom(x)
            .tickValues(june2017.map(function (d) {
                return d.Date;
            }))
            .tickFormat(d3time.timeFormat('%b %Y')))


    g.append("g")
        .attr("class", "gv-horizontal-grid")
        .call(d3axis.axisLeft(y)
            .ticks(ticks)
            .tickSize(-width))

    g.append("g")
        .attr("class", "gv-zero-line")
        .call(d3axis.axisLeft(y)
            .tickValues([0])
            .tickSize(-width))


    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#cc0a11")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", line);

        var graphdiv = document.querySelector(".gv-interactive"+selector);
        var destinationdiv = window.parent.document.querySelector('figure');
        console.log(destinationdiv)
        destinationdiv.appendChild(graphdiv);

}

d3request.json(dataurl, function (d) {
    var alldata = d.sheets;
    drawlinechart(alldata.cpi, ".cpi", 3, true, "month","interactive-slot-1");
    drawlinechart(alldata.retail, ".retail", 5, false, "month");
    drawlinechart(alldata.rics, ".rics", 3, false, "month");
    drawlinechart(alldata.pmi, ".pmi", 5, false, "month");
    drawlinechart(alldata.trade, ".trade", 7, false, "month");
    drawlinechart(alldata.ftse100, ".ftse100", 7, false, "day");
    drawlinechart(alldata.ftse250, ".ftse250", 7, false, "day");


});


