import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.$_init()
  }

  $_init() {
    const radius = 80;
    const tickLength = 10;
    const fromClock = 9;
    const toClock = 6;
    const circleDegree = 360;
    
    function degToRad(degrees) {
      return degrees * Math.PI / 180;
    }
    
    function clockToRad(clock, direction) {
      var unit = circleDegree / 12;
      var degree = direction > 0 ? unit * clock : unit * clock - circleDegree;
      return degToRad(degree);
    }
    
    function getCoordFromCircle(deg, cx, cy, r) {
      var rad = degToRad(deg);
      var x = cx + r * Math.cos(rad);
      var y = cy + r * Math.sin(rad);
      return [x, y];
    }
    
    function splitDegrees(num) {
      var angle = circleDegree / num;
      var degrees = [];
    
      for (var ang = 0; ang < circleDegree; ang += angle) {
        degrees.push(ang);
      }
    
      return degrees;
    }
    
    const fields = function() {
      const d = new Date();
      const second = d.getSeconds();
      const minute = d.getMinutes();
      const hour = d.getHours() + minute / 60;
      return [{
        "unit": "seconds",
        "text": d3.time.format("%S")(d),
        "numeric": second
      }, {
        "unit": "minutes",
        "text": d3.time.format("%M")(d),
        "numeric": minute
      }, {
        "unit": "hours",
        "text":  d3.time.format("%H")(d),
        "numeric": hour
      }];
    };
    
    const width = 400;
    const height = 200;
    const offSetX = 100;
    const offSetY = 100;
    const pi = Math.PI;
    
    // 线性比例尺
    const scaleSecsMins = d3.scale.linear()
      .domain([0, 60]) // 定义域
      .range([0, 2 * pi]); // 值域
    
    const scaleHours = d3.scale.linear()
      .domain([0, 12])
      .range([0, 2 * pi]);
    
    const clockGroup = d3.selectAll(".chart")
      .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
      .append("svg:g")
        .attr("transform", "translate(" + offSetX + "," + offSetY + ")");
    
    var arc = d3.svg.arc()
      .innerRadius(0)
      .outerRadius(radius)
      .startAngle(clockToRad(fromClock, -1))
      .endAngle(clockToRad(toClock, 1));
    
    clockGroup.append('path')
      .attr('d', arc)
      .style('fill', 'white');
    
    clockGroup.append("svg:circle")
      .attr("r", radius)
      .attr("fill", "none")
      .attr("class", "clock outercircle")
      .attr("stroke", "black")
      .attr("stroke-width", 2);
    
    
    clockGroup.append('g')
      .attr('class', 'ticks')
      .selectAll('path')
      .data(splitDegrees(12))
      .enter()
      .append('path')
      .attr('d', function(d) {
        var coord = {
          outer: getCoordFromCircle(d, 0, 0, radius),
          inner: getCoordFromCircle(d, 0, 0, radius - tickLength)
        };
        return 'M' + coord.outer[0] + ' ' + coord.outer[1] + 'L' + coord.inner[0] + ' ' + coord.inner[1] + 'Z';
      })
      .attr('stroke', 'black');
    
    clockGroup.append("svg:circle")
      .attr("r", 4)
      .attr("fill", "black")
      .attr("class", "clock innercircle");
    
    const render = function(data) {
      clockGroup.selectAll(".clockhand").remove();
      
      const secondArc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(70)
        .startAngle(d => scaleSecsMins(d.numeric))
        .endAngle(d =>  scaleSecsMins(d.numeric));
    
      const minuteArc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(65)
        .startAngle(function(d) {
          return scaleSecsMins(d.numeric);
        })
        .endAngle(function(d) {
          return scaleSecsMins(d.numeric);
        });
    
      const hourArc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(50)
        .startAngle(function(d) {
          return scaleHours(d.numeric % 12);
        }).endAngle(function(d) {
          return scaleHours(d.numeric % 12);
        });
    
      clockGroup.selectAll(".clockhand")
        .data(data)
        .enter()
        .append("svg:path")
        .attr("d", function(d) {
          if (d.unit === "seconds") {
            return secondArc(d);
          } else if (d.unit === "minutes") {
            return minuteArc(d);
          } else if (d.unit === "hours") {
            return hourArc(d);
          }
        })
        .attr("class", "clockhand")
        .attr("stroke", "black")
        .attr("stroke-width", function(d) {
          if (d.unit === "seconds") {
            return 1;
          } else if (d.unit === "minutes") {
            return 3;
          } else if (d.unit === "hours") {
            return 3;
          }
        })
        .attr("fill", "none");
    };
    
    render(fields())

    setInterval(function() {
      return render(fields());
    }, 1000);
    
  }

}
