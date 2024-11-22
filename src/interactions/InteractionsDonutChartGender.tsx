// @ts-nocheck

import * as d3 from "d3";

import { colorScaleGender } from "../components/marks/Color";

export function onDonutChartGenderSliceClick(toggledSlice: boolean, selectedSeqnIdentifiers: Set<number>) {
    // console.log("toggledSlice ", toggledSlice);

    // Handle interactions for `Blood Measures vs. BMI` scatterplot chart.
    // ------------------------------------------------------------------------
    if (toggledSlice) {
        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .select(".chart-1")
        .select(".dots")
        .selectAll("circle")
            .filter(function(d: SVGCircleElement) { 
                return !(selectedSeqnIdentifiers.has(this.dataset.seqn));
            })
            .transition().duration(1000)
            .attr("r", 0);

        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .select(".chart-2")
        .select(".dots")
        .selectAll("circle")
            .filter(function(d: SVGCircleElement) { 
                return !(selectedSeqnIdentifiers.has(this.dataset.seqn));
            })
            .transition().duration(1000)
            .attr("r", 0);

        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .select(".chart-3")
        .select(".dots")
        .selectAll("circle")
            .filter(function(d: SVGCircleElement) { 
                return !(selectedSeqnIdentifiers.has(this.dataset.seqn));
            })
            .transition().duration(1000)
            .attr("r", 0);
            
    } else {
        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .select(".chart-1")
        .select(".dots")
        .selectAll("circle")
            .transition().duration(1000)
            .attr("r", 5);

        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .select(".chart-2")
        .select(".dots")
        .selectAll("circle")
            .transition().duration(1000)
            .attr("r", 5);

        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .select(".chart-3")
        .select(".dots")
        .selectAll("circle")
            .transition().duration(1000)
            .attr("r", 5);
    }

    // Handle interactions for `Waist Circumference vs. BMI` scatterplot chart.
    // ------------------------------------------------------------------------
    if (toggledSlice) {
        d3
        .select(".scatterplot-chart-waist-cirumference-vs-bmi")
        .select(".dots")
        .selectAll("circle")
            .filter(function(d: SVGCircleElement) { 
                return !(selectedSeqnIdentifiers.has(this.dataset.seqn));
            })
            .transition().duration(1000)
            .attr("r", 0);
    } else {
        d3
        .select(".scatterplot-chart-waist-cirumference-vs-bmi")
        .select(".dots")
        .selectAll("circle")
            .transition().duration(1000)
            .attr("r", 5);
    }
}
