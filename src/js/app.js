import axios from "axios";
import { selection, select, selectAll } from "d3-selection";
import * as d3 from "d3-shape";
//import * as d3time from 'd3-time'
import * as d3time from "d3-time-format";
import * as d3scale from "d3-scale";
import * as d3request from "d3-request";
import * as d3array from "d3-array";
import * as d3axis from "d3-axis";
import config from "./../../config.json";

var dataurl = config.docDataUrl;

function drawlinechart(
  data,
  selector,
  ticks,
  zeroy,
  interval,
  destination,
  chartType,
  numberOfDataSeries,
  columnNameArray
) {
  var destinationdiv = window.parent.document.querySelector(
    'figure[data-alt="' + destination + '"]'
  );
  if (destinationdiv != null) {
    var destwidth = destinationdiv.clientWidth;
    var altdestwidth = destinationdiv.getBoundingClientRect().width;
    // console.log(`destwidth: ${destwidth}, altdestwidth: ${altdestwidth}`);
  }

  var svg = select("svg" + selector),
    margin = { top: 20, right: 20, bottom: 20, left: 40 },
    outerwidth = destwidth ? destwidth : 500,
    outerheight = destwidth ? destwidth * 0.61 : 500 * 0.61,
    innerheight = outerheight - margin.top - margin.bottom,
    innerwidth = outerwidth - margin.left - margin.right,
    g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.attr("width", outerwidth).attr("height", outerheight);

  // if (selector == ".borrowing") {
  //     var parseTime = d3time.timeParse("%b");
  // } else
  if (interval == "month") {
    var parseTime = d3time.timeParse("%b %Y");
  } else if (interval == "day") {
    var parseTime = d3time.timeParse("%e-%b-%Y");
  }

  try {
    data.map(function(d) {
      //only convert it to a date if it isn't already a date
      if (Object.prototype.toString.call(d.Date) !== "[object Date]") {
        d.Date = parseTime(d.Date);
      }
      // convert values to numbers for as many values as there are
      // and delete any values that won't be coerced to numbers
      for (var i = 1; i < Object.keys(d).length; i++) {
        //                console.log(d[Object.keys(d)[i]]);
        if (!isNaN(parseFloat(d[Object.keys(d)[i]]))) {
          d[Object.keys(d)[i]] = parseFloat(d[Object.keys(d)[i]]);
        } else {
          delete d[Object.keys(d)[i]];
        }
      }
    });

    if (chartType == "line") {
      var x = d3scale.scaleTime().rangeRound([0, innerwidth]);
    } else if (chartType == "bar") {
      var x = d3scale
        .scaleBand()
        .rangeRound([0, innerwidth])
        .padding(0.1);
    }

    var y = d3scale.scaleLinear().rangeRound([innerheight, 0]);

    var line = d3
      .line()
      .defined(d => !isNaN(d[columnNameArray[0]]))
      .x(function(d) {
        return x(d.Date);
      })
      .y(function(d) {
        return y(d[columnNameArray[0]]);
      });

    if (numberOfDataSeries > 1) {
      var line2 = d3
        .line()
        .defined(d => !isNaN(d[columnNameArray[1]]))
        .x(function(d) {
          return x(d.Date);
        })
        .y(function(d) {
          return y(d[columnNameArray[1]]);
        });
    }

    if (numberOfDataSeries > 2) {
      var line3 = d3
        .line()
        .x(function(d) {
          return x(d.Date);
        })
        .y(function(d) {
          return y(d[columnNameArray[2]]);
        });
    }

    if (numberOfDataSeries > 3) {
      var line4 = d3
        .line()
        .x(function(d) {
          if (d[columnNameArray[3]]) {
            return x(d.Date);
          }
        })
        .y(function(d) {
          if (d[columnNameArray[3]]) {
            return y(d[columnNameArray[3]]);
          }
        });
    }

    if (numberOfDataSeries > 4) {
      var line5 = d3
        .line()
        .x(function(d) {
          if (d[columnNameArray[4]]) {
            return x(d.Date);
          }
        })
        .y(function(d) {
          if (d[columnNameArray[4]]) {
            return y(d[columnNameArray[4]]);
          }
        });
    }

    if (interval == "month") {
      try {
        var june2016 = data.filter(function(d) {
          return d.Date.getMonth() == 5 && d.Date.getFullYear() == 2016;
        });
      } catch (err) {
        console.log(data);
      }
    } else if (interval == "day") {
      var june2016 = data.filter(function(d) {
        return (
          d.Date.getMonth() == 5 &&
          d.Date.getFullYear() == 2016 &&
          d.Date.getDate() == 23
        );
      });
    }

    if (interval == "month") {
      var june2017 = data.filter(function(d) {
        return d.Date.getMonth() == 5 && d.Date.getFullYear() == 2017;
      });
    } else if (interval == "day") {
      var june2017 = data.filter(function(d) {
        return (
          d.Date.getMonth() == 5 &&
          d.Date.getFullYear() == 2017 &&
          d.Date.getDate() == 23
        );
      });
    }

    if (interval == "month") {
      var june2018 = data.filter(function(d) {
        return d.Date.getMonth() == 5 && d.Date.getFullYear() == 2018;
      });
    } else if (interval == "day") {
      var june2018 = data.filter(function(d) {
        return (
          d.Date.getMonth() == 5 &&
          d.Date.getFullYear() == 2018 &&
          d.Date.getDate() == 23
        );
      });
    }
    if (interval == "month") {
      var june2019 = data.filter(function(d) {
        return d.Date.getMonth() == 5 && d.Date.getFullYear() == 2019;
      });
    } else if (interval == "day") {
      var june2019 = data.filter(function(d) {
        return (
          d.Date.getMonth() == 5 &&
          d.Date.getFullYear() == 2019 &&
          d.Date.getDate() == 24
        );
      });
    }

    if (chartType == "line") {
      x.domain(
        d3array.extent(data, function(d) {
          return d.Date;
        })
      );
    } else if (chartType == "bar") {
      x.domain(
        data.map(function(d) {
          return d.Date;
        })
      );
    }

    if (zeroy == true) {
      if (numberOfDataSeries == 1) {
        y.domain([
          0,
          d3array.max(data, function(d) {
            return d[columnNameArray[0]];
          })
        ]);
      } else if (numberOfDataSeries == 3) {
        var combineddata = data
          .map(function(d) {
            return d[columnNameArray[0]];
          })
          .concat(
            data.map(function(d) {
              return d[columnNameArray[1]];
            })
          )
          .concat(
            data.map(function(d) {
              return d[columnNameArray[2]];
            })
          );
        y.domain([
          0,
          d3array.max(combineddata, function(d) {
            return d;
          })
        ]);
      }
      else if (numberOfDataSeries == 2) {
        var combineddata = data
          .map(function(d) {
            return d[columnNameArray[0]];
          })
          .concat(
            data.map(function(d) {
              return d[columnNameArray[1]];
            })
          );
        y.domain([
          0,
          d3array.max(combineddata, function(d) {
            return d;
          })
        ]);
      }
    } else {
      if (numberOfDataSeries == 1) {
        y.domain(
          d3array.extent(data, function(d) {
            return d[columnNameArray[0]];
          })
        );
      } else if (numberOfDataSeries == 2) {
        var combineddata = data
          .map(function(d) {
            return d[columnNameArray[0]];
          })
          .concat(
            data.map(function(d) {
              return d[columnNameArray[1]];
            })
          );
        y.domain(d3array.extent(combineddata), function(d) {
          return d;
        });
      } else if (numberOfDataSeries == 4) {
        var combineddata = data
          .map(function(d) {
            return d[columnNameArray[0]];
          })
          .concat(
            data.map(function(d) {
              return d[columnNameArray[1]];
            })
          )
          .concat(
            data.map(function(d) {
              return d[columnNameArray[2]];
            })
          )
          .concat(
            data.map(function(d) {
              return d[columnNameArray[3]];
            })
          );
        y.domain(d3array.extent(combineddata), function(d) {
          return d;
        });
      } else if (numberOfDataSeries == 3) {
        var combineddata = data
          .map(function(d) {
            return d[columnNameArray[0]];
          })
          .concat(
            data.map(function(d) {
              return d[columnNameArray[1]];
            })
          )
          .concat(
            data.map(function(d) {
              return d[columnNameArray[2]];
            })
          );
        y.domain(d3array.extent(combineddata), function(d) {
          return d;
        });
      }
    }

    if (selector != ".borrowing") {
      // g.append("g")
      //     .attr("class", "gv-brexit-tick")
      //     .attr("transform", "translate(0," + innerheight + ")")
      //     .call(d3axis.axisBottom(x)
      //         // .tickValues(june2016.map(function (d) {
      //         //     return d.Date;
      //         // }))
      //         .tickFormat(d3time.timeFormat('%b %Y'))
      //         .tickSize(-innerheight));
      // // .select(".domain")
      // //   .remove();

      // g.append("g")
      //     .attr("transform", "translate(0," + innerheight + ")")
      //     .call(d3axis.axisBottom(x)
      //         .tickValues(june2017.map(function (d) {
      //             return d.Date;
      //         }))
      //         .tickFormat(d3time.timeFormat('%b %Y')));

      // g.append("g")
      //     .attr("transform", "translate(0," + innerheight + ")")
      //     .call(d3axis.axisBottom(x)
      //         .tickValues(june2018.map(function (d) {
      //             return d.Date;
      //         }))
      //         .tickFormat(d3time.timeFormat('%b %Y')));

      g.append("g")
        .attr("transform", "translate(0," + innerheight + ")")
        .call(
          d3axis
            .axisBottom(x)
            .ticks(2)
            .tickFormat(d3time.timeFormat("%b %Y"))
        );
    }

    g.append("g")
      .attr("class", "gv-horizontal-grid")
      .attr("transform", "translate(-40,0)")
      .call(
        d3axis
          .axisLeft(y)
          .ticks(ticks)
          .tickSize(-innerwidth - 40)
      );
// only add a zero line if zero is in the domain
if (y.domain[0] == 0 || y.domain[0] < 0) {
  g.append("g")
      .attr("class", "gv-zero-line")
      .attr("transform", "translate(-40,0)")
      .call(
        d3axis
          .axisLeft(y)
          .tickValues([0])
          .tickSize(-innerwidth - 40)
          .tickFormat("")
      );

}
  
    if (selector == ".borrowing") {
      g.append("g")
        .attr("transform", "translate(0," + innerheight + ")")
        .call(
          d3axis
            .axisBottom(x)
            .ticks(5)
            .tickFormat(d3time.timeFormat("%b"))
        );
    }

    if (chartType == "line") {
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#cc0a11")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", line)
        .attr("id","line1");
    } else if (chartType == "bar") {
      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return x(d.Date);
        })
        .attr("y", function(d) {
          return y(d[columnNameArray[0]]);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
          return innerheight - y(d[columnNameArray[0]]);
        })
        .attr("fill", function(d) {
          if (d.Date.getMonth() == 5 && d.Date.getFullYear() == 2016) {
            return "#b3b3b4";
          } else {
            return "#cc0a11";
          }
        });
    }
    if (numberOfDataSeries > 1) {
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", line2)
        .attr("id", "line2");
    }

    if (numberOfDataSeries > 2) {
      if (selector == ".borrowing") {
        var line3data = data.filter(d => d.Value3);
      } else {
        var line3data = data;
      }
      g.append("path")
        .datum(line3data)
        .attr("fill", "none")
        .attr("stroke", function() {
          if (selector == ".borrowing") {
            return "#f5be2c";
          } else {
            return "#056da1";
          }
        })
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", line3)
        .attr("id", "line3");
    }

    if (numberOfDataSeries > 3) {
      if (selector == ".borrowing") {
        var line4data = data.filter(d => d.Value3);
      } else {
        var line4data = data;
      }
      g.append("path")
        .datum(line4data)
        .attr("fill", "none")
        .attr("stroke", "rgb(0, 178, 255)")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", line4)
        .attr("id", "line4");
    }

    if (numberOfDataSeries > 4) {
      var fifthyear = data.filter(function(d) {
        return d.Value5;
      });
      g.append("path")
        .datum(fifthyear)
        .attr("fill", "none")
        .attr("stroke", "#cc0a11")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", line5);
    }

    var graphdiv = document.querySelector(".gv-interactive" + selector);
    if (destinationdiv != null) {
      destinationdiv.appendChild(graphdiv);
      graphdiv.classList.add("placed");
    }
    if (window.location.href.indexOf("localhost") > -1) {
      graphdiv.classList.add("placed");
    }
  } catch (err) {
    console.log(selector);
    console.log(err);
  }
}

