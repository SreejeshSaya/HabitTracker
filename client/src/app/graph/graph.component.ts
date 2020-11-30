// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';

// Function to compute density
function kernelDensityEstimator(kernel, X) {
   return function(V) {
     return X.map(function(x) {
       return [x, d3.mean(V, function(v) { return kernel(x - v); })];
     });
   };
 }

 function kernelEpanechnikov(k) {
   return function(v) {
     return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
   };
 }

@Component({
   selector: 'app-graph',
   templateUrl: './graph.component.html',
   styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
   @Input() width;
   @Input() height;
   @Input() data;
   @Input() id;
   @Input() type: "habitStreakGraph"|"habitPunctualityGraph"|"streakGraph"|"punctualityGraph"|"areaGraph"="streakGraph"
   @Input() color: string = "#aaaaaa"
   @Input() pointColor: string = "rgba(0,0,0,0.5)"
   constructor() {}

   ngOnInit(): void {
      console.log(this.data)
      if (this.type=="punctualityGraph"){
         this.drawPunctualityGraph()
      }
      else if (this.type=="streakGraph") {
         this.drawStreakGraph()
      }
      else if (this.type=="habitPunctualityGraph"){
         this.drawHabitPunctualityGraph()
      }
      else if (this.type=="habitStreakGraph") {
         this.drawHabitStreakGraph()
      }
      else {
         this.drawAreaGraph()
      }
      
   }

   drawPunctualityGraph() {
      var margin = { top: 10, right: 30, bottom: 30, left: 60 },
         width = this.width - margin.left - margin.right,
         height = this.height - margin.top - margin.bottom;

      const svg = d3
         .select(`#${this.id}`)
         .append('svg')
         .attr('width', width + margin.left + margin.right)
         .attr('height', height + margin.top + margin.bottom)
         .attr("overflow","visible")
         .append('g')
         .attr(
            'transform',
            'translate(' + margin.left + ',' + margin.top + ')'
         );

      var x = d3
         .scaleTime()
         .domain(
            <[any, any]>d3.extent(this.data, function (d: any) {
               return d.date;
            })
         )
         .range([0, width])

      svg.append('g')
         .attr('transform', 'translate(0,' + height + ')')
         .call(d3.axisBottom(x).ticks(5));

      // Add Y axis
      var y = d3
         .scaleLinear()
         .domain([
            0,
            d3.max(this.data, function (d: any) {
               return +d.value;
            }),
         ])
         .range([height, 0]);
      svg.append('g').call(d3.axisLeft(y));

      svg.append('path').datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', this.color)
      .attr('stroke-width', 3)
      .attr(
         'd',
         d3
            .line()
            .x(function (d: any) {
               return x(d.date);
            })
            .y(function (d: any) {
               return y(d.value);
            })
      );

      svg.selectAll("dot")
      .data(this.data)
      .enter().append("circle")
      .attr("r", 3.5)
      .attr("fill",this.pointColor)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.value); })
   
      var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

      focus.append("circle")
         .attr("r", 5);

      focus.append("rect")
         .attr("class", "tooltip")
         .attr("width", 180)
         .attr("height", 70)
         .attr("x", 10)
         .attr("y", -22)
         .attr("rx", 4)
         .attr("ry", 4)

      focus.append("text")
         .attr("class", "text-bold date-text")
         .attr("x", 18)
         .attr("y", -2);

      focus.append("text")
         .attr("x", 18)
         .attr("y", 18)
         .text("Punctuality: ");

      focus.append("text")
         .attr("class", "text-bold punctuality-text ")
         .attr("x", 95)
         .attr("y", 18);
      
      focus.append("text")
         .attr("x", 18)
         .attr("y", 36)
         .text("Habits Completed: ");

      focus.append("text")
         .attr("class", "text-bold cnt-text ")
         .attr("x", 140)
         .attr("y", 36);

      svg.append("rect")
         .attr("class", "overlay")
         .attr("width", width)
         .attr("height", height)
         .on("mouseout", function() { focus.style("display", "none"); })
         .on("mousemove", mousemove);
      
      const dataPos = this.data.map(v=>{
         return [v,[x(v.date),y(v.value)]]
      })

      const dateFormatter = d3.timeFormat("%B %d, %I:%M %p")
      const pFormatter = (p)=>{
         return p.toPrecision(3)+"%"
      }
      function mousemove() {
         var x0 = d3.mouse(this)[0]
         var y0 = d3.mouse(this)[1]
         let closest;
         let minDistance;
         dataPos.forEach((p)=>{
            if (!closest){
               closest = p
               const x1 = p[1][0]
               const y1 = p[1][1]
               minDistance = ((x1-x0)**2+(y1-y0)**2)**0.5
            }
            else {
               const x1 = p[1][0]
               const y1 = p[1][1]
               const d =((x1-x0)**2+(y1-y0)**2)**0.5
               if (d<minDistance){
                  minDistance = d
                  closest = p
               }
            }
         })
         if (minDistance<20){
            focus.style("display","block")
            console.log("here")
            focus.attr("transform", "translate(" + closest[1][0] + "," + closest[1][1] + ")");
            focus.select(".date-text").text(dateFormatter(closest[0].date));
            focus.select(".punctuality-text").text(pFormatter(closest[0].value));
            focus.select(".cnt-text").text(closest[0].changeCnt);
         }
         else {
            console.log(minDistance)
            focus.style("display","none")
         }
      }
   }

   drawStreakGraph() {
      var margin = { top: 10, right: 30, bottom: 30, left: 60 },
         width = this.width - margin.left - margin.right,
         height = this.height - margin.top - margin.bottom;

      const svg = d3
         .select(`#${this.id}`)
         .append('svg')
         .attr('width', width + margin.left + margin.right)
         .attr('height', height + margin.top + margin.bottom)
         .attr("overflow","visible")
         .append('g')
         .attr(
            'transform',
            'translate(' + margin.left + ',' + margin.top + ')'
         );

      var x = d3
         .scaleTime()
         .domain(
            <[any, any]>d3.extent(this.data, function (d: any) {
               return d.date;
            })
         )
         .range([0, width])

      svg.append('g')
         .attr('transform', 'translate(0,' + height + ')')
         .call(d3.axisBottom(x).ticks(5));

      // Add Y axis
      var y = d3
         .scaleLinear()
         .domain([
            0,
            d3.max(this.data, function (d: any) {
               return +d.value;
            }),
         ])
         .range([height, 0]);
      svg.append('g').call(d3.axisLeft(y));

      svg.append('path').datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', this.color)
      .attr('stroke-width', 3)
      .attr(
         'd',
         d3
            .line()
            .x(function (d: any) {
               return x(d.date);
            })
            .y(function (d: any) {
               return y(d.value);
            })
      );

      svg.selectAll("dot")
      .data(this.data)
      .enter().append("circle")
      .attr("r", 3.5)
      .attr("fill",this.pointColor)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.value); })
      
      var bisectDate = d3.bisector(function(d) { return d.date; }).left

      var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

      focus.append("circle")
         .attr("r", 5);

      focus.append("rect")
         .attr("class", "tooltip")
         .attr("width", 180)
         .attr("height", 70)
         .attr("x", 10)
         .attr("y", -22)
         .attr("rx", 4)
         .attr("ry", 4)

      focus.append("text")
         .attr("class", "text-bold date-text")
         .attr("x", 18)
         .attr("y", -2);

      focus.append("text")
         .attr("x", 18)
         .attr("y", 18)
         .text("Streak: ");

      focus.append("text")
         .attr("class", "text-bold streak-text ")
         .attr("x", 65)
         .attr("y", 18);
      
      focus.append("text")
      .attr("x", 18)
      .attr("y", 36)
      .text("Habit: ");

      focus.append("text")
         .attr("class", "text-bold habit-text ")
         .attr("x", 65)
         .attr("y", 36);

      svg.append("rect")
         .attr("class", "overlay")
         .attr("width", width)
         .attr("height", height)
         .on("mouseout", function() { focus.style("display", "none"); })
         .on("mousemove", mousemove);
      
      const dataPos = this.data.map(v=>{
         return [v,[x(v.date),y(v.value)]]
      })

      const dateFormatter = d3.timeFormat("%B %d, %I:%M %p")
      const pFormatter = (p)=>{
         return p.toPrecision(3)+"%"
      }
      function mousemove() {
         var x0 = d3.mouse(this)[0]
         var y0 = d3.mouse(this)[1]
         let closest;
         let minDistance;
         dataPos.forEach((p)=>{
            if (!closest){
               closest = p
               const x1 = p[1][0]
               const y1 = p[1][1]
               minDistance = ((x1-x0)**2+(y1-y0)**2)**0.5
            }
            else {
               const x1 = p[1][0]
               const y1 = p[1][1]
               const d =((x1-x0)**2+(y1-y0)**2)**0.5
               if (d<minDistance){
                  minDistance = d
                  closest = p
               }
            }
         })
         if (minDistance<20){
            focus.style("display","block")
            console.log("here")
            focus.attr("transform", "translate(" + closest[1][0] + "," + closest[1][1] + ")");
            focus.select(".date-text").text(dateFormatter(closest[0].date));
            focus.select(".streak-text").text(closest[0].value);
            focus.select(".habit-text").text(closest[0].habitText);
         }
         else {
            console.log(minDistance)
            focus.style("display","none")
         }
      }
   }

   drawHabitPunctualityGraph() {
      var margin = { top: 10, right: 30, bottom: 30, left: 60 },
         width = this.width - margin.left - margin.right,
         height = this.height - margin.top - margin.bottom;

      const svg = d3
         .select(`#${this.id}`)
         .append('svg')
         .attr('width', width + margin.left + margin.right)
         .attr('height', height + margin.top + margin.bottom)
         .attr("overflow","visible")
         .append('g')
         .attr(
            'transform',
            'translate(' + margin.left + ',' + margin.top + ')'
         );

      var x = d3
         .scaleTime()
         .domain(
            <[any, any]>d3.extent(this.data, function (d: any) {
               return d.date;
            })
         )
         .range([0, width])

      svg.append('g')
         .attr('transform', 'translate(0,' + height + ')')
         .call(d3.axisBottom(x).ticks(5));

      // Add Y axis
      var y = d3
         .scaleLinear()
         .domain([
            0,
            d3.max(this.data, function (d: any) {
               return +d.value;
            }),
         ])
         .range([height, 0]);
      svg.append('g').call(d3.axisLeft(y));

      svg.append('path').datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', this.color)
      .attr('stroke-width', 3)
      .attr(
         'd',
         d3
            .line()
            .x(function (d: any) {
               return x(d.date);
            })
            .y(function (d: any) {
               return y(d.value);
            })
      );

      svg.selectAll("dot")
      .data(this.data)
      .enter().append("circle")
      .attr("r", 3.5)
      .attr("fill",this.pointColor)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.value); })
      
      var bisectDate = d3.bisector(function(d) { return d.date; }).left

      var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

      focus.append("circle")
         .attr("r", 5);

      focus.append("rect")
         .attr("class", "tooltip")
         .attr("width", 180)
         .attr("height", 50)
         .attr("x", 10)
         .attr("y", -22)
         .attr("rx", 4)
         .attr("ry", 4)

      focus.append("text")
         .attr("class", "text-bold date-text")
         .attr("x", 18)
         .attr("y", -2);

      focus.append("text")
         .attr("x", 18)
         .attr("y", 18)
         .text("Punctuality: ");

      focus.append("text")
         .attr("class", "text-bold punctuality-text ")
         .attr("x", 95)
         .attr("y", 18);

      svg.append("rect")
         .attr("class", "overlay")
         .attr("width", width)
         .attr("height", height)
         .on("mouseout", function() { focus.style("display", "none"); })
         .on("mousemove", mousemove);
      
      const dataPos = this.data.map(v=>{
         return [v,[x(v.date),y(v.value)]]
      })

      const dateFormatter = d3.timeFormat("%B %d, %I:%M %p")
      const pFormatter = (p)=>{
         return p.toPrecision(3)+"%"
      }
      function mousemove() {
         var x0 = d3.mouse(this)[0]
         var y0 = d3.mouse(this)[1]
         let closest;
         let minDistance;
         dataPos.forEach((p)=>{
            if (!closest){
               closest = p
               const x1 = p[1][0]
               const y1 = p[1][1]
               minDistance = ((x1-x0)**2+(y1-y0)**2)**0.5
            }
            else {
               const x1 = p[1][0]
               const y1 = p[1][1]
               const d =((x1-x0)**2+(y1-y0)**2)**0.5
               if (d<minDistance){
                  minDistance = d
                  closest = p
               }
            }
         })
         if (minDistance<20){
            focus.style("display","block")
            console.log("here")
            focus.attr("transform", "translate(" + closest[1][0] + "," + closest[1][1] + ")");
            focus.select(".date-text").text(dateFormatter(closest[0].date));
            focus.select(".punctuality-text").text(pFormatter(closest[0].value));
         }
         else {
            console.log(minDistance)
            focus.style("display","none")
         }
      }
   }

   drawHabitStreakGraph() {
      var margin = { top: 10, right: 30, bottom: 30, left: 60 },
         width = this.width - margin.left - margin.right,
         height = this.height - margin.top - margin.bottom;

      const svg = d3
         .select(`#${this.id}`)
         .append('svg')
         .attr('width', width + margin.left + margin.right)
         .attr('height', height + margin.top + margin.bottom)
         .attr("overflow","visible")
         .append('g')
         .attr(
            'transform',
            'translate(' + margin.left + ',' + margin.top + ')'
         );

      var x = d3
         .scaleTime()
         .domain(
            <[any, any]>d3.extent(this.data, function (d: any) {
               return d.date;
            })
         )
         .range([0, width])

      svg.append('g')
         .attr('transform', 'translate(0,' + height + ')')
         .call(d3.axisBottom(x).ticks(5));

      // Add Y axis
      var y = d3
         .scaleLinear()
         .domain([
            0,
            d3.max(this.data, function (d: any) {
               return +d.value;
            }),
         ])
         .range([height, 0]);
      svg.append('g').call(d3.axisLeft(y).ticks(5));

      svg.append('path').datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', this.color)
      .attr('stroke-width', 3)
      .attr(
         'd',
         d3
            .line()
            .x(function (d: any) {
               return x(d.date);
            })
            .y(function (d: any) {
               return y(d.value);
            })
      );

      svg.selectAll("dot")
      .data(this.data)
      .enter().append("circle")
      .attr("r", 3.5)
      .attr("fill",this.pointColor)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.value); })
      
      var bisectDate = d3.bisector(function(d) { return d.date; }).left

      var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

      focus.append("circle")
         .attr("r", 5);

      focus.append("rect")
         .attr("class", "tooltip")
         .attr("width", 180)
         .attr("height", 50)
         .attr("x", 10)
         .attr("y", -22)
         .attr("rx", 4)
         .attr("ry", 4)

      focus.append("text")
         .attr("class", "text-bold date-text")
         .attr("x", 18)
         .attr("y", -2);

      focus.append("text")
         .attr("x", 18)
         .attr("y", 18)
         .text("Streak: ");

      focus.append("text")
         .attr("class", "text-bold streak-text ")
         .attr("x", 65)
         .attr("y", 18);

      svg.append("rect")
         .attr("class", "overlay")
         .attr("width", width)
         .attr("height", height)
         .on("mouseout", function() { focus.style("display", "none"); })
         .on("mousemove", mousemove);
      
      const dataPos = this.data.map(v=>{
         return [v,[x(v.date),y(v.value)]]
      })

      const dateFormatter = d3.timeFormat("%B %d, %I:%M %p")
      const pFormatter = (p)=>{
         return p.toPrecision(3)+"%"
      }
      function mousemove() {
         var x0 = d3.mouse(this)[0]
         var y0 = d3.mouse(this)[1]
         let closest;
         let minDistance;
         dataPos.forEach((p)=>{
            if (!closest){
               closest = p
               const x1 = p[1][0]
               const y1 = p[1][1]
               minDistance = ((x1-x0)**2+(y1-y0)**2)**0.5
            }
            else {
               const x1 = p[1][0]
               const y1 = p[1][1]
               const d =((x1-x0)**2+(y1-y0)**2)**0.5
               if (d<minDistance){
                  minDistance = d
                  closest = p
               }
            }
         })
         if (minDistance<20){
            focus.style("display","block")
            console.log("here")
            focus.attr("transform", "translate(" + closest[1][0] + "," + closest[1][1] + ")");
            focus.select(".date-text").text(dateFormatter(closest[0].date));
            focus.select(".streak-text").text(closest[0].value);
         }
         else {
            console.log(minDistance)
            focus.style("display","none")
         }
      }
   }
}
