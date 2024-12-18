// @ts-nocheck

import * as d3 from "d3";

import { CircleShape } from "../components/marks/Shape";

export function onScatterplotChartBloodMeasuresVsBMIClick(toggledPoint: boolean, d: SVGCircleElement, markColorScale: d3.ScaleOrdinal<any, any>, xScale: d3.ScaleLinear, yScale: d3.ScaleLinear) {

    // Hide all points that are not selected.
    d3
    .select(".scatterplot-chart-blood-measures-vs-bmi")
    .selectAll(".dots")
    .selectAll("circle")
        .style("filter", "saturate(0)")
        .style("opacity", 0.2)
        .transition().duration(1000)
        // .style("stroke", markColorScale(d.markColorField))
        .style("stroke-width", "2px")
        .style("fill-opacity", 0.3)
        .attr("r", CircleShape.radius)
        .attr("data-selected-dot", null);
        
    if (!toggledPoint) {
            
        // ----------------------------------------------
            
        // Change the highlight of the selected dots between the charts.
        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .selectAll(".dots")
        .selectAll("[data-seqn='" + d.seqn + "']") 
            .transition().duration(1000)
            .style("stroke", "black")
            .style("stroke-width", "4px")
            .style("opacity", 1)
            .style("fill-opacity", 0.8)
            .style("filter", "saturate(1)")
            .attr("r", CircleShape.radiusSelected)
            .attr("data-selected-dot", true);

        // Draw the line between the selected dots. The delay of 1 second is necessary.
        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .selectAll("[data-selected-path='true']")
            .remove();
        setTimeout(() => {
            let dataSelectedPoints = [];

            const elements = document.querySelectorAll('[data-selected-dot]');

            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                // console.log("X: " + (rect.x + globalThis.scrollX) + ", Y: " + (rect.y + globalThis.scrollY));

                // Make sure to add scroll offset x and/or y to ensure the 
                // line is absolute when connection the points.
                // https://sentry.io/answers/how-do-i-get-the-position-x-y-of-an-html-element/
                dataSelectedPoints.push(
                    {
                        x: rect.x + globalThis.scrollX,
                        y: rect.y + globalThis.scrollY
                    }
                )
            });

            const lineGenerator = 
            d3.
            line()
            .x((d: any) => d.x) // Scalar is not needed because the client x value.
            .y((d: any) => d.y) // Scalar is not needed because the client y value.

            const svg = 
            d3
            .select(".scatterplot-chart-blood-measures-vs-bmi")
            .select(".chart-1")
            
            const group = 
            svg
            .append("g")
                .attr("transform", "translate(-24, -320)") // -70
                .attr("overflow", "visible")
                .attr("data-selected-path", "true");

            group
            .append("path")
            .datum(dataSelectedPoints) // Bind your data to the path element
            .attr("d", lineGenerator) // Use the line generator to create the path
            .attr("stroke", "#399D3E") // Set the line color
            .attr("stroke-width", 4) // Set the line width
            .attr("stroke-dasharray", "4, 8, 4"); 
            }, 500);

    } else {
        // Hide all points that are not selected.
        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .selectAll(".dots")
        .selectAll("circle")
            .style("filter", null)
            .style("opacity", null);

        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .selectAll(".dots")
        .selectAll("[data-seqn='" + d.seqn + "']")
            .transition().duration(1000)
            .style("stroke", markColorScale(d.markColorField))
            .style("stroke-width", "2px")
            .style("fill-opacity", 0.3)
            .attr("r", CircleShape.radius)
            .attr("data-selected-dot", null);

        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .selectAll("[data-selected-path='true']")
            .remove();
    }
}