d3request.json(dataurl, function(d) {
  var alldata = d.sheets;

  //MEMO re arguments
  //data, selector, ticks, zeroy, interval, destination, chartType, numberOfDataSeries
  // ie: 'sheet', target div, number of ticks, set Y axis to zero?, timescale, target div again without the dot, type of chart, number of values, name of columns)

  drawlinechart(alldata.cpi, ".cpi", 3, true, "month", "cpi", "line", 1, [
    "Value"
  ]);
  drawlinechart(
    alldata.retail,
    ".retail",
    5,
    false,
    "month",
    "retail",
    "line",
    1,
    ["retail"]
  );
  drawlinechart(
    alldata.housePrices,
    ".rics",
    3,
    false,
    "month",
    "rics",
    "line",
    1,
    ["value"]
  );
  drawlinechart(
    alldata.ftse100,
    ".ftse100",
    6,
    false,
    "day",
    "ftse100",
    "line",
    1,
    ["value"]
  );
  drawlinechart(
    alldata.unemployment,
    ".unemployment",
    5,
    false,
    "month",
    "unemployment",
    "line",
    1,
    ["claimantCount"]
  );
  drawlinechart(
    alldata.borrowing,
    ".borrowing",
    7,
    true,
    "month",
    "borrowing",
    "line",
    3,
    ["Value", "Value2", "Value3"]
  );
  drawlinechart(alldata.pmiRics, ".pmi", 5, false, "month", "pmi", "line", 4, [
    "China",
    "US",
    "Eurozone",
    "UK"
  ]);
  drawlinechart(
    alldata.transport,
    ".transport",
    2,
    true,
    "day",
    "transport",
    "line",
    2,
    ["driving", "transit"]
  );
  drawlinechart(
    alldata.gdp,
    ".gdp",
    2,
    false,
    "month",
    "gdp",
    "line",
    1,
    ["value"]
  );
});
