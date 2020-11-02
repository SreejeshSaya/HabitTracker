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
   @Input() type: "dateGraph"|"areaGraph"="dateGraph"
   constructor() {}

   ngOnInit(): void {
      if (this.type=="dateGraph"){
         this.drawDateGraph()
      }
      else {
         this.drawAreaGraph()
      }
      
   }

   drawAreaGraph(){
      var margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = this.width - margin.left - margin.right,
      height = this.height - margin.top - margin.bottom;

      var svg = d3.select(`#${this.id}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleLinear()
      .domain([0,d3.max(this.data)])
      .range([ 0, width ]);

      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

      var histogram = d3.histogram()
      .value(d=>d)   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(50)); // then the numbers of bins

      var bins = histogram(this.data);
      console.log(this.data,bins,x.domain())
    // Add Y axis
      var y = d3.scaleLinear()
      .domain([0, d3.max(bins, function(d) { return d.length; }) ])
      .range([ height, 0 ]);

      svg.append("g")
      .call(d3.axisLeft(y));
      svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
      .attr("height", function(d) { return height - y(d.length); })
      .style("fill", "#69b3a2")
   }

   drawDateGraph() {
      var margin = { top: 10, right: 30, bottom: 30, left: 60 },
         width = this.width - margin.left - margin.right,
         height = this.height - margin.top - margin.bottom;

      const svg = d3
         .select(`#${this.id}`)
         .append('svg')
         .attr('width', width + margin.left + margin.right)
         .attr('height', height + margin.top + margin.bottom)
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
         .call(d3.axisBottom(x));

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

      const path = svg.append('path').datum(this.data);

      const totalLength = path.node().getTotalLength();

      path
         .attr('fill', 'none')
         .attr('stroke', 'orange')
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
   }
}
