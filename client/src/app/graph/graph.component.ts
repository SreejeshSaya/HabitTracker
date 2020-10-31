// @ts-nocheck
import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';
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
   constructor() {}

   ngOnInit(): void {
      this.drawGraph()
   }

   drawGraph() {
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
